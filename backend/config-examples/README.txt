Direct browser uploads use signed PUT URLs to your bucket. The bucket must allow CORS from your Next.js origin or the browser will fail with "Network error" / status 0.

Google Cloud Storage
--------------------
1. Edit gcs-bucket-cors.json: add your production origin(s) to "origin" (https://yourdomain.com).
2. Apply:
   gsutil cors set backend/config-examples/gcs-bucket-cors.json gs://YOUR_BUCKET_NAME

Or: Cloud Console → Storage → your bucket → Permissions → CORS (edit JSON).

Amazon S3
---------
In S3 → bucket → Permissions → Cross-origin resource sharing (CORS), use something like:

[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "HEAD"],
    "AllowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
    "ExposeHeaders": ["ETag"]
  }
]

Save. OPTIONS is implied for preflight.

After changing CORS, hard-refresh the studio page and retry upload.
