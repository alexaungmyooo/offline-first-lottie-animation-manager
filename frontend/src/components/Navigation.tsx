// src/components/Navigation.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-green-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Lottie Animation Manager</h1>
        <div className="hidden md:flex space-x-4">
          <Link to="/" className="px-4 py-2">Search</Link>
          <Link to="/upload" className="px-4 py-2">Upload</Link>
          <Link to="/animations" className="px-4 py-2">Animations</Link>
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
            </svg>
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden mt-2">
          <Link to="/" className="block px-4 py-2" onClick={() => setIsOpen(false)}>Search</Link>
          <Link to="/upload" className="block px-4 py-2" onClick={() => setIsOpen(false)}>Upload</Link>
          <Link to="/animations" className="block px-4 py-2" onClick={() => setIsOpen(false)}>Animations</Link>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
