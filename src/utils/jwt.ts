import jwt from 'jsonwebtoken';
import config from '../config/env';

const jwtSecret = config.JWT_SECRET as string;
const refreshTokenSecret = config.REFRESH_TOKEN_SECRET as string;

export function signAccessToken(payload: object) {
  return jwt.sign(payload, jwtSecret, { expiresIn: config.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] });
}

export function signRefreshToken(payload: object) {
  return jwt.sign(payload, refreshTokenSecret, { expiresIn: config.REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn'] });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, jwtSecret);
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, refreshTokenSecret);
}
