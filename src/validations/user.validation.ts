import { body, param, query } from 'express-validator';
import UserRepository from '../repositories/user.repository';
import RoleRepository from '../repositories/role.repository';

const userRepo = new UserRepository();
const roleRepo = new RoleRepository();

export const createUserValidation = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .bail()
    .custom(async (value) => {
      const exists = await userRepo.findByEmail(value);
      if (exists) return Promise.reject('Email already in use');
      return true;
    }),
  body('mobile')
    .optional()
    .isMobilePhone('any')
    .bail()
    .custom(async (value) => {
      const exists = await userRepo.findByMobile(value);
      if (exists) return Promise.reject('Mobile already in use');
      return true;
    }),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('roleId')
    .optional()
    .isInt()
    .bail()
    .custom(async (value) => {
      const role = await roleRepo.findById(Number(value));
      if (!role) return Promise.reject('Role not found');
      return true;
    })
];

export const updateUserValidation = [
  param('id').isInt().withMessage('Invalid user id'),
  body('email')
    .optional()
    .isEmail()
    .bail()
    .custom(async (value, { req }) => {
      const userId = Number(req.params?.id);
      const exists = await userRepo.findByEmail(value);
      if (exists && exists.id !== userId) return Promise.reject('Email already in use');
      return true;
    }),
  body('mobile')
    .optional()
    .isMobilePhone('any')
    .bail()
    .custom(async (value, { req }) => {
      const userId = Number(req.params?.id);
      const exists = await userRepo.findByMobile(value);
      if (exists && exists.id !== userId) return Promise.reject('Mobile already in use');
      return true;
    }),
  body('roleId')
    .optional()
    .isInt()
    .bail()
    .custom(async (value) => {
      const role = await roleRepo.findById(Number(value));
      if (!role) return Promise.reject('Role not found');
      return true;
    })
];

export const paginationValidation = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('pageSize').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('sortBy').optional().isString(),
  query('sortOrder').optional().isIn(['asc', 'desc'])
];

export const userIdParam = [param('id').isInt().withMessage('Invalid user id')];
