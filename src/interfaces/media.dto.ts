export type MediaStatus = 'UPLOADED' | 'PROCESSING' | 'FAILED' | 'DELETED';

export interface CreateMediaDto {
  fileName: string;
  originalName: string;
  extension: string;
  mimeType: string;
  fileSize: number;
  width?: number | null;
  height?: number | null;
  duration?: number | null;
  folder?: string | null;
  storageProvider: string;
  publicId?: string | null;
  publicUrl?: string | null;
  thumbnailUrl?: string | null;
  uploadedBy?: number | null;
  status?: MediaStatus;
}

export interface MediaListQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, unknown>;
  folder?: string;
  status?: MediaStatus;
  isDeleted?: boolean;
}

export interface MediaResponseDto extends CreateMediaDto {
  id: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}
