// src/components/OnlineHandler.tsx
import React, { useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { loadAnimations, setOffline, addAnimationState } from '../store/animationsSlice';
import { getPendingUploads, clearPendingUploads, addAnimation, addLottieFile } from '../utils/indexedDB';
import { UPLOAD_ANIMATION } from '../graphql/mutations';
import client from '../apollo-client';

const OnlineHandler: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleOnline = async () => {
      dispatch(setOffline(false));

      // Sync pending uploads
      const pendingUploads = await getPendingUploads();
      for (const upload of pendingUploads) {
        const result = await client.mutate({
          mutation: UPLOAD_ANIMATION,
          variables: upload,
        });

        if (result.data) {
          // Add animation to IndexedDB after successful upload
          await addAnimation(result.data.uploadAnimation);
          dispatch(addAnimationState(result.data.uploadAnimation));

          // Fetch and store the Lottie JSON file
          const response = await fetch(result.data.uploadAnimation.url);
          const fileData = await response.json();
          await addLottieFile(result.data.uploadAnimation.id, fileData);
        }
      }

      await clearPendingUploads();
    };

    const handleOffline = () => {
      dispatch(setOffline(true));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial load of animations from IndexedDB
    dispatch(loadAnimations());

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [dispatch]);

  return null;
};

export default OnlineHandler;
