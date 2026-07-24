import { Request, Response, NextFunction } from 'express';
import ProfileService from '../services/profile.service';
import apiResponse from '../utils/apiResponse';

const profileService = new ProfileService();

export async function uploadProfileImage(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.sub;
    const file = (req as any).file;
    if (!file) return apiResponse.badRequest(res, null, 'No file uploaded');
    const user = await profileService.uploadProfileImage(Number(userId), file.path);
    return apiResponse.success(res, user, 'Profile image uploaded');
  } catch (err) {
    next(err);
  }
}

export default { uploadProfileImage };
