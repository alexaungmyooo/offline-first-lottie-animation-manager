import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import LottieAnimation from './LottieAnimation';
import AnimationDetail from './AnimationDetail';
import Modal from './Modal';
import { LottieAnimation as LottieAnimationType, AnimationData } from '../types';
import { getLottieFile } from '../utils/indexedDB';

const AnimationList: React.FC = () => {
  const animations = useSelector((state: RootState) => state.animations.animations);
  const offline = useSelector((state: RootState) => state.animations.offline);
  const [selectedAnimation, setSelectedAnimation] = useState<LottieAnimationType | null>(null);
  const [selectedAnimationData, setSelectedAnimationData] = useState<AnimationData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAnimationClick = async (animation: LottieAnimationType) => {
    setSelectedAnimation(animation);
    if (offline) {
      const fileData = await getLottieFile(animation.id);
      setSelectedAnimationData(fileData as AnimationData);
    } else if (animation.url) {
      const response = await fetch(animation.url);
      const data = await response.json();
      setSelectedAnimationData(data);
    }
    setIsModalOpen(true);
  };

  const handleCloseDetail = () => {
    setIsModalOpen(false);
    setSelectedAnimation(null);
    setSelectedAnimationData(null);
  };

  return (
    <div className="animation-list-container">
      <div className="animation-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {animations.map((animation) => (
          <div
            key={animation.id}
            className="animation-item p-4 border rounded-md shadow-md"
            onClick={() => handleAnimationClick(animation)}
          >
            <h3 className="text-xl font-bold mb-2">{animation.title}</h3>
            <LottieAnimation
              animationId={String(animation.id)}
              animationUrl={animation.url ?? ''}
              offline={offline}
            />
          </div>
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseDetail}>
        {selectedAnimation && selectedAnimationData && (
          <AnimationDetail
            animation={selectedAnimation}
            animationData={selectedAnimationData}
          />
        )}
      </Modal>
    </div>
  );
};

export default AnimationList;
