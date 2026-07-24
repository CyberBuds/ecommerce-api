import fs from 'fs';
import path from 'path';
import AppError from '../utils/AppError';
import HTTP_STATUS from '../constants/httpStatus';
import MediaRepository from '../repositories/media.repository';
import { MediaListQuery } from '../interfaces/media.dto';
import { deleteFile, generateThumbnail, resizeImage } from '../utils/image';
import { buildPrivateUrl, buildPublicUrl, getMediaExtension, uploadToCloudinary } from '../helpers/media';
import config from '../config/env';

export default class MediaService {
  constructor(private repository: MediaRepository) {}

  async uploadSingle(file: Express.Multer.File, uploadedBy?: number, folder?: string) {
    const ext = getMediaExtension(file.originalname).toLowerCase();
    const isImage = ['jpg', 'jpeg', 'png', 'webp', 'svg'].includes(ext);
    const isDocument = ['pdf', 'doc', 'docx', 'xls', 'xlsx'].includes(ext);
    const isVideo = ['mp4', 'mov'].includes(ext);

    if (!isImage && !isDocument && !isVideo) {
      throw new AppError('Unsupported file type', HTTP_STATUS.BAD_REQUEST, 'UNSUPPORTED_FILE_TYPE');
    }

    const fileSizeLimit = isImage ? 5 * 1024 * 1024 : isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > fileSizeLimit) {
      throw new AppError('File size exceeds limit', HTTP_STATUS.BAD_REQUEST, 'FILE_TOO_LARGE');
    }

    const destinationFolder = folder || 'general';
    const sourcePath = file.path;
    const tempDir = path.resolve(process.cwd(), 'uploads', 'tmp');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    let processedPath = sourcePath;
    let thumbnailPath: string | undefined;

    if (isImage) {
      const resizedPath = path.join(tempDir, `resized-${file.filename}`);
      await resizeImage(sourcePath, resizedPath, { width: 1600 });
      processedPath = resizedPath;

      if (config.CLOUDINARY_CLOUD_NAME && config.CLOUDINARY_API_KEY && config.CLOUDINARY_API_SECRET) {
        thumbnailPath = path.join(tempDir, `thumb-${file.filename}`);
        await generateThumbnail(resizedPath, thumbnailPath, 300);
      }
    }

    const uploadResult = await uploadToCloudinary(processedPath, `saree/${destinationFolder}`, isVideo ? 'video' : isImage ? 'image' : 'raw');

    const payload: Record<string, unknown> = {
      fileName: file.filename,
      originalName: file.originalname,
      extension: ext,
      mimeType: file.mimetype,
      fileSize: file.size,
      folder: destinationFolder,
      storageProvider: 'cloudinary',
      publicId: uploadResult.publicId,
      publicUrl: uploadResult.publicUrl,
      thumbnailUrl: uploadResult.thumbnailUrl || (thumbnailPath ? buildPublicUrl(uploadResult.publicId) : undefined),
      uploadedBy,
      status: 'UPLOADED'
    };

    const item = await this.repository.create(payload);

    deleteFile(sourcePath);
    deleteFile(processedPath);
    if (thumbnailPath) deleteFile(thumbnailPath);

    return item;
  }

  async uploadMultiple(files: Express.Multer.File[], uploadedBy?: number, folder?: string) {
    const results = [] as Array<unknown>;
    for (const file of files) {
      const result = await this.uploadSingle(file, uploadedBy, folder);
      results.push(result);
    }
    return results;
  }

  async uploadDocument(file: Express.Multer.File, uploadedBy?: number, folder?: string) {
    return this.uploadSingle(file, uploadedBy, folder);
  }

  async uploadVideo(file: Express.Multer.File, uploadedBy?: number, folder?: string) {
    return this.uploadSingle(file, uploadedBy, folder);
  }

  async getById(id: number) {
    const item = await this.repository.findById(id);
    if (!item || item.isDeleted) {
      throw new AppError('Media not found', HTTP_STATUS.NOT_FOUND, 'MEDIA_NOT_FOUND');
    }
    return item;
  }

  async list(query: MediaListQuery) {
    return this.repository.list(query);
  }

  async delete(id: number) {
    const item = await this.repository.findById(id);
    if (!item) throw new AppError('Media not found', HTTP_STATUS.NOT_FOUND, 'MEDIA_NOT_FOUND');
    return this.repository.softDelete(id);
  }

  async restore(id: number) {
    const item = await this.repository.findById(id);
    if (!item) throw new AppError('Media not found', HTTP_STATUS.NOT_FOUND, 'MEDIA_NOT_FOUND');
    return this.repository.restore(id);
  }

  async getDownloadUrl(id: number) {
    const item = await this.repository.findById(id);
    if (!item || item.isDeleted) throw new AppError('Media not found', HTTP_STATUS.NOT_FOUND, 'MEDIA_NOT_FOUND');
    const publicId = typeof item.publicId === 'string' ? item.publicId : '';
    const mimeType = typeof item.mimeType === 'string' ? item.mimeType : '';
    return item.publicUrl || buildPrivateUrl(publicId, mimeType.startsWith('video') ? 'video' : 'image');
  }

  async trackUsage(id: number) {
    const item = await this.repository.findById(id);
    if (!item || item.isDeleted) throw new AppError('Media not found', HTTP_STATUS.NOT_FOUND, 'MEDIA_NOT_FOUND');
    return { id, usedAt: new Date().toISOString() };
  }
}
