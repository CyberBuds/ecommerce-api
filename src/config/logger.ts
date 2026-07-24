import fs from 'fs';
import path from 'path';
import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import config from './env';

const { combine, timestamp, json, prettyPrint, printf, colorize } = format;

const production = config.NODE_ENV === 'production';
const isServerless = !!process.env.VERCEL; // true when running on Vercel

const logFormat = printf(({ level, message, timestamp, ...meta }) => {
  const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
  return `${timestamp} [${level}]: ${message} ${metaStr}`;
});

const loggerTransports: any[] = [
  new transports.Console({
    format: combine(colorize(), timestamp(), logFormat)
  })
];

// Only use file-based logging when NOT running on Vercel (read-only FS there)
if (!isServerless) {
  const logDir = path.resolve(process.cwd(), 'logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  loggerTransports.push(
    new DailyRotateFile({
      filename: path.join(logDir, 'application-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      zippedArchive: true,
      level: 'info'
    }),
    new DailyRotateFile({
      filename: path.join(logDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '30d',
      zippedArchive: true
    })
  );
}

const logger = createLogger({
  level: config.LOG_LEVEL || 'info',
  format: combine(timestamp(), production ? json() : prettyPrint()),
  transports: loggerTransports,
  exitOnError: false
});

export default logger;