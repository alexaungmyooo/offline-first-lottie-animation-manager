// src/components/Search.tsx
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';
import { setAnimations } from '../store/animationsSlice';
import { getAnimations } from '../utils/indexedDB';
import { RootState } from '../store/store';
import { SEARCH_ANIMATIONS } from '../graphql/querys';
import { useDebounce } from '../hooks/useDebounce';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const dispatch = useDispatch();
  const offline = useSelector((state: RootState) => state.animations.offline);

  const { data, loading, error } = useQuery(SEARCH_ANIMATIONS, {
    variables: { query: debouncedQuery },
    skip: offline || !debouncedQuery, // Skip query if offline or debouncedQuery is empty
  });

  useEffect(() => {

    if (offline && debouncedQuery) {
      getAnimations().then((animations) => {
        const filteredAnimations = animations.filter((animation) =>
          (animation.title && animation.title.includes(debouncedQuery)) ||
          (animation.description && animation.description.includes(debouncedQuery))
        );

        dispatch(setAnimations(filteredAnimations));
      });
    } else if (data && !loading && !error) {

      dispatch(setAnimations(data.searchAnimations));
    }
  }, [data, debouncedQuery, offline, dispatch, loading, error]);

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
