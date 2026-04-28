require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const { connectDB } = require("./config/db");
const { seedTemplatesIfNeeded } = require("./seed/templates.seed");
const { seedDefaultPlansIfEmpty } = require("./services/plans.service");

const templatesRoutes = require("./routes/templates.routes");
const authRoutes = require("./routes/auth.routes");
const clientAuthRoutes = require("./routes/client/auth.routes");
const clientProjectsRoutes = require("./routes/client/projects.routes");
const publicProjectsRoutes = require("./routes/public/publicProjects.routes");
const adminUsersRoutes = require("./routes/admin/users.routes");
const adminSettingsRoutes = require("./routes/admin/settings.routes");
const studioAlbumsRoutes = require("./routes/studio/albums.routes");
const studioPhotoSelectionRoutes = require("./routes/studio/photoSelection.routes");
const studioAccountRoutes = require("./routes/studio/account.routes");
const studioUploadJobsRoutes = require("./routes/studio/uploadJobs.routes");
const studioPlansRoutes = require("./routes/studio/plans.routes");

const app = express();

const PORT = process.env.PORT || 5001;
const allowedOrigins = String(process.env.CORS_ORIGIN)
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

// Middleware
app.use(
  cors({
    origin(origin, callback) {
      // Allow server-to-server requests and tools without an Origin header.
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS blocked for this origin"));
    },
    credentials: false,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

// Health
app.get("/health", (_req, res) => res.json({ ok: true }));

// API
app.use("/api/templates", templatesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/client/auth", clientAuthRoutes);
app.use("/api/client", clientProjectsRoutes);
app.use("/api/admin/users", adminUsersRoutes);
app.use("/api/admin/settings", adminSettingsRoutes);
app.use("/api/studio/albums", studioAlbumsRoutes);
app.use("/api/studio/photo-selection", studioPhotoSelectionRoutes);
app.use("/api/studio/account", studioAccountRoutes);
app.use("/api/studio/upload-jobs", studioUploadJobsRoutes);
app.use("/api/studio/plans", studioPlansRoutes);
app.use("/api/public", publicProjectsRoutes);

// Error handler for multer + general API errors.
app.use((err, _req, res, _next) => {
  // eslint-disable-next-line no-console
  console.error("API error:", err);
  const status =
    err.statusCode && Number.isInteger(err.statusCode) ? err.statusCode : 400;
  const message = err.message || "Request failed";
  res.status(status).json({ message });
});

async function start() {
  await connectDB();
  await seedTemplatesIfNeeded();
  await seedDefaultPlansIfEmpty();

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend listening on port ${PORT}`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start server:", err);
  process.exit(1);
});

