import prisma from '../helpers/prisma';
import { MediaListQuery } from '../interfaces/media.dto';
import { buildPagination } from '../utils/pagination';

export default class MediaRepository {
  async findById(id: number) {
    return prisma.media.findUnique({ where: { id } });
  }

  async create(data: Record<string, unknown>) {
    return prisma.media.create({ data: data as any });
  }

  async update(id: number, data: Record<string, unknown>) {
    return prisma.media.update({ where: { id }, data: data as any });
  }

  async softDelete(id: number, updatedBy?: number) {
    return prisma.media.update({
      where: { id },
      data: { isDeleted: true, status: 'DELETED' as any, ...(updatedBy ? { uploadedBy: updatedBy } : {}) }
    });
  }

  async restore(id: number) {
    return prisma.media.update({ where: { id }, data: { isDeleted: false, status: 'UPLOADED' as any } });
  }

  async list(query: MediaListQuery = {}) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const pageSize = query.pageSize && query.pageSize > 0 ? query.pageSize : 20;
    const skip = (page - 1) * pageSize;

    const where: Record<string, unknown> = {};
    if (typeof query.isDeleted === 'boolean') {
      where.isDeleted = query.isDeleted;
    }

    if (query.folder) {
      where.folder = query.folder;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      where.OR = [
        { fileName: { contains: query.search, mode: 'insensitive' } },
        { originalName: { contains: query.search, mode: 'insensitive' } },
        { mimeType: { contains: query.search, mode: 'insensitive' } }
      ];
    }

    if (query.filters) {
      Object.assign(where, query.filters);
    }

    const orderBy: Record<string, 'asc' | 'desc'> = {};
    const sortBy = query.sortBy && ['fileName', 'originalName', 'fileSize', 'createdAt', 'updatedAt'].includes(query.sortBy)
      ? query.sortBy
      : 'createdAt';
    orderBy[sortBy] = query.sortOrder === 'desc' ? 'desc' : 'asc';

    const [items, total] = await Promise.all([prisma.media.findMany({ where, orderBy, skip, take: pageSize }), prisma.media.count({ where })]);

    return {
      items,
      ...buildPagination(page, pageSize, total)
    };
  }
}
