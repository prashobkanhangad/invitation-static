const studioPhotoSelectionService = require("../services/studioPhotoSelection.service");
const uploadJobsService = require("../services/uploadJobs.service");

async function createProject(req, res) {
  try {
    const result = await studioPhotoSelectionService.createProject(
      req.user,
      req.body,
    );
    if (result.error)
      return res
        .status(result.error.status)
        .json({ message: result.error.message });
    return res.status(201).json(result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function listProjects(req, res) {
  const result = await studioPhotoSelectionService.listProjects(req.user);
  return res.json(result);
}

async function getProject(req, res) {
  const result = await studioPhotoSelectionService.getProject(
    req.user,
    req.params.projectId,
  );
  if (result.error)
    return res
      .status(result.error.status)
      .json({ message: result.error.message });
  return res.json(result);
}

async function updateProject(req, res) {
  const result = await studioPhotoSelectionService.updateProject(
    req.user,
    req.params.projectId,
    req.body,
  );
  if (result.error)
    return res
      .status(result.error.status)
      .json({ message: result.error.message });
  return res.json(result);
}

async function uploadPhotos(req, res) {
  try {
    const result = await studioPhotoSelectionService.uploadPhotos(
      req.user,
      req.params.projectId,
      req.files || [],
      req.body,
      req,
    );
    if (result.error)
      return res
        .status(result.error.status)
        .json({ message: result.error.message });
    return res.status(201).json(result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
}

async function preparePhotoDirectUpload(req, res) {
  try {
    const result = await studioPhotoSelectionService.preparePhotoDirectUploads(
      req.user,
      req.params.projectId,
      req.body,
    );
    if (result.error)
      return res
        .status(result.error.status)
        .json({ message: result.error.message });
    return res.json(result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
}

async function commitPhotoDirectUpload(req, res) {
  try {
    const job = await uploadJobsService.createUploadJob(
      req.user.id,
      "photo_selection_commit",
      {
        projectId: req.params.projectId,
      },
    );
    uploadJobsService.runUploadJob(job._id, async (updateProgress) => {
      const result = await studioPhotoSelectionService.commitPhotoDirectUploads(
        req.user,
        req.params.projectId,
        req.body,
        { onProgress: updateProgress },
      );
      if (result.error) throw new Error(result.error.message);
      return result;
    });
    return res.status(202).json({ jobId: String(job._id), status: "queued" });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
}

async function updatePhoto(req, res) {
  const result = await studioPhotoSelectionService.updatePhoto(
    req.user,
    req.params.projectId,
    req.params.photoId,
    req.body,
  );
  if (result.error)
    return res
      .status(result.error.status)
      .json({ message: result.error.message });
  return res.json(result);
}

async function uploadOgImage(req, res) {
  try {
    const result =
      await studioPhotoSelectionService.uploadPhotoSelectionOgImage(
        req.user,
        req.params.projectId,
        req.file,
      );
    if (result.error)
      return res
        .status(result.error.status)
        .json({ message: result.error.message });
    return res.json(result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
}

async function prepareOgImageDirectUpload(req, res) {
  try {
    const result =
      await studioPhotoSelectionService.preparePhotoSelectionOgImageDirectUpload(
        req.user,
        req.params.projectId,
        req.body,
      );
    if (result.error)
      return res
        .status(result.error.status)
        .json({ message: result.error.message });
    return res.json(result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
}

async function commitOgImageDirectUpload(req, res) {
  try {
    const result =
      await studioPhotoSelectionService.commitPhotoSelectionOgImageDirectUpload(
        req.user,
        req.params.projectId,
        req.body,
      );
    if (result.error)
      return res
        .status(result.error.status)
        .json({ message: result.error.message });
    return res.json(result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
}

async function deletePhoto(req, res) {
  const result = await studioPhotoSelectionService.deletePhoto(
    req.user,
    req.params.projectId,
    req.params.photoId,
  );
  if (result.error)
    return res
      .status(result.error.status)
      .json({ message: result.error.message });
  return res.json(result);
}

async function downloadPhoto(req, res) {
  try {
    const variant =
      req.query?.variant === "original" ? "original" : "optimized";
    const resolved = await studioPhotoSelectionService.resolvePhotoDownload(
      req.user,
      req.params.projectId,
      req.params.photoId,
      variant,
    );
    if (resolved.error)
      return res
        .status(resolved.error.status)
        .json({ message: resolved.error.message });

    const upstream = await fetch(resolved.sourceUrl);
    if (!upstream.ok)
      return res.status(502).json({ message: "Failed to fetch source image" });
    const arrayBuffer = await upstream.arrayBuffer();
    const contentType =
      upstream.headers.get("content-type") ||
      (variant === "original" ? resolved.mimeType : "image/webp") ||
      "application/octet-stream";

    res.setHeader("Content-Type", contentType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${resolved.fileName}"`,
    );
    return res.status(200).send(Buffer.from(arrayBuffer));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function downloadSelectedPhotos(req, res) {
  try {
    const variant =
      req.query?.variant === "original" ? "original" : "optimized";
    const job = await uploadJobsService.createUploadJob(
      req.user.id,
      "photo_selection_download_selected",
      {
        projectId: req.params.projectId,
        variant,
      },
    );
    uploadJobsService.runUploadJob(job._id, async (updateProgress) => {
      const result =
        await studioPhotoSelectionService.buildSelectedPhotosDownloadArtifact(
          req.user,
          req.params.projectId,
          variant,
          updateProgress,
        );
      if (result.error) throw new Error(result.error.message);
      return result;
    });
    return res.status(202).json({ jobId: String(job._id), status: "queued" });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function publishProject(req, res) {
  const result = await studioPhotoSelectionService.publishProject(
    req.user,
    req.params.projectId,
  );
  if (result.error)
    return res
      .status(result.error.status)
      .json({ message: result.error.message });
  return res.json(result);
}

async function deletePhotoSelectionProject(req, res) {
  try {
    const result =
      await studioPhotoSelectionService.deletePhotoSelectionProject(
        req.user,
        req.params.projectId,
      );
    if (result.error)
      return res
        .status(result.error.status)
        .json({ message: result.error.message });
    return res.json(result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  createProject,
  listProjects,
  getProject,
  updateProject,
  uploadPhotos,
  preparePhotoDirectUpload,
  commitPhotoDirectUpload,
  updatePhoto,
  uploadOgImage,
  prepareOgImageDirectUpload,
  commitOgImageDirectUpload,
  downloadPhoto,
  downloadSelectedPhotos,
  deletePhoto,
  deletePhotoSelectionProject,
  publishProject,
};
