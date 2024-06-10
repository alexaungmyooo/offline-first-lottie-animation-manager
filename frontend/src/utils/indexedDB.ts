import { openDB } from 'idb';
import { LottieAnimation } from '../types';

const dbPromise = openDB('lottieDB', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('animations')) {
      db.createObjectStore('animations', { keyPath: 'id' });
    }
    if (!db.objectStoreNames.contains('pendingUploads')) {
      db.createObjectStore('pendingUploads', { keyPath: 'id' });
    }
    if (!db.objectStoreNames.contains('meta')) {
      db.createObjectStore('meta');
    }
  },
});

export const getAnimations = async (): Promise<LottieAnimation[]> => {
  const db = await dbPromise;
  return db.getAll('animations');
};

export const addAnimation = async (animation: LottieAnimation): Promise<IDBValidKey> => {
  const db = await dbPromise;
  return db.put('animations', animation);
};

export const getPendingUploads = async (): Promise<LottieAnimation[]> => {
  const db = await dbPromise;
  return db.getAll('pendingUploads');
};

export const addPendingUpload = async (upload: LottieAnimation): Promise<IDBValidKey> => {
  const db = await dbPromise;
  return db.put('pendingUploads', upload);
};

export const clearPendingUploads = async (): Promise<void> => {
  const db = await dbPromise;
  return db.clear('pendingUploads');
};

export const deletePendingUpload = async (id: string): Promise<void> => {
  const db = await dbPromise;
  const tx = db.transaction('pendingUploads', 'readwrite');
  tx.objectStore('pendingUploads').delete(id);
  await tx.done;
}

export const getLastSyncTime = async (): Promise<string> => {
  const db = await dbPromise;
  const lastSyncTime = await db.get('meta', 'lastSync');
  return lastSyncTime || new Date(0).toISOString();
}

export const setLastSyncTime = async (lastSync: string): Promise<void> => {
  const db = await dbPromise;
  await db.put('meta', lastSync, 'lastSync');
}
