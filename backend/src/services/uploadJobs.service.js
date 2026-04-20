const mongoose = require("mongoose");
const UploadJob = require("../models/UploadJob");

async function createUploadJob(userId, type, payload = {}) {
  const job = await UploadJob.create({
    studioUser: userId,
    type,
    status: "queued",
    payload,
    progress: { total: 0, done: 0, message: "Queued" },
  });
  return job;
}

function runUploadJob(jobId, processor) {
  setImmediate(async () => {
    try {
      const job = await UploadJob.findById(jobId);
      if (!job || job.status !== "queued") return;
      job.status = "processing";
      job.startedAt = new Date();
      job.progress = { ...job.progress, message: "Processing" };
      await job.save();

      const updateProgress = async (progress) => {
        await UploadJob.updateOne(
          { _id: jobId, status: "processing" },
          {
            $set: {
              "progress.total": Number(progress?.total || 0),
              "progress.done": Number(progress?.done || 0),
              "progress.message": String(progress?.message || ""),
            },
          }
        );
      };

      const result = await processor(updateProgress);
      await UploadJob.updateOne(
        { _id: jobId },
        {
          $set: {
            status: "completed",
            result,
            completedAt: new Date(),
            "progress.message": "Completed",
          },
        }
      );
    } catch (e) {
      await UploadJob.updateOne(
        { _id: jobId },
        {
          $set: {
            status: "failed",
            errorMessage: e instanceof Error ? e.message : "Job failed",
            completedAt: new Date(),
            "progress.message": "Failed",
          },
        }
      ).catch(() => {});
    }
  });
}

async function getUploadJobForUser(user, jobId) {
  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return { error: { status: 400, message: "Invalid job id" } };
  }
  const q = { _id: jobId };
  if (user.role === "studio") q.studioUser = user.id;
  const job = await UploadJob.findOne(q).lean();
  if (!job) return { error: { status: 404, message: "Job not found" } };
  return {
    job: {
      id: String(job._id),
      type: job.type,
      status: job.status,
      progress: job.progress || { total: 0, done: 0, message: "" },
      result: job.result || null,
      errorMessage: job.errorMessage || "",
      createdAt: job.createdAt,
      startedAt: job.startedAt,
      completedAt: job.completedAt,
    },
  };
}

module.exports = {
  createUploadJob,
  runUploadJob,
  getUploadJobForUser,
};

