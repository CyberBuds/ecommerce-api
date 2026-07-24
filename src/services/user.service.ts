import UserRepository from '../repositories/user.repository';
import RoleRepository from '../repositories/role.repository';
import { hashPassword, comparePassword } from '../utils/password';
import AppError from '../utils/AppError';
import HTTP_STATUS from '../constants/httpStatus';
import { CreateUserDto, UpdateUserDto } from '../interfaces/user.dto';
import RefreshTokenRepository from '../repositories/refreshToken.repository';

export default class UserService {
  private userRepo: UserRepository;
  private roleRepo: RoleRepository;
  private rtRepo: RefreshTokenRepository;

  constructor() {
    this.userRepo = new UserRepository();
    this.roleRepo = new RoleRepository();
    this.rtRepo = new RefreshTokenRepository();
  }

  async createUser(dto: CreateUserDto, createdBy?: number) {
    // password hashing
    const hashed = await hashPassword(dto.password, Number(process.env.SALT_ROUNDS) || 10);
    const payload: any = { ...dto, password: hashed };
    if (createdBy) payload.createdBy = createdBy;
    const user = await this.userRepo.create(payload);
    // remove password from return
    // @ts-ignore
    delete user.password;
    return user;
  }

  async updateUser(id: number, dto: UpdateUserDto, updatedBy?: number) {
    const data: any = { ...dto };
    if (updatedBy) data.updatedBy = updatedBy;
    const user = await this.userRepo.update(id, data);
    // @ts-ignore
    delete user.password;
    return user;
  }

  async deleteUser(id: number, deletedBy?: number) {
    // soft delete
    const user = await this.userRepo.softDelete(id);
    if (deletedBy) await this.userRepo.update(id, { updatedBy: deletedBy } as any);
    return user;
  }

  async getUserById(id: number) {
    const user = await this.userRepo.findById(id);
    if (!user) throw new AppError('User not found', HTTP_STATUS.NOT_FOUND, 'USER_NOT_FOUND');
    // @ts-ignore
    delete user.password;
    return user;
  }

  async listUsers(query: any) {
    return this.userRepo.list(query);
  }

  async activateUser(id: number) {
    return this.userRepo.setActive(id, true);
  }

  async deactivateUser(id: number) {
    return this.userRepo.setActive(id, false);
  }

  async lockUser(id: number) {
    return this.userRepo.setLock(id, true);
  }

  async unlockUser(id: number) {
    return this.userRepo.setLock(id, false);
  }

  async assignRole(userId: number, roleId: number) {
    const role = await this.roleRepo.findById(roleId);
    if (!role) throw new AppError('Role not found', HTTP_STATUS.BAD_REQUEST, 'ROLE_NOT_FOUND');
    return this.userRepo.assignRole(userId, roleId);
  }

  async changePassword(userId: number, oldPassword: string, newPassword: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new AppError('User not found', HTTP_STATUS.NOT_FOUND, 'USER_NOT_FOUND');
    const valid = await comparePassword(oldPassword, user.password);
    if (!valid) throw new AppError('Invalid credentials', HTTP_STATUS.UNAUTHORIZED, 'INVALID_CREDENTIALS');
    const hashed = await hashPassword(newPassword, Number(process.env.SALT_ROUNDS) || 10);
    await this.userRepo.update(userId, { password: hashed } as any);
    // revoke refresh tokens
    await this.rtRepo.deleteByUser(userId);
    return true;
  }

  async resetPasswordByAdmin(targetUserId: number, newPassword: string) {
    const hashed = await hashPassword(newPassword, Number(process.env.SALT_ROUNDS) || 10);
    await this.userRepo.update(targetUserId, { password: hashed } as any);
    // revoke tokens
    await this.rtRepo.deleteByUser(targetUserId);
    return true;
  }

  async updateProfile(userId: number, dto: UpdateUserDto) {
    const user = await this.userRepo.update(userId, dto as any);
    // @ts-ignore
    delete user.password;
    return user;
  }

  async uploadProfileImage(userId: number, imageUrl: string) {
    const user = await this.userRepo.update(userId, { profileImage: imageUrl } as any);
    // @ts-ignore
    delete user.password;
    return user;
  }
}
