import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, "../frontend/public/anjana-jishnu");

const files = fs
  .readdirSync(srcDir)
  .filter((f) => /\.jpe?g$/i.test(f) && !f.includes("22.39.06"))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

async function compress() {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const num = i + 1;
    const input = path.join(srcDir, file);
    const meta = await sharp(input).metadata();
    const maxDim = Math.max(meta.width ?? 0, meta.height ?? 0);
    const resize =
      maxDim > 1920
        ? { width: 1920, height: 1920, fit: "inside", withoutEnlargement: true }
        : undefined;

    let pipeline = sharp(input).rotate();
    if (resize) pipeline = pipeline.resize(resize);

    const outPath = path.join(srcDir, `img-${num}.webp`);
    await pipeline.webp({ quality: 82 }).toFile(outPath);

    const webpStat = fs.statSync(outPath);
    console.log(`img-${num}: ${file} -> ${(webpStat.size / 1024 / 1024).toFixed(2)}MB`);
  }

  const ogSource = path.join(srcDir, "img-14.webp");
  await sharp(ogSource)
    .resize(1200, 630, { fit: "cover", position: "centre" })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(path.join(srcDir, "og.jpg"));

  console.log("OG image created.");
}

compress().catch((err) => {
  console.error(err);
  process.exit(1);
});
