// src/components/NetworkStatusManager.tsx
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setOffline } from '../store/animationsSlice';

const NetworkStatusManager: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const updateOnlineStatus = () => {
      const isOnline = navigator.onLine;
      console.log("Is Online :", isOnline);
      dispatch(setOffline(!isOnline));
      if (isOnline) {
        // Trigger sync when back online
        navigator.serviceWorker.ready.then((registration) => {
          registration.sync.register('sync-pending-uploads');
        });
      }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Set initial status
    updateOnlineStatus();

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [dispatch]);

  return null;
};

export default NetworkStatusManager;






