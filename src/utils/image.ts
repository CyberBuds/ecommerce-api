import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export interface ImageTransformOptions {
  width?: number;
  height?: number;
  quality?: number;
}

export async function compressImage(inputPath: string, outputPath: string, options: ImageTransformOptions = {}) {
  const width = options.width ?? 1600;
  const height = options.height;
  const quality = options.quality ?? 85;

  await sharp(inputPath)
    .resize({ width, height, fit: 'inside' })
    .jpeg({ quality })
    .toFile(outputPath);

  return outputPath;
}

export async function resizeImage(inputPath: string, outputPath: string, options: ImageTransformOptions = {}) {
  const width = options.width ?? 1200;
  const height = options.height;

  await sharp(inputPath)
    .resize({ width, height, fit: 'inside' })
    .toFile(outputPath);

  return outputPath;
}

export async function generateThumbnail(inputPath: string, outputPath: string, width = 300) {
  await sharp(inputPath).resize({ width, fit: 'cover' }).toFile(outputPath);
  return outputPath;
}

export function deleteFile(filePath: string) {
  if (!filePath) return;
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}
