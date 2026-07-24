import crypto from 'crypto';

export function generateToken(size = 48) {
  return crypto.randomBytes(size).toString('hex');
}
