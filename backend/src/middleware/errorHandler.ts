// src/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import logger from '../logger';
import http from 'http';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      errors: err.errors,
    });
  }

  if (err.message.includes('The CORS policy')) {
    return res.status(403).json({
      errors: [{ message: err.message }],
    });
  }

  if (err.extensions?.code === 'USER_INPUT_ERROR') {
    return res.status(400).json({ errors: [{ message: err.message }] });
  }

  if (err.extensions?.code === 'AUTHENTICATION_ERROR') {
    return res.status(401).json({ errors: [{ message: err.message }] });
  }

  if (err.extensions?.code === 'FORBIDDEN_ERROR') {
    return res.status(403).json({ errors: [{ message: err.message }] });
  }

  if (err.extensions?.code === 'INTERNAL_SERVER_ERROR') {
    return res.status(500).json({ errors: [{ message: err.message }] });
  }

  res.status(500).json({
    errors: [{ message: 'Internal Server Error' }],
  });
};

// Graceful shutdown
export const handleUncaughtErrors = (server: http.Server, prisma: any) => {
  process.on('uncaughtException', async (err) => {
    logger.error('Uncaught Exception. Shutting down...', err);
    await prisma.$disconnect();
    server.close(() => process.exit(1));
  });

  process.on('unhandledRejection', async (err) => {
    logger.error('Unhandled Rejection. Shutting down...', err);
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(1);
    });
  });
};
