// src/App.tsx
import React, { lazy, Suspense } from 'react';
import { ApolloProvider } from '@apollo/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import client from './apollo-client';
import store from './store/store';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import NetworkStatusManager from './components/NetworkStatusManager';

const SearchPage = lazy(() => import('./pages/SearchPage'));
const UploadPage = lazy(() => import('./pages/UploadPage'));
const AnimationsPage = lazy(() => import('./pages/AnimationsPage'));

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <NetworkStatusManager />
            <main className="container mx-auto p-4 flex-grow">
              <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                  <Route path="/" element={<SearchPage />} />
                  <Route path="/upload" element={<UploadPage />} />
                  <Route path="/animations" element={<AnimationsPage />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </Router>
      </Provider>
    </ApolloProvider>
  );
};

export default App;
