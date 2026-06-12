import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, "../frontend/public/Puneeth_Suma");
const outDir = path.join(__dirname, "../frontend/public/puneeth-suma");

const files = fs
  .readdirSync(srcDir)
  .filter((f) => /\.jpe?g$/i.test(f))
  .sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)?.[0] ?? "0", 10);
    const numB = parseInt(b.match(/\d+/)?.[0] ?? "0", 10);
    return numA - numB;
  });

async function compress() {
  fs.mkdirSync(outDir, { recursive: true });

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const num = i + 1;
    const input = path.join(srcDir, file);
    const meta = await sharp(input).metadata();
    const maxDim = Math.max(meta.width ?? 0, meta.height ?? 0);
    const resize = maxDim > 1920 ? { width: 1920, height: 1920, fit: "inside", withoutEnlargement: true } : undefined;

    let pipeline = sharp(input).rotate();
    if (resize) pipeline = pipeline.resize(resize);

    await pipeline.webp({ quality: 82 }).toFile(path.join(outDir, `img-${num}.webp`));

    const webpStat = fs.statSync(path.join(outDir, `img-${num}.webp`));
    console.log(`img-${num}: ${file} -> webp ${(webpStat.size / 1024 / 1024).toFixed(2)}MB`);
  }

  await sharp(path.join(outDir, "img-1.webp"))
    .resize(1200, 630, { fit: "cover", position: "centre" })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(path.join(outDir, "og.jpg"));

  console.log("OG image created.");
}

compress().catch(console.error);
