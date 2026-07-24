import multer from 'multer';
import path from 'path';
import { ensureUploadDir } from '../helpers/media';

const uploadDir = path.resolve(process.cwd(), 'uploads', 'media');
ensureUploadDir(uploadDir);

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadDir);
  },
  filename: function (_req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    cb(null, true);
  }
});

export default upload;
