import prisma from '../helpers/prisma';
import { buildPagination } from '../utils/pagination';
import { MasterListQuery } from '../interfaces/master.dto';

export default class MasterRepository {
  constructor(private modelName: string, private prismaClient: any = prisma) {}

  private getModel() {
    return this.prismaClient[this.modelName];
  }

  async findById(id: number) {
    return this.getModel().findUnique({ where: { id } });
  }

  async findByName(name: string, excludeId?: number) {
    const where: Record<string, unknown> = { name, isDeleted: false };
    if (excludeId) {
      where.id = { not: excludeId };
    }
    return this.getModel().findFirst({ where });
  }

  async findByCode(code: string, excludeId?: number) {
    const where: Record<string, unknown> = { code, isDeleted: false };
    if (excludeId) {
      where.id = { not: excludeId };
    }
    return this.getModel().findFirst({ where });
  }

  async findBySlug(slug: string, excludeId?: number) {
    const where: Record<string, unknown> = { slug, isDeleted: false };
    if (excludeId) {
      where.id = { not: excludeId };
    }
    return this.getModel().findFirst({ where });
  }

  async create(data: Record<string, unknown>) {
    return this.getModel().create({ data });
  }

  async update(id: number, data: Record<string, unknown>) {
    return this.getModel().update({ where: { id }, data });
  }

  async softDelete(id: number, updatedBy?: number) {
    return this.getModel().update({
      where: { id },
      data: {
        isDeleted: true,
        isActive: false,
        ...(updatedBy ? { updatedBy } : {})
      }
    });
  }

  async setStatus(id: number, status: string, updatedBy?: number) {
    return this.update(id, {
      status,
      ...(updatedBy ? { updatedBy } : {})
    });
  }

  async setDisplayOrder(id: number, displayOrder: number, updatedBy?: number) {
    return this.update(id, {
      displayOrder,
      ...(updatedBy ? { updatedBy } : {})
    });
  }

  async bulkCreate(items: Record<string, unknown>[]) {
    return this.getModel().createMany({ data: items });
  }

  async list(query: MasterListQuery = {}) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 20;
    const skip = (page - 1) * pageSize;

    const where: Record<string, unknown> = query.includeDeleted ? {} : { isDeleted: false };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { code: { contains: query.search, mode: 'insensitive' } },
        { slug: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } }
      ];
    }

    if (query.filters) {
      Object.assign(where, query.filters);
    }

    if (query.status) {
      where.status = query.status;
    }

    if (typeof query.isActive === 'boolean') {
      where.isActive = query.isActive;
    }

    const orderBy: Record<string, 'asc' | 'desc'> = {};
    const sortBy = query.sortBy && ['name', 'code', 'slug', 'displayOrder', 'status', 'isActive', 'createdAt', 'updatedAt'].includes(query.sortBy)
      ? query.sortBy
      : 'createdAt';
    orderBy[sortBy] = query.sortOrder === 'desc' ? 'desc' : 'asc';

    const [items, total] = await Promise.all([
      this.getModel().findMany({ where, orderBy, skip, take: pageSize }),
      this.getModel().count({ where })
    ]);

    return {
      items,
      ...buildPagination(page, pageSize, total)
    };
  }
}
