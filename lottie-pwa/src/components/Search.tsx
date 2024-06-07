// src/components/Search.tsx
import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';
import { setAnimations } from '../store/animationsSlice';
import { getAnimations } from '../utils/indexedDB';
import { RootState } from './../store/store';
import { SEARCH_ANIMATIONS } from '../graphql/querys';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();
  const offline = useSelector((state: RootState) => state.animations.offline);

  const { data, loading, error } = useQuery(SEARCH_ANIMATIONS, {
    variables: { query },
    skip: offline || !query, // Skip query if offline or query is empty
  });

  React.useEffect(() => {
    if (offline && query) {
      // Fetch from IndexedDB when offline
      getAnimations().then((animations) => {
        const filteredAnimations = animations.filter((animation) =>
          animation.title.includes(query) || animation.description.includes(query)
        );
        dispatch(setAnimations(filteredAnimations));
      });
    } else if (data) {
      dispatch(setAnimations(data.searchAnimations));
      // // Update IndexedDB with the fetched data
      // data.searchAnimations.forEach((animation: LottieAnimation) => {
      //   addAnimationToDB(animation);
      // });
    }
  }, [data, query, offline, dispatch]);

  return (
    <div className="search">
      <input
        type="text"
        placeholder="Search animations"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="input w-full px-3 py-2 border rounded-md"
      />
      {loading && <p className="text-gray-600 mt-2">Loading...</p>}
      {error && <p className="text-red-600 mt-2">Error: {error.message}</p>}
    </div>
  );
};

export default Search;
