// src/types/virtual-pwa-register.d.ts
declare module 'virtual:pwa-register' {
    interface RegisterSWOptions {
      immediate?: boolean;
      onNeedRefresh?: () => void;
      onOfflineReady?: () => void;
      onRegistered?: (registration: ServiceWorkerRegistration) => void;
      onRegisterError?: (error: unknown) => void;
    }
  
    export function registerSW(options?: RegisterSWOptions): (reloadPage?: boolean) => Promise<void>;
  }
  