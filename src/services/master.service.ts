import AppError from '../utils/AppError';
import HTTP_STATUS from '../constants/httpStatus';
import MasterRepository from '../repositories/master.repository';
import { CreateMasterDto, MasterListQuery, UpdateMasterDto } from '../interfaces/master.dto';

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default class MasterService {
  constructor(private repository: MasterRepository) {}

  private async assertUnique(dto: Partial<CreateMasterDto> | Partial<UpdateMasterDto>, excludeId?: number) {
    if (dto.name) {
      const existingName = await this.repository.findByName(dto.name, excludeId);
      if (existingName) {
        throw new AppError('Name already exists', HTTP_STATUS.BAD_REQUEST, 'DUPLICATE_NAME');
      }
    }

    if (dto.code) {
      const existingCode = await this.repository.findByCode(dto.code, excludeId);
      if (existingCode) {
        throw new AppError('Code already exists', HTTP_STATUS.BAD_REQUEST, 'DUPLICATE_CODE');
      }
    }

    if (dto.slug) {
      const existingSlug = await this.repository.findBySlug(dto.slug, excludeId);
      if (existingSlug) {
        throw new AppError('Slug already exists', HTTP_STATUS.BAD_REQUEST, 'DUPLICATE_SLUG');
      }
    }
  }

  private buildPayload(dto: Partial<CreateMasterDto> | Partial<UpdateMasterDto>, createdBy?: number, updatedBy?: number) {
    const payload: Record<string, unknown> = { ...dto };

    if (payload.name && !payload.slug) {
      payload.slug = slugify(String(payload.name));
    }

    if (payload.slug) {
      payload.slug = slugify(String(payload.slug));
    }

    if (payload.displayOrder === undefined) {
      payload.displayOrder = 0;
    }

    if (payload.status) {
      payload.status = String(payload.status).toUpperCase();
    }

    if (createdBy) {
      payload.createdBy = createdBy;
    }

    if (updatedBy) {
      payload.updatedBy = updatedBy;
    }

    return payload;
  }

  async create(dto: CreateMasterDto, createdBy?: number) {
    const payload = this.buildPayload(dto, createdBy);
    await this.assertUnique(payload);
    return this.repository.create(payload);
  }

  async update(id: number, dto: UpdateMasterDto, updatedBy?: number) {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new AppError('Record not found', HTTP_STATUS.NOT_FOUND, 'RECORD_NOT_FOUND');
    }

    const payload = this.buildPayload(dto, undefined, updatedBy);
    await this.assertUnique(payload, id);
    return this.repository.update(id, payload);
  }

  async delete(id: number, deletedBy?: number) {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new AppError('Record not found', HTTP_STATUS.NOT_FOUND, 'RECORD_NOT_FOUND');
    }
    return this.repository.softDelete(id, deletedBy);
  }

  async getById(id: number) {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new AppError('Record not found', HTTP_STATUS.NOT_FOUND, 'RECORD_NOT_FOUND');
    }
    return item;
  }

  async list(query: MasterListQuery) {
    return this.repository.list(query);
  }

  async setStatus(id: number, status: string, updatedBy?: number) {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new AppError('Record not found', HTTP_STATUS.NOT_FOUND, 'RECORD_NOT_FOUND');
    }
    return this.repository.setStatus(id, status.toUpperCase(), updatedBy);
  }

  async setDisplayOrder(id: number, displayOrder: number, updatedBy?: number) {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new AppError('Record not found', HTTP_STATUS.NOT_FOUND, 'RECORD_NOT_FOUND');
    }
    return this.repository.setDisplayOrder(id, displayOrder, updatedBy);
  }

  async bulkImport(items: CreateMasterDto[], createdBy?: number) {
    const createdItems = [] as Array<Record<string, unknown>>;
    for (const item of items) {
      const payload = this.buildPayload(item, createdBy);
      await this.assertUnique(payload);
      createdItems.push(payload);
    }
    await this.repository.bulkCreate(createdItems);
    return createdItems;
  }

  async bulkExport(query: MasterListQuery) {
    return this.repository.list({ ...query, pageSize: 1000 });
  }
}
