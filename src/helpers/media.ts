import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import config from '../config/env';

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME || '',
  api_key: config.CLOUDINARY_API_KEY || '',
  api_secret: config.CLOUDINARY_API_SECRET || ''
});

export interface UploadResult {
  publicId: string;
  publicUrl: string;
  thumbnailUrl?: string;
  resourceType: 'image' | 'video' | 'raw';
}

export async function uploadToCloudinary(filePath: string, folder: string, resourceType: 'image' | 'video' | 'raw' = 'image') {
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: resourceType,
    use_filename: true,
    unique_filename: false
  });

  return {
    publicId: result.public_id,
    publicUrl: result.secure_url,
    thumbnailUrl: result.thumbnail_url,
    resourceType
  } satisfies UploadResult;
}

export function buildSignedUploadUrl(folder: string) {
  return {
    folder,
    timestamp: Math.floor(Date.now() / 1000),
    signature: 'placeholder-signature'
  };
}

export function buildPublicUrl(publicId: string, resourceType: 'image' | 'video' | 'raw' = 'image') {
  return cloudinary.url(publicId, { resource_type: resourceType });
}

export function buildPrivateUrl(publicId: string, resourceType: 'image' | 'video' | 'raw' = 'image') {
  return cloudinary.url(publicId, { resource_type: resourceType, sign_url: true });
}

export function ensureUploadDir(uploadDir: string) {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
}

export function getMediaExtension(fileName: string) {
  return path.extname(fileName).replace('.', '').toLowerCase();
}
