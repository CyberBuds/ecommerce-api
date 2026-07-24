import prisma from '../helpers/prisma';
import { Permission } from '@prisma/client';

export default class PermissionRepository {
  async findByResourceAndAction(resource: string, action: string): Promise<Permission | null> {
    return prisma.permission.findUnique({ where: { resource_action: { resource, action: action as any } } });
  }

  async findAll(): Promise<Permission[]> {
    return prisma.permission.findMany();
  }

  async create(resource: string, action: string): Promise<Permission> {
    return prisma.permission.create({ data: { resource, action: action as any } });
  }
}
