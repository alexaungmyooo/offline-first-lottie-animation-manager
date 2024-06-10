// src/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import logger from '../logger'; // Update to the correct path
import { UserInputError, AuthenticationError, ForbiddenError, InternalServerError } from '../errors';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(err);

  if (err instanceof UserInputError) {
    return res.status(400).json({ errors: [{ message: err.message }] });
  }

  if (err instanceof AuthenticationError) {
    return res.status(401).json({ errors: [{ message: err.message }] });
  }

  if (err instanceof ForbiddenError) {
    return res.status(403).json({ errors: [{ message: err.message }] });
  }

  if (err instanceof InternalServerError) {
    return res.status(500).json({ errors: [{ message: err.message }] });
  }

  // Fallback for unhandled errors
  res.status(500).json({ errors: [{ message: 'Internal Server Error' }] });
};

// Graceful shutdown
import http from 'http';

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
