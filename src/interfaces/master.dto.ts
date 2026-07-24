export type MasterStatus = 'ACTIVE' | 'INACTIVE' | 'DRAFT';

export interface MasterListQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, unknown>;
  status?: MasterStatus;
  isActive?: boolean;
  includeDeleted?: boolean;
}

export interface CreateMasterDto {
  name: string;
  code: string;
  description?: string | null;
  slug?: string;
  image?: string | null;
  displayOrder?: number;
  status?: MasterStatus;
  isActive?: boolean;
}

export interface UpdateMasterDto extends Partial<CreateMasterDto> {}

export interface BulkImportDto<T = CreateMasterDto> {
  items: T[];
}

export interface MasterListResponseDto<T = unknown> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
