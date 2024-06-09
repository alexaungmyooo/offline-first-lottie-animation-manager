/* eslint-disable @typescript-eslint/no-explicit-any */
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { createHandlerBoundToURL } from 'workbox-precaching';

declare let self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('install', () => {
  console.log('Service Worker: Installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('sync', (event) => {
  if ((event as any).tag === 'sync-animations') {
    console.log('Sync event: sync-animations');
    (event as any).waitUntil((async () => {
      console.log('Sync animations called');
    })());
  }
});

let allowlist: undefined | RegExp[];
if (import.meta.env.DEV) allowlist = [/^\/$/];

registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html'), { allowlist }));
