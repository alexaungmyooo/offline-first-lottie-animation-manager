// src/utils/indexedDB.ts
import { openDB } from 'idb';
import { LottieAnimation, PendingUpload } from '../types';

const dbPromise = openDB('lottieDB', 1, {
  upgrade(db) {
    db.createObjectStore('animations', {
      keyPath: 'id',
      autoIncrement: true,
    });
    db.createObjectStore('pendingUploads', {
      keyPath: 'id',
      autoIncrement: true,
    });
    db.createObjectStore('lottieFiles'); // Remove keyPath for lottieFiles

    // db.createObjectStore('lottieFiles', {
    //   keyPath: 'id',
    // });
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

export const getPendingUploads = async (): Promise<PendingUpload[]> => {
  const db = await dbPromise;
  return db.getAll('pendingUploads');
};

export const addPendingUpload = async (upload: PendingUpload): Promise<IDBValidKey> => {
  const db = await dbPromise;
  return db.put('pendingUploads', upload);
};

export const clearPendingUploads = async (): Promise<void> => {
  const db = await dbPromise;
  return db.clear('pendingUploads');
};

export const getLottieFile = async (id: string): Promise<unknown> => {
  const db = await dbPromise;
  return db.get('lottieFiles', id);
};

export const addLottieFile = async (id: string, fileData: unknown): Promise<void> => {
  const db = await dbPromise;
  await db.put('lottieFiles', fileData, id);
};
