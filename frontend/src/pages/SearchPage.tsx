// src/pages/SearchPage.tsx
import React from 'react';
import Search from '../components/Search';
import AnimationList from '../components/AnimationList';

const SearchPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <Search />
      <AnimationList />
    </div>
  );
};

export default SearchPage;
