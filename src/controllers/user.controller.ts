import { Request, Response, NextFunction } from 'express';
import UserService from '../services/user.service';
import apiResponse from '../utils/apiResponse';
import { PaginationQuery } from '../interfaces/user.dto';

const userService = new UserService();

export async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const dto = req.body;
    const createdBy = (req as any).user?.sub;
    const user = await userService.createUser(dto, createdBy);
    return apiResponse.created(res, user, 'User created');
  } catch (err) {
    next(err);
  }
}

export async function updateUser(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const dto = req.body;
    const updatedBy = (req as any).user?.sub;
    const user = await userService.updateUser(id, dto, updatedBy);
    return apiResponse.success(res, user, 'User updated');
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const deletedBy = (req as any).user?.sub;
    await userService.deleteUser(id, deletedBy);
    return apiResponse.success(res, null, 'User deleted');
  } catch (err) {
    next(err);
  }
}

export async function getUserById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const user = await userService.getUserById(id);
    return apiResponse.success(res, user, 'User fetched');
  } catch (err) {
    next(err);
  }
}

export async function listUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const query: PaginationQuery = req.query as any;
    const data = await userService.listUsers(query);
    return apiResponse.success(res, data, 'Users list');
  } catch (err) {
    next(err);
  }
}

export async function setStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const { isActive } = req.body;
    const user = isActive ? await userService.activateUser(id) : await userService.deactivateUser(id);
    return apiResponse.success(res, user, 'User status updated');
  } catch (err) {
    next(err);
  }
}

export async function lockUser(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const user = await userService.lockUser(id);
    return apiResponse.success(res, user, 'User locked');
  } catch (err) {
    next(err);
  }
}

export async function unlockUser(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const user = await userService.unlockUser(id);
    return apiResponse.success(res, user, 'User unlocked');
  } catch (err) {
    next(err);
  }
}

export async function assignRole(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const { roleId } = req.body;
    const user = await userService.assignRole(id, roleId);
    return apiResponse.success(res, user, 'Role assigned');
  } catch (err) {
    next(err);
  }
}

export async function changePassword(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.sub;
    const { oldPassword, newPassword } = req.body;
    await userService.changePassword(Number(userId), oldPassword, newPassword);
    return apiResponse.success(res, null, 'Password changed');
  } catch (err) {
    next(err);
  }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, newPassword } = req.body;
    await userService.resetPasswordByAdmin(Number(userId), newPassword);
    return apiResponse.success(res, null, 'Password reset');
  } catch (err) {
    next(err);
  }
}

export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.sub;
    const user = await userService.getUserById(Number(userId));
    return apiResponse.success(res, user, 'Profile fetched');
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.sub;
    const dto = req.body;
    const user = await userService.updateProfile(Number(userId), dto);
    return apiResponse.success(res, user, 'Profile updated');
  } catch (err) {
    next(err);
  }
}

export async function uploadProfileImage(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.sub;
    // multer middleware will attach file
    const file = (req as any).file;
    if (!file) return apiResponse.badRequest(res, null, 'No file uploaded');
    // file should have path or buffer depending on multer config
    const imageUrl = (file as any).path || (file as any).location;
    const user = await userService.uploadProfileImage(Number(userId), imageUrl);
    return apiResponse.success(res, user, 'Profile image uploaded');
  } catch (err) {
    next(err);
  }
}

export default {
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  listUsers,
  setStatus,
  lockUser,
  unlockUser,
  assignRole,
  changePassword,
  resetPassword,
  getProfile,
  updateProfile,
  uploadProfileImage
};
