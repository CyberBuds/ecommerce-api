import { Router, Request, Response, NextFunction } from 'express';
import { body, param } from 'express-validator';
import authenticate from '../middlewares/authenticate';
import authorize from '../middlewares/authorize';
import validate from '../middlewares/validation.middleware';
import prisma from '../helpers/prisma';
import apiResponse from '../utils/apiResponse';

const router = Router();
const adminOnly = [authenticate, authorize({ roles: ['Super Admin', 'Admin'] })];
const idParam = param('attributeId').isInt({ min: 1 }).toInt();
const valueIdParam = param('valueId').isInt({ min: 1 }).toInt();
const valueValidation = [
  body('value').trim().notEmpty().withMessage('Value is required'),
  body('code').optional().isString().trim(),
  body('slug').optional().isString().trim(),
  body('extra').optional().isString(),
  body('status').optional().isIn(['ACTIVE', 'INACTIVE', 'DRAFT']),
  body('isActive').optional().isBoolean().toBoolean(),
];

router.get('/:attributeId/values', authenticate, idParam, validate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await prisma.attributeValue.findMany({
      where: { attributeId: Number(req.params.attributeId), isDeleted: false },
      orderBy: { createdAt: 'asc' },
    });
    return apiResponse.success(res, items, 'Attribute values fetched');
  } catch (error) { next(error); }
});

router.post('/:attributeId/values', ...adminOnly, idParam, ...valueValidation, validate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const attributeId = Number(req.params.attributeId);
    const item = await prisma.attributeValue.create({ data: { ...req.body, attributeId, createdBy: (req as any).user?.sub } });
    return apiResponse.created(res, item, 'Attribute value created');
  } catch (error) { next(error); }
});

router.put('/:attributeId/values/:valueId', ...adminOnly, idParam, valueIdParam, ...valueValidation, validate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const valueId = Number(req.params.valueId);
    const attributeId = Number(req.params.attributeId);
    const result = await prisma.attributeValue.updateMany({
      where: { id: valueId, attributeId, isDeleted: false },
      data: { ...req.body, updatedBy: (req as any).user?.sub },
    });
    if (!result.count) return res.status(404).json({ success: false, message: 'Attribute value not found' });
    const item = await prisma.attributeValue.findUniqueOrThrow({ where: { id: valueId } });
    return apiResponse.success(res, item, 'Attribute value updated');
  } catch (error) { next(error); }
});

router.delete('/:attributeId/values/:valueId', ...adminOnly, idParam, valueIdParam, validate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await prisma.attributeValue.updateMany({
      where: { id: Number(req.params.valueId), attributeId: Number(req.params.attributeId), isDeleted: false },
      data: { isDeleted: true, isActive: false, updatedBy: (req as any).user?.sub },
    });
    if (!result.count) return res.status(404).json({ success: false, message: 'Attribute value not found' });
    return apiResponse.success(res, null, 'Attribute value deleted');
  } catch (error) { next(error); }
});

export default router;
