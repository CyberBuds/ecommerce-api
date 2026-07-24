import prisma from '../helpers/prisma';
import { RefreshToken } from '@prisma/client';

export default class RefreshTokenRepository {
  async create(token: string, userId: number, expiresAt: Date): Promise<RefreshToken> {
    return prisma.refreshToken.create({ data: { token, userId, expiresAt } });
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    return prisma.refreshToken.findUnique({ where: { token } });
  }

  async revoke(token: string): Promise<RefreshToken> {
    return prisma.refreshToken.update({ where: { token }, data: { revoked: true } });
  }

  async deleteByUser(userId: number): Promise<void> {
    await prisma.refreshToken.deleteMany({ where: { userId } });
  }
}
