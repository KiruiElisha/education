const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [144, 192, 512];
const inputImage = path.join(__dirname, '../public/favicon.png');
const outputDir = path.join(__dirname, '../public/pwa-icons');
const screenshotsDir = path.join(__dirname, '../public/screenshots');

// Create output directories if they don't exist
[outputDir, screenshotsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Generate square icons for each size
sizes.forEach(size => {
  sharp(inputImage)
    .resize(size, size, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .toFormat('png')
    .toFile(path.join(outputDir, `icon-${size}x${size}.png`))
    .then(info => console.log(`Generated ${size}x${size} icon`))
    .catch(err => console.error(`Error generating ${size}x${size} icon:`, err));
});

// Generate maskable icon with proper padding and background
sharp(inputImage)
  .resize(Math.floor(512 * 0.8), Math.floor(512 * 0.8), {
    fit: 'contain',
    background: { r: 255, g: 255, b: 255, alpha: 0 }
  })
  .extend({
    top: Math.floor(512 * 0.1),
    bottom: Math.floor(512 * 0.1),
    left: Math.floor(512 * 0.1),
    right: Math.floor(512 * 0.1),
    background: { r: 79, g: 70, b: 229, alpha: 1 }
  })
  .toFormat('png')
  .toFile(path.join(outputDir, 'maskable-icon.png'))
  .then(info => console.log('Generated maskable icon'))
  .catch(err => console.error('Error generating maskable icon:', err));

// Create placeholder screenshots if they don't exist
const placeholderScreenshots = [
  {
    name: 'desktop.png',
    width: 1280,
    height: 720
  },
  {
    name: 'mobile.png',
    width: 750,
    height: 1334
  }
];

placeholderScreenshots.forEach(screenshot => {
  sharp({
    create: {
      width: screenshot.width,
      height: screenshot.height,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
    .composite([
      {
        input: inputImage,
        gravity: 'center'
      }
    ])
    .toFormat('png')
    .toFile(path.join(screenshotsDir, screenshot.name))
    .then(info => console.log(`Generated ${screenshot.name}`))
    .catch(err => console.error(`Error generating ${screenshot.name}:`, err));
}); 