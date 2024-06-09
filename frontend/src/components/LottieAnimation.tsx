// src/components/LottieAnimation.tsx
import React, { useEffect, useState } from 'react';
import Lottie from 'react-lottie';
import { AnimationData } from '../types';

interface LottieAnimationProps {
  metadata: string; // Change to string to match your data type
  offline: boolean;
}

const LottieAnimation: React.FC<LottieAnimationProps> = ({ metadata, offline }) => {
  const [animationData, setAnimationData] = useState<AnimationData | null>(null);

  useEffect(() => {
    let parsedMetadata: AnimationData | null = null;
    try {
      parsedMetadata = JSON.parse(metadata);
    } catch (error) {
      console.error("Failed to parse metadata:", error);
    }

    if (parsedMetadata) {
      setAnimationData(parsedMetadata);
    }
  }, [metadata, offline]);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return animationData ? <Lottie options={defaultOptions} height={400} width={400} /> : <div>Loading...</div>;
};

export default LottieAnimation;
