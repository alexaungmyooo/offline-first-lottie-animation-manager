// src/types/index.ts
export interface LottieAnimation {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  metadata: string;
  url?: string; // Optional because offline animations won't have this
  file?: File; // Optional because online animations won't have this
  filename?: string; // Optional because online animations won't have this
  createdAt: string;
  updatedAt: string;
  duration?: number;
  category?: string;
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
  // Define properties based on your Lottie JSON structure
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
