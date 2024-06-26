// src/serviceWorker.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching';
import { getPendingUploads, addAnimation, deletePendingUpload, getLastSyncTime, setLastSyncTime } from './utils/indexedDB';
import { customFetch } from './utils/customFetch';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { UPLOAD_ANIMATION_QUERY } from './graphql/mutations';
import { ANIMATIONS_SINCE_QUERY } from './graphql/querys';

// Declare the global variable
declare let self: ServiceWorkerGlobalScope;

// Precache the assets generated by the build process
precacheAndRoute(self.__WB_MANIFEST);

// Logging install and activate events for debugging
self.addEventListener('install', () => {
  console.log('Service Worker: Installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  event.waitUntil(self.clients.claim());
  startPeriodicSync(); // Start periodic sync when service worker is activated
});

// Registering the sync event listener
self.addEventListener('sync', (event) => {
  if ((event as any).tag === 'sync-pending-uploads') {
    console.log('Sync event triggered');
    (event as any).waitUntil(syncPendingUploads());
  }
});

// Setting up navigation routing
let allowlist: undefined | RegExp[];
if (import.meta.env.DEV) allowlist = [/^\/$/];

registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html'), { allowlist }));

const GRAPHQL_API_URL = import.meta.env.VITE_GRAPHQL_API_URL;

// Function to start periodic sync
function startPeriodicSync() {
  async function periodicSync() {
    try {
      await syncServerData();
    } catch (error) {
      console.error('Periodic sync failed:', error);
    } finally {
      // Schedule the next sync after 15 minutes (900,000 milliseconds)
      setTimeout(periodicSync, 900000);
    }
  }

  // Start the first sync immediately
  periodicSync();
}

// Function to synchronize animations with the server
async function syncPendingUploads() {
  console.log('syncPendingUploads called');
  try {
    const pendingUploads = await getPendingUploads();
    console.log('Pending uploads:', pendingUploads);

    for (const upload of pendingUploads) {
      const { file, id, title, description, tags } = upload;
      console.log('Processing upload:', upload);

      const fileData = upload.metadata;
      console.log('File data for upload:', upload.id, fileData);

      if (fileData && file) {
        const operations = {
          query: UPLOAD_ANIMATION_QUERY,
          variables: { id, title, description, tags },
        };
        const map = { '0': ['variables.file'] };

        try {
          const result = await customFetch(GRAPHQL_API_URL, operations, map, file);
          console.log('Upload result:', result);

          if (result.data) {
            await addAnimation(result.data.uploadAnimation);
            await deletePendingUpload(upload.id);
          }
        } catch (uploadError) {
          console.error(`Failed to upload animation with id ${id}:`, uploadError);
        }
      }
    }

    await syncServerData();
  } catch (error) {
    console.error('Sync pending uploads failed:', error);
  }
}

// Function to synchronize server data
async function syncServerData() {
  try {
    console.log('Starting sync with server');
    const lastSync = await getLastSyncTime();
    console.log('Last sync time:', lastSync);

    const response = await fetch(GRAPHQL_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: ANIMATIONS_SINCE_QUERY,
        variables: { lastSync },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Server sync result:', result);

    if (!result.data || !result.data.animationsSince) {
      throw new Error('No data in response');
    }

    const animations = result.data.animationsSince;
    console.log('Animations since last sync:', animations);

    for (const animation of animations) {
      console.log('Adding animation:', animation);
      try {
        await addAnimation(animation);

        // Fetch the Lottie JSON data using the URL
        const jsonResponse = await fetch(animation.url);
        if (!jsonResponse.ok) {
          throw new Error(`Failed to fetch JSON data: ${jsonResponse.status}`);
        }

      } catch (dbError) {
        console.error('Error adding animation to IndexedDB:', dbError);
      }
    }

    await setLastSyncTime(new Date().toISOString());
    console.log('Sync complete, updated last sync time');
  } catch (error) {
    console.error('Sync server data failed:', error);
  }
}

export { };

