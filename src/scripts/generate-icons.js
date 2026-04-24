const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const input = path.resolve(process.cwd(), "call-center.png");
const outputDir = path.resolve(process.cwd(), "public/icons");

const sizes = [192, 512];

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function createCircleMask(size) {
  return Buffer.from(
    `<svg width="${size}" height="${size}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="white"/>
    </svg>`
  );
}

async function generateIcons() {
  if (!fs.existsSync(input)) {
    throw new Error(`Arquivo não encontrado: ${input}`);
  }

  for (const size of sizes) {
    const mask = createCircleMask(size);

    await sharp(input)
      .resize(size, size, {
        fit: "contain",
        background: { r: 15, g: 23, b: 42, alpha: 1 } // cor de fundo (Tailwind slate-900)
      })
      .composite([{ input: mask, blend: "dest-in" }])
      .png()
      .toFile(path.join(outputDir, `icon-${size}.png`));

    console.log(`✔ icon-${size}.png gerado`);
  }
}

generateIcons().catch(console.error);