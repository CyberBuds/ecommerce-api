import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import validate from '../middlewares/validation.middleware';
import { createUserValidation, updateUserValidation, paginationValidation, userIdParam } from '../validations/user.validation';
import authenticate from '../middlewares/authenticate';
import authorize from '../middlewares/authorize';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

const router = Router();

// Protect routes - assume authenticate middleware sets req.user

/**
 * @openapi
 * /api/v1/users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Create a new user
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.post('/', authenticate, authorize({ roles: ['Super Admin'] }), createUserValidation, validate, userController.createUser);

/**
 * @openapi
 * /api/v1/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: List users
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.get('/', authenticate, authorize({ roles: ['Admin', 'Super Admin'] }), paginationValidation, validate, userController.listUsers);

/**
 * @openapi
 * /api/v1/users/profile:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get the authenticated user's profile
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', authenticate, userController.getProfile);

/**
 * @openapi
 * /api/v1/users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get a user by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: User not found
 */
router.get('/:id', authenticate, authorize({ roles: ['Admin', 'Super Admin'] }), userIdParam, validate, userController.getUserById);

/**
 * @openapi
 * /api/v1/users/{id}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update a user
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: User not found
 */
router.put('/:id', authenticate, authorize({ roles: ['Admin', 'Super Admin'] }), updateUserValidation, validate, userController.updateUser);

/**
 * @openapi
 * /api/v1/users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete a user
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: User not found
 */
router.delete('/:id', authenticate, authorize({ roles: ['Super Admin'] }), userIdParam, validate, userController.deleteUser);

/**
 * @openapi
 * /api/v1/users/{id}/status:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Set a user's status (e.g. active/inactive)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: User status updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: User not found
 */
router.patch('/:id/status', authenticate, authorize({ roles: ['Admin', 'Super Admin'] }), userIdParam, validate, userController.setStatus);

/**
 * @openapi
 * /api/v1/users/{id}/lock:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Lock a user account
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User account locked successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: User not found
 */
router.patch('/:id/lock', authenticate, authorize({ roles: ['Admin', 'Super Admin'] }), userIdParam, validate, userController.lockUser);

/**
 * @openapi
 * /api/v1/users/{id}/unlock:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Unlock a user account
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User account unlocked successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: User not found
 */
router.patch('/:id/unlock', authenticate, authorize({ roles: ['Admin', 'Super Admin'] }), userIdParam, validate, userController.unlockUser);

/**
 * @openapi
 * /api/v1/users/{id}/role:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Assign a role to a user
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Role assigned successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       404:
 *         description: User not found
 */
router.patch('/:id/role', authenticate, authorize({ roles: ['Super Admin'] }), userIdParam, validate, userController.assignRole);

/**
 * @openapi
 * /api/v1/users/change-password:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Change the authenticated user's own password
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Validation error or incorrect current password
 *       401:
 *         description: Unauthorized
 */
router.patch('/change-password', authenticate, userController.changePassword);

/**
 * @openapi
 * /api/v1/users/reset-password:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Reset a user's password (admin action)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 description: Optional - if omitted, a temporary password may be generated
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.patch('/reset-password', authenticate, authorize({ roles: ['Super Admin'] }), userController.resetPassword);

/**
 * @openapi
 * /api/v1/users/profile:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update the authenticated user's own profile
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.put('/profile', authenticate, userController.updateProfile);

/**
 * @openapi
 * /api/v1/users/profile-image:
 *   post:
 *     tags:
 *       - Users
 *     summary: Upload the authenticated user's profile image
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile image uploaded successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/profile-image', authenticate, upload.single('image'), userController.uploadProfileImage);

export default router;