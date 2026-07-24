import { uploadImage } from '../helpers/cloudinary';
import UserRepository from '../repositories/user.repository';
import fs from 'fs';

export default class ProfileService {
  private userRepo = new UserRepository();

  async uploadProfileImage(userId: number, filePath: string) {
    const url = await uploadImage(filePath);
    // remove local file
    try {
      fs.unlinkSync(filePath);
    } catch (e) {
      // ignore
    }
    return this.userRepo.update(userId, { profileImage: url } as any);
  }
}
