// src/components/AnimationList.tsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import LottieAnimation from './LottieAnimation';
import AnimationDetail from './AnimationDetail';
import Modal from './Modal';
import { LottieAnimation as LottieAnimationType } from '../types';

const AnimationList: React.FC = () => {
  const animations = useSelector((state: RootState) => state.animations.animations);
  const offline = useSelector((state: RootState) => state.animations.offline);
  const [selectedAnimation, setSelectedAnimation] = useState<LottieAnimationType | null>(null);
  const [selectedAnimationData, setSelectedAnimationData] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAnimationClick = async (animation: LottieAnimationType) => {
    setSelectedAnimation(animation);
    if (offline) {
      const fileData = JSON.stringify(animation.metadata);
      setSelectedAnimationData(fileData);
    } else if (animation.metadata) {
      const fileData = JSON.stringify(animation.metadata);
      setSelectedAnimationData(fileData);
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
            {animation.metadata && (
              <LottieAnimation
                metadata={JSON.stringify(animation.metadata)}
                offline={offline}
              />
            )}
          </div>
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseDetail}>
        {selectedAnimation && selectedAnimationData && (
          <AnimationDetail
            animation={selectedAnimation}
            metadata={selectedAnimationData}
          />
        )}
      </Modal>
    </div>
  );
};

export default AnimationList;
