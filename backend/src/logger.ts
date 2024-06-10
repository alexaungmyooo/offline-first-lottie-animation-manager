// src/logger.ts
import { createLogger, format, transports } from 'winston';

const isDevelopment = process.env.NODE_ENV === 'development';

const logger = createLogger({
  level: 'error',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.File({ filename: 'errors.log', level: 'error' }),
    new transports.Console({
      format: isDevelopment
        ? format.combine(format.colorize(), format.simple())
        : format.combine(format.timestamp(), format.json()),
    }),
  ],
});

export default logger;
