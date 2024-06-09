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
  file: Promise<FileUpload>;
}

export interface SearchAnimationsArgs {
  query?: string;
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


export interface AnimationData {
  v: string; // Lottie version
  fr: number; // Frame rate
  ip: number; // In point
  op: number; // Out point
  w: number; // Width
  h: number; // Height
  nm: string; // Name
  ddd: number; // 3D or not
  assets: Array<Asset>;
  layers: Array<Layer>;
  // Add other properties as needed
}

interface Asset {
  id: string;
  // Define other properties based on your Lottie JSON structure
}

interface Layer {
  ty: number; // Layer type
  nm: string; // Layer name
  ks: object; // Transform properties
  ao: number; // Auto-orient
  ip: number; // In point
  op: number; // Out point
  st: number; // Start time
  bm: number; // Blending mode
  // Add other properties as needed
}
