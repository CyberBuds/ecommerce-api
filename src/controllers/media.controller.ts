import { NextFunction, Request, Response } from 'express';
import apiResponse from '../utils/apiResponse';
import MediaService from '../services/media.service';

export function createMediaController(service: MediaService) {
  return {
    upload: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const file = req.file;
        if (!file) return apiResponse.badRequest(res, null, 'No file uploaded');
        const uploadedBy = (req as any).user?.sub;
        const folder = req.body.folder;
        const media = await service.uploadSingle(file, uploadedBy, folder);
        return apiResponse.created(res, media, 'Media uploaded');
      } catch (error) {
        next(error);
      }
    },

    uploadMultiple: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) return apiResponse.badRequest(res, null, 'No files uploaded');
        const uploadedBy = (req as any).user?.sub;
        const folder = req.body.folder;
        const media = await service.uploadMultiple(files, uploadedBy, folder);
        return apiResponse.created(res, media, 'Media uploaded');
      } catch (error) {
        next(error);
      }
    },

    uploadDocument: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const file = req.file;
        if (!file) return apiResponse.badRequest(res, null, 'No file uploaded');
        const uploadedBy = (req as any).user?.sub;
        const folder = req.body.folder;
        const media = await service.uploadDocument(file, uploadedBy, folder);
        return apiResponse.created(res, media, 'Document uploaded');
      } catch (error) {
        next(error);
      }
    },

    uploadVideo: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const file = req.file;
        if (!file) return apiResponse.badRequest(res, null, 'No file uploaded');
        const uploadedBy = (req as any).user?.sub;
        const folder = req.body.folder;
        const media = await service.uploadVideo(file, uploadedBy, folder);
        return apiResponse.created(res, media, 'Video uploaded');
      } catch (error) {
        next(error);
      }
    },

    list: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const query = req.query as any;
        const result = await service.list(query);
        return apiResponse.success(res, result, 'Media list');
      } catch (error) {
        next(error);
      }
    },

    getById: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const item = await service.getById(id);
        return apiResponse.success(res, item, 'Media fetched');
      } catch (error) {
        next(error);
      }
    },

    delete: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        await service.delete(id);
        return apiResponse.success(res, null, 'Media deleted');
      } catch (error) {
        next(error);
      }
    },

    restore: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const item = await service.restore(id);
        return apiResponse.success(res, item, 'Media restored');
      } catch (error) {
        next(error);
      }
    },

    download: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const url = await service.getDownloadUrl(id);
        return apiResponse.success(res, { url }, 'Download url fetched');
      } catch (error) {
        next(error);
      }
    },

    trackUsage: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const data = await service.trackUsage(id);
        return apiResponse.success(res, data, 'Media usage tracked');
      } catch (error) {
        next(error);
      }
    }
  };
}

export default createMediaController;
