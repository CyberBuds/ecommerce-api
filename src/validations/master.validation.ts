import { body, param, query } from 'express-validator';
import MasterRepository from '../repositories/master.repository';

export function createMasterValidation(repository: MasterRepository) {
  return [
    body('name').trim().notEmpty().withMessage('Name is required').custom(async (value) => {
      if (!value) return true;
      const exists = await repository.findByName(value);
      if (exists) return Promise.reject('Name already exists');
      return true;
    }),
    body('code').trim().notEmpty().withMessage('Code is required').custom(async (value) => {
      if (!value) return true;
      const exists = await repository.findByCode(value);
      if (exists) return Promise.reject('Code already exists');
      return true;
    }),
    body('slug')
      .trim()
      .notEmpty()
      .withMessage('Slug is required')
      .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .withMessage('Slug must be lowercase kebab-case')
      .custom(async (value) => {
        if (!value) return true;
        const exists = await repository.findBySlug(value);
        if (exists) return Promise.reject('Slug already exists');
        return true;
      }),
    body('description').optional().isString(),
    body('image').optional().isString(),
    body('displayOrder').optional().isInt({ min: 0 }).toInt(),
    body('status').optional().isIn(['ACTIVE', 'INACTIVE', 'DRAFT']),
    body('isActive').optional().isBoolean().toBoolean()
  ];
}

export function updateMasterValidation(repository: MasterRepository) {
  return [
    param('id').isInt().withMessage('Invalid id'),
    body('name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Name cannot be empty')
      .custom(async (value, { req }) => {
        if (!value) return true;
        const id = Number(req.params?.id);
        const exists = await repository.findByName(value, id);
        if (exists) return Promise.reject('Name already exists');
        return true;
      }),
    body('code')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Code cannot be empty')
      .custom(async (value, { req }) => {
        if (!value) return true;
        const id = Number(req.params?.id);
        const exists = await repository.findByCode(value, id);
        if (exists) return Promise.reject('Code already exists');
        return true;
      }),
    body('slug')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Slug cannot be empty')
      .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .withMessage('Slug must be lowercase kebab-case')
      .custom(async (value, { req }) => {
        if (!value) return true;
        const id = Number(req.params?.id);
        const exists = await repository.findBySlug(value, id);
        if (exists) return Promise.reject('Slug already exists');
        return true;
      }),
    body('description').optional().isString(),
    body('image').optional().isString(),
    body('displayOrder').optional().isInt({ min: 0 }).toInt(),
    body('status').optional().isIn(['ACTIVE', 'INACTIVE', 'DRAFT']),
    body('isActive').optional().isBoolean().toBoolean()
  ];
}

export function bulkImportValidation() {
  return [
    body('items').isArray({ min: 1 }).withMessage('At least one item is required')
  ];
}

export const masterListValidation = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('pageSize').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('sortBy').optional().isString(),
  query('sortOrder').optional().isIn(['asc', 'desc'])
];

export const masterIdParam = [param('id').isInt().withMessage('Invalid id')];
