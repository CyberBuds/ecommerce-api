import prisma from '../helpers/prisma';
import { User, UserStatus } from '@prisma/client';

export interface UserListQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

export default class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });
  }

  async findByMobile(mobile: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { mobile },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });
  }

  async findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({ where: { id }, include: { role: { include: { permissions: true } } } });
  }

  async create(data: Partial<User>): Promise<User> {
    return prisma.user.create({ data: data as any });
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    return prisma.user.update({ where: { id }, data: data as any });
  }

  async softDelete(id: number): Promise<User> {
    return prisma.user.update({ where: { id }, data: { isActive: false, status: UserStatus.INACTIVE } });
  }

  async list(query: UserListQuery) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 20;
    const skip = (page - 1) * pageSize;

    const where: any = {};

    if (query.search) {
      where.OR = [
        { firstName: { contains: query.search, mode: 'insensitive' } },
        { lastName: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { mobile: { contains: query.search, mode: 'insensitive' } }
      ];
    }

    if (query.filters) {
      Object.assign(where, query.filters);
    }

    const orderBy: any = {};
    if (query.sortBy) {
      orderBy[query.sortBy] = query.sortOrder === 'desc' ? 'desc' : 'asc';
    } else {
      orderBy['createdAt'] = 'desc';
    }

    const [items, total] = await Promise.all([
      prisma.user.findMany({ where, orderBy, skip, take: pageSize, include: { role: true } }),
      prisma.user.count({ where })
    ]);

    return { items, total, page, pageSize };
  }

  async assignRole(userId: number, roleId: number): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: { roleId },
      include: { role: { include: { permissions: true } } },
    });
  }

  async setLock(userId: number, locked: boolean): Promise<User> {
    return prisma.user.update({ where: { id: userId }, data: { isLocked: locked } });
  }

  async setActive(userId: number, active: boolean): Promise<User> {
    return prisma.user.update({ where: { id: userId }, data: { isActive: active } });
  }
}
