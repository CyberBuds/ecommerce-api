import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/auth.service';
import apiResponse from '../utils/apiResponse';

const authService = new AuthService();

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const tokens = await authService.login(email, password);
    return apiResponse.success(res, tokens, 'Login successful');
  } catch (err) {
    return next(err);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);
    return apiResponse.success(res, null, 'Logged out');
  } catch (err) {
    return next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;
    const data = await authService.refresh(refreshToken);
    return apiResponse.success(res, data, 'Token refreshed');
  } catch (err) {
    return next(err);
  }
}

export async function changePassword(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.sub;
    const { oldPassword, newPassword } = req.body;
    await authService.changePassword(Number(userId), oldPassword, newPassword);
    return apiResponse.success(res, null, 'Password changed');
  } catch (err) {
    return next(err);
  }
}

export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;
    await authService.forgotPassword(email);
    return apiResponse.success(res, null, 'If the email exists, a reset link has been sent');
  } catch (err) {
    return next(err);
  }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { token, newPassword } = req.body;
    await authService.resetPassword(token, newPassword);
    return apiResponse.success(res, null, 'Password reset successful');
  } catch (err) {
    return next(err);
  }
}

export default { login, logout, refresh, changePassword, forgotPassword, resetPassword };
