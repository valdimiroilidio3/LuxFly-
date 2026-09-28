import sharp from "sharp";
import { mkdirSync } from "fs";

const SRC = "tmp-img";
const OUT = "public/images";
mkdirSync(OUT, { recursive: true });

// Flood-fill background removal from image borders (hero house isolated on ivory)
async function cutout(input, output) {
  const img = sharp(input).ensureAlpha();
  const { width, height } = await img.metadata();
  const raw = await img.raw().toBuffer();
  const visited = new Uint8Array(width * height);
  const stack = [];
  const tol = 26;
  const seed = [raw[0], raw[1], raw[2]];
  const near = (i) =>
    Math.abs(raw[i] - seed[0]) < tol &&
    Math.abs(raw[i + 1] - seed[1]) < tol &&
    Math.abs(raw[i + 2] - seed[2]) < tol;

  for (let x = 0; x < width; x++) { stack.push([x, 0]); stack.push([x, height - 1]); }
  for (let y = 0; y < height; y++) { stack.push([0, y]); stack.push([width - 1, y]); }

  while (stack.length) {
    const [x, y] = stack.pop();
    if (x < 0 || y < 0 || x >= width || y >= height) continue;
    const p = y * width + x;
    if (visited[p]) continue;
    const i = p * 4;
    if (!near(i)) continue;
    visited[p] = 1;
    raw[i + 3] = 0;
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }

  // Feather the alpha edge slightly for a natural cut
  const cut = sharp(raw, { raw: { width, height, channels: 4 } });
  const alpha = await cut.clone().extractChannel(3).blur(1.1).toBuffer();
  const rgb = await sharp(raw, { raw: { width, height, channels: 4 } }).removeAlpha().toBuffer({ resolveWithObject: true });

  await sharp(rgb.data, { raw: { width, height, channels: 3 } })
    .joinChannel(alpha, { raw: { width, height, channels: 1 } })
    .trim({ threshold: 1 })
    .png({ quality: 92, compressionLevel: 9 })
    .toFile(output);
  console.log("cutout ->", output);
}

async function photo(input, name, w = 1600) {
  await sharp(input).resize(w, null, { withoutEnlargement: true }).webp({ quality: 82 }).toFile(`${OUT}/${name}.webp`);
  console.log("photo ->", name);
}

await cutout(`${SRC}/hero-house.png`, `${OUT}/hero-house.png`);
await photo(`${SRC}/hero-house.png`, "hero-house-fallback", 1400);
await photo(`${SRC}/detail-macro.png`, "detail-macro", 2000);
for (const p of ["lumen", "norte", "aurea", "vela"]) await photo(`${SRC}/proj-${p}.png`, `proj-${p}`);
