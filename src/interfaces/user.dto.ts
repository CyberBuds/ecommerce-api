export interface CreateUserDto {
  employeeCode?: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile?: string;
  password: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth?: string; // ISO
  roleId?: number;
}

export interface UpdateUserDto {
  employeeCode?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth?: string; // ISO
  roleId?: number;
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

export interface ResetPasswordDto {
  userId: number;
  newPassword: string;
}

export interface AssignRoleDto {
  roleId: number;
}

export interface PaginationQuery {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, any>;
}

export interface UserResponseDto {
  id: number;
  employeeCode?: string | null;
  firstName: string;
  lastName: string;
  email: string;
  mobile?: string | null;
  profileImage?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null;
  roleId?: number | null;
  status?: string;
  isActive?: boolean;
  isLocked?: boolean;
  lastLogin?: string | null;
  createdAt: string;
  updatedAt: string;
}
