import prisma from '../helpers/prisma';
import { Role } from '@prisma/client';

export default class RoleRepository {
  async findById(id: number): Promise<Role | null> {
    return prisma.role.findUnique({ where: { id } });
  }

  async findByName(name: string): Promise<Role | null> {
    return prisma.role.findUnique({ where: { name } });
  }

  async create(name: string, description?: string): Promise<Role> {
    return prisma.role.create({ data: { name, description } });
  }
}
