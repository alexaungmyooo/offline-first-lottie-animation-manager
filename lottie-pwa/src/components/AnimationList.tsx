// src/components/AnimationList.tsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { getLottieFile } from '../utils/indexedDB';
import Lottie from 'lottie-web';

const AnimationList: React.FC = () => {
  const animations = useSelector((state: RootState) => state.animations.animations);
  const offline = useSelector((state: RootState) => state.animations.offline);
  const [lottieFiles, setLottieFiles] = useState<{ [key: string]: unknown }>({});

  useEffect(() => {
    if (offline) {
      // Load Lottie files from IndexedDB
      const loadLottieFiles = async () => {
        const files = await Promise.all(
          animations.map(async (animation) => {
            const fileData = await getLottieFile(String(animation.id)); // Ensure id is string
            return { id: animation.id, fileData };
          })
        );
        const fileMap = files.reduce((acc, { id, fileData }) => {
          acc[id] = fileData;
          return acc;
        }, {} as { [key: string]: unknown });
        setLottieFiles(fileMap);
      };
      loadLottieFiles();
    }
  }, [animations, offline]);

  return (
    <div className="animation-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {animations.map((animation) => (
        <div key={animation.id} className="animation-item p-4 border rounded-md shadow-md">
          <h3 className="text-xl font-bold mb-2">{animation.title}</h3>
          <div
            ref={(container) => {
              if (container) {
                if (offline && lottieFiles[animation.id]) {
                  Lottie.loadAnimation({
                    container,
                    renderer: 'svg',
                    loop: true,
                    autoplay: true,
                    animationData: lottieFiles[animation.id], // Load from IndexedDB
                  });
                } else {
                  Lottie.loadAnimation({
                    container,
                    renderer: 'svg',
                    loop: true,
                    autoplay: true,
                    path: animation.url,
                  });
                }
              }
            }}
            className="animation-container"
          />
        </div>
      ))}
    </div>
  );
};

export default AnimationList;



// src/components/AnimationList.tsx
// import React from 'react';
// import { useSelector } from 'react-redux';
// import { RootState } from '../store/store';
// import Lottie from 'lottie-web';

// const AnimationList: React.FC = () => {
//   const animations = useSelector((state: RootState) => state.animations.animations);

//   return (
//     <div className="animation-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//       {animations.map((animation) => (
//         <div key={animation.id} className="animation-item p-4 border rounded-md shadow-md">
//           <h3 className="text-xl font-bold mb-2">{animation.title}</h3>
//           <div
//             ref={(container) => {
//               if (container) {
//                 Lottie.loadAnimation({
//                   container,
//                   renderer: 'svg',
//                   loop: true,
//                   autoplay: true,
//                   path: animation.url,
//                 });
//               }
//             }}
//             className="animation-container"
//           />
//         </div>
//       ))}
//     </div>
//   );
// };

// export default AnimationList;


