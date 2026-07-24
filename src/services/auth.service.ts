import UserRepository from '../repositories/user.repository';
import RefreshTokenRepository from '../repositories/refreshToken.repository';
import { comparePassword, hashPassword } from '../utils/password';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { generateToken } from '../utils/token';
import prisma from '../helpers/prisma';
import { User } from '@prisma/client';
import AppError from '../utils/AppError';
import HTTP_STATUS from '../constants/httpStatus';

export default class AuthService {
  private userRepo: UserRepository;
  private rtRepo: RefreshTokenRepository;

  constructor() {
    this.userRepo = new UserRepository();
    this.rtRepo = new RefreshTokenRepository();
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid credentials', HTTP_STATUS.UNAUTHORIZED, 'INVALID_CREDENTIALS');
    }

    const valid = await comparePassword(password, user.password);
    if (!valid) {
      throw new AppError('Invalid credentials', HTTP_STATUS.UNAUTHORIZED, 'INVALID_CREDENTIALS');
    }

    // generate tokens
    const accessToken = signAccessToken({ sub: user.id, roleId: user.roleId });
    const refreshJwt = signRefreshToken({ sub: user.id });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // default 7 days; could parse from config

    // store refresh token
    await this.rtRepo.create(refreshJwt, user.id, expiresAt);

    // update last login
    await this.userRepo.update(user.id, { lastLogin: new Date() } as any);

    return { accessToken, refreshToken: refreshJwt };
  }

  async logout(refreshToken: string) {
    const rt = await this.rtRepo.findByToken(refreshToken);
    if (!rt) {
      throw new AppError('Invalid token', HTTP_STATUS.BAD_REQUEST, 'INVALID_TOKEN');
    }

    await this.rtRepo.revoke(refreshToken);
    return true;
  }

  async refresh(refreshToken: string) {
    try {
      const payload = verifyRefreshToken(refreshToken) as any;
      const rt = await this.rtRepo.findByToken(refreshToken);
      if (!rt || rt.revoked) {
        throw new AppError('Invalid refresh token', HTTP_STATUS.UNAUTHORIZED, 'INVALID_REFRESH_TOKEN');
      }

      const user = await this.userRepo.findById(payload.sub as number);
      if (!user) {
        throw new AppError('User not found', HTTP_STATUS.NOT_FOUND, 'USER_NOT_FOUND');
      }

      const accessToken = signAccessToken({ sub: user.id, roleId: user.roleId });
      return { accessToken };
    } catch (err) {
      throw new AppError('Invalid refresh token', HTTP_STATUS.UNAUTHORIZED, 'INVALID_REFRESH_TOKEN');
    }
  }

  async changePassword(userId: number, oldPassword: string, newPassword: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new AppError('User not found', HTTP_STATUS.NOT_FOUND, 'USER_NOT_FOUND');

    const valid = await comparePassword(oldPassword, user.password);
    if (!valid) throw new AppError('Invalid credentials', HTTP_STATUS.UNAUTHORIZED, 'INVALID_CREDENTIALS');

    const hashed = await hashPassword(newPassword, Number(process.env.SALT_ROUNDS) || 10);
    await this.userRepo.update(userId, { password: hashed } as any);
    // revoke existing refresh tokens
    await this.rtRepo.deleteByUser(userId);

    return true;
  }

  async forgotPassword(email: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      // do not reveal user existence
      return true;
    }

    // create reset token store in refreshTokens table as short-lived token or implement dedicated table
    const resetToken = generateToken(24);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes
    await this.rtRepo.create(resetToken, user.id, expiresAt);

    // send email flow would go here (omitted)
    return true;
  }

  async resetPassword(token: string, newPassword: string) {
    const rt = await this.rtRepo.findByToken(token);
    if (!rt || rt.revoked || rt.expiresAt < new Date()) {
      throw new AppError('Invalid or expired token', HTTP_STATUS.BAD_REQUEST, 'INVALID_TOKEN');
    }

    const hashed = await hashPassword(newPassword, Number(process.env.SALT_ROUNDS) || 10);
    await this.userRepo.update(rt.userId, { password: hashed } as any);
    await this.rtRepo.revoke(token);
    return true;
  }
}
