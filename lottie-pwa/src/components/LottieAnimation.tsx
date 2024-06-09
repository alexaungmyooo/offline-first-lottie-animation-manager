import React, { useEffect, useState } from 'react';
import Lottie from 'react-lottie';
import { getLottieFile } from '../utils/indexedDB';
import { AnimationData } from '../types';

interface LottieAnimationProps {
  animationId: string;
  animationUrl: string;
  offline: boolean;
}

const LottieAnimation: React.FC<LottieAnimationProps> = ({ animationId, animationUrl, offline }) => {
  const [animationData, setAnimationData] = useState<AnimationData>();

  useEffect(() => {
    if (offline) {
      const loadLottieFile = async () => {
        const fileData = await getLottieFile(animationId) as AnimationData;
        setAnimationData(fileData);
      };
      loadLottieFile();
    } else {
      fetch(animationUrl)
        .then(response => response.json())
        .then(data => setAnimationData(data))
        .catch(error => console.error('Error loading Lottie animation:', error));
    }
  }, [animationId, animationUrl, offline]);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return animationData ? <Lottie options={defaultOptions} height={400} width={400} /> : <div>Loading...</div>;
};

export default LottieAnimation;
