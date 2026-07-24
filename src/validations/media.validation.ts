import { body, param, query } from 'express-validator';

const imageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
const documentTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
const videoTypes = ['video/mp4', 'video/quicktime'];

export const mediaUploadValidation = [
  body('folder').optional().trim().isString().isLength({ max: 100 }).withMessage('Folder must be a valid string'),
  body('maxFiles').optional().isInt({ min: 1, max: 20 }).toInt()
];

export const mediaIdParam = [param('id').isInt().withMessage('Invalid media id')];

export const mediaListValidation = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('pageSize').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('search').optional().isString(),
  query('sortBy').optional().isString(),
  query('sortOrder').optional().isIn(['asc', 'desc'])
];

export function validateAllowedMimeType(mimeType: string, type: 'image' | 'document' | 'video') {
  const allowed = type === 'image' ? imageTypes : type === 'document' ? documentTypes : videoTypes;
  return allowed.includes(mimeType);
}

export function getAllowedMimeTypes(type: 'image' | 'document' | 'video') {
  return type === 'image' ? imageTypes : type === 'document' ? documentTypes : videoTypes;
}
