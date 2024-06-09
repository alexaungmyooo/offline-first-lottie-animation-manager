import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setOffline } from '../store/animationsSlice';

const NetworkStatusManager: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const updateOnlineStatus = () => {
      console.log("Is Online :", navigator.onLine)
      dispatch(setOffline(!navigator.onLine));
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





