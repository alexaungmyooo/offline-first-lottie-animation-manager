// src/types/index.ts
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

export interface Context {
  prisma: PrismaClient;
  req: Request;
  res: Response;
}

export interface UploadAnimationArgs {
  id?: string;
  title: string;
  description: string;
  tags: string[];
  metadata: string;
  file: Promise<FileUpload>;
  duration: number;
  category: string;
}

export interface SearchAnimationsArgs {
  query?: string;
  category?: string;
  tags?: string[];
}

export interface GetAnimationArgs {
  id: string;
}

export interface FileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => NodeJS.ReadableStream;
}