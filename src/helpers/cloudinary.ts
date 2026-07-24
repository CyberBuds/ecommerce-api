import { v2 as cloudinary } from 'cloudinary';
import config from '../config/env';

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME || '',
  api_key: config.CLOUDINARY_API_KEY || '',
  api_secret: config.CLOUDINARY_API_SECRET || ''
});

export async function uploadImage(path: string) {
  const result = await cloudinary.uploader.upload(path, { folder: 'saree/profile' });
  return result.secure_url;
}

export default cloudinary;
