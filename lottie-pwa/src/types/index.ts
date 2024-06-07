// src/types/index.ts
export interface LottieAnimation {
  id: string;
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
  id: string;
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
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  metadata: string;
  file: File;
  filename: string;
  duration?: number;
  category?: string;
}
