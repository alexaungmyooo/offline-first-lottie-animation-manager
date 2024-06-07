// src/store/animationsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LottieAnimation, OfflineAnimation } from './../types';
import { getAnimations, addAnimation as addAnimationToDB } from '../utils/indexedDB';
import { AppDispatch } from './store';

interface AnimationState {
  animations: LottieAnimation[];
  offline: boolean;
}

const initialState: AnimationState = {
  animations: [],
  offline: !navigator.onLine,
};

const animationsSlice = createSlice({
  name: 'animations',
  initialState,
  reducers: {
    setAnimations: (state, action: PayloadAction<LottieAnimation[]>) => {
      state.animations = action.payload;
    },
    addAnimationState: (state, action: PayloadAction<LottieAnimation | OfflineAnimation>) => {
      // Convert OfflineAnimation to Animation if necessary
      if ('file' in action.payload) {
        const offlineAnimation = action.payload as OfflineAnimation;
        const animation: LottieAnimation = {
          id: offlineAnimation.id, // Temporary ID
          title: offlineAnimation.title,
          description: '',
          tags: [],
          metadata: offlineAnimation.metadata,
          url: URL.createObjectURL(offlineAnimation.file),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          duration: 0,
          category: '',
        };
        state.animations.push(animation);
      } else {
        state.animations.push(action.payload);
      }
    },
    setOffline: (state, action: PayloadAction<boolean>) => {
      state.offline = action.payload;
    },
  },
});

export const { setAnimations, addAnimationState, setOffline } = animationsSlice.actions;

export default animationsSlice.reducer;

export const loadAnimations = () => async (dispatch: AppDispatch) => {
  const animations = await getAnimations();
  dispatch(setAnimations(animations));
};

export const saveAnimation = (animation: LottieAnimation) => async (dispatch: AppDispatch) => {
  await addAnimationToDB(animation);
  dispatch(addAnimationState(animation));
};
