import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;

function getKey(): Buffer {
  const secret =
    process.env.ENCRYPTION_KEY ||
    process.env.JWT_SECRET ||
    'saree-ecommerce-default-enc-key!';
  // Derive a 32-byte key from the secret
  return Buffer.from(
    crypto.createHash('sha256').update(String(secret)).digest('hex').slice(0, 64),
    'hex',
  );
}

/** Encrypt plaintext with AES-256-CBC. Returns `iv:ciphertext` (both hex). */
export function encrypt(plaintext: string): string {
  if (!plaintext) return plaintext;
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

/** Decrypt an `iv:ciphertext` string produced by `encrypt`. */
export function decrypt(encryptedText: string): string {
  if (!encryptedText || !encryptedText.includes(':')) return encryptedText;
  const [ivHex, encHex] = encryptedText.split(':');
  if (!ivHex || !encHex) return encryptedText;
  try {
    const iv = Buffer.from(ivHex, 'hex');
    const encrypted = Buffer.from(encHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);
    return decrypted.toString('utf8');
  } catch {
    return encryptedText;
  }
}

/** Return `****` mask for a secret, keeping first-4 and last-4 visible. */
export function maskSecret(value: string): string {
  if (!value || value.length < 8) return '****';
  return `${value.slice(0, 4)}****${value.slice(-4)}`;
}

/** Generate a new API key triple: raw key (return to user once), prefix, and SHA-256 hash (stored). */
export function generateApiKey(): {
  rawKey: string;
  prefix: string;
  hash: string;
} {
  const rawKey = `sk_live_${crypto.randomBytes(28).toString('hex')}`;
  const prefix = rawKey.slice(0, 12);
  const hash = crypto.createHash('sha256').update(rawKey).digest('hex');
  return { rawKey, prefix, hash };
}

/** Generate a random secret token (e.g. webhook secret). */
export function generateSecret(byteLength = 32): string {
  return crypto.randomBytes(byteLength).toString('hex');
}
