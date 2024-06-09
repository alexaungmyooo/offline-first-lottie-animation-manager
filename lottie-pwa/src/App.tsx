// src/App.tsx
import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import client from './apollo-client';
import store from './store/store';
import SearchPage from './pages/SearchPage';
import UploadPage from './pages/UploadPage';
import AnimationsPage from './pages/AnimationsPage';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import NetworkStatusManager from './components/NetworkStatusManager';

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <NetworkStatusManager />
            <main className="container mx-auto p-4 flex-grow">
              <Routes>
                <Route path="/" element={<SearchPage />} />
                <Route path="/upload" element={<UploadPage />} />
                <Route path="/animations" element={<AnimationsPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </Provider>
    </ApolloProvider>
  );
};

export default App;
