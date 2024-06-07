// src/components/OnlineHandler.tsx
import React, { useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { loadAnimations, setOffline, addAnimationState } from '../store/animationsSlice';
import { getPendingUploads, clearPendingUploads, getLottieFile, addAnimation, addLottieFile } from '../utils/indexedDB';
import { customFetch } from '../utils/customFetch';

const UPLOAD_ANIMATION_QUERY = `
  mutation UploadAnimation($title: String!, $description: String!, $tags: [String!]!, $metadata: String!, $file: Upload!, $duration: Int!, $category: String!) {
    uploadAnimation(title: $title, description: $description, tags: $tags, metadata: $metadata, file: $file, duration: $duration, category: $category) {
      id
      title
      url
    }
  }
`;

const OnlineHandler: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleOnline = async () => {
      dispatch(setOffline(false));

      // Sync pending uploads
      const pendingUploads = await getPendingUploads();
      for (const upload of pendingUploads) {
        console.log(upload);
        const { file, ...uploadData } = upload;
        
        // Retrieve the Lottie file data from IndexedDB
        const fileData = await getLottieFile(String(uploadData.id));
        console.log(fileData)

        if (fileData) {
          console.log("Custom Fetch")
          const operations = {
            query: UPLOAD_ANIMATION_QUERY,
            variables: { ...uploadData, fileData },
          };
          const map = { '0': ['variables.file'] };

          const result = await customFetch('http://localhost:4000/graphql', operations, map, file);
          if (result.data) {
            dispatch(addAnimationState(result.data.uploadAnimation));
            await addAnimation(result.data.uploadAnimation);
            await addLottieFile(String(result.data.uploadAnimation.id), fileData);
          }
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
