// src/store/animationsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LottieAnimation } from './../types';
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
      console.log('Dispatching setAnimations with payload:', action.payload);  // <-- Added log

      state.animations = action.payload;
    },
    addAnimationState: (state, action: PayloadAction<LottieAnimation>) => {
      const animation = action.payload;
      if (animation.file) {
        try {
          // Create a URL for offline animation file
          animation.url = URL.createObjectURL(animation.file);
        } catch (error) {
          console.error('Error creating object URL:', error);
        }
      } else {
        console.warn('Animation file is null:', animation);
      }
      state.animations.push(animation);
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
