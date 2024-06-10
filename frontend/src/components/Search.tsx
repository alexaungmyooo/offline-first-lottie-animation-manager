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
  const animations = useSelector((state: RootState) => state.animations.animations);

  const { data, loading, error } = useQuery(SEARCH_ANIMATIONS, {
    variables: { query: debouncedQuery },
    skip: offline || !debouncedQuery, // Skip query if offline or debouncedQuery is empty
  });

  useEffect(() => {
    const fetchAnimations = async () => {
      if (!debouncedQuery) {
        // When the query is cleared, show all animations or an empty list
        if (offline) {
          const animations = await getAnimations();
          dispatch(setAnimations(animations));
        } else {
          dispatch(setAnimations([])); // or fetch all animations from the server if needed
        }
      } else if (offline && debouncedQuery) {
        const animations = await getAnimations();
        const filteredAnimations = animations.filter((animation) =>
          (animation.title && animation.title.includes(debouncedQuery)) ||
          (animation.description && animation.description.includes(debouncedQuery))
        );
        dispatch(setAnimations(filteredAnimations));
      } else if (data && !loading && !error) {
        dispatch(setAnimations(data.searchAnimations || []));
      }
    };

    fetchAnimations().catch((err) => {
      console.error('Error fetching animations: %o', err);
    });
  }, [data, debouncedQuery, offline, dispatch, loading, error]);

  const noAnimationsFound = !loading && !error && debouncedQuery && animations.length === 0;

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
      {offline && !query && <p className="text-yellow-600 mt-2">You are offline. Showing cached animations.</p>}
      {noAnimationsFound && <p className="text-gray-600 mt-2">No animations found.</p>}
    </div>
  );
};

export default Search;
