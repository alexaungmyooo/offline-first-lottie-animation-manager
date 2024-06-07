// src/types/index.ts
export interface LottieAnimation {
  id: number;
  title: string;
  description: string;
  tags: string[];
  metadata: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  duration: number;
  category: string;
}

export interface PendingUpload {
  id?: number;
  title: string;
  description?: string;
  tags?: string[];
  metadata: string;
  file: File;
  filename: string;
  duration?: number;
  category?: string;
}

export interface OfflineAnimation {
  id?: number;
  title: string;
  description?: string;
  tags?: string[];
  metadata: string;
  file: File;
  filename: string;
  duration?: number;
  category?: string;
}
