// src/components/AnimationDetail.tsx
import React, { useState, useEffect, useRef } from 'react';
import Lottie from 'react-lottie';
import { AnimationData, LottieAnimation } from '../types';

interface AnimationDetailProps {
  animation: LottieAnimation;
  metadata: string; 
}

const AnimationDetail: React.FC<AnimationDetailProps> = ({ animation, metadata }) => {
  const [isStopped, setIsStopped] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const animationRef = useRef<any>(null);
  const [parsedAnimationData, setParsedAnimationData] = useState<AnimationData | null>(null);

  useEffect(() => {
    // Parse metadata if it is a string
    let parsedData: AnimationData | null = null;
    try {
      parsedData = JSON.parse(metadata);
    } catch (error) {
      console.error("Failed to parse metadata:", error);
    }

    if (parsedData) {
      setParsedAnimationData(parsedData);
    }
  }, [metadata]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (animationRef.current) {
        setProgress(animationRef.current.anim.currentFrame / animationRef.current.anim.totalFrames);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: parsedAnimationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(parsedAnimationData)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${animation.title}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animation-detail p-4 bg-white rounded-md shadow-lg">
      <div className="animation-header flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold">{animation.title}</h2>
          <h3 className="text-lg text-gray-600">{parsedAnimationData?.nm}</h3>
        </div>
      </div>
      <div className="animation-metadata mb-4">
        <p><strong>Version:</strong> {parsedAnimationData?.v}</p>
        <p><strong>Width:</strong> {parsedAnimationData?.w}</p>
        <p><strong>Height:</strong> {parsedAnimationData?.h}</p>
        <p><strong>Frame Rate:</strong> {parsedAnimationData?.fr}</p>
        <p><strong>In Point:</strong> {parsedAnimationData?.ip}</p>
        <p><strong>Out Point:</strong> {parsedAnimationData?.op}</p>
      </div>
      <div className="animation-viewer mb-4">
        {parsedAnimationData && (
          <Lottie
            options={defaultOptions}
            height={400}
            width={400}
            isStopped={isStopped}
            isPaused={isPaused}
            ref={animationRef}
          />
        )}
      </div>
      <div className="controls flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={() => setIsStopped(!isStopped)}
            className="px-4 py-2 rounded text-white bg-green-500 hover:bg-green-700"
          >
            {isStopped ? 'Play' : 'Stop'}
          </button>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="px-4 py-2 rounded text-white bg-green-500 hover:bg-green-700"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
        </div>
        <div className="flex space-x-2">
          <button onClick={handleDownload} className="px-4 py-2 rounded text-white bg-green-500 hover:bg-green-700">
            Download
          </button>
        </div>
      </div>
      <div className="progress-bar mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-green-500 h-2.5 rounded-full"
            style={{ width: `${progress * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default AnimationDetail;
