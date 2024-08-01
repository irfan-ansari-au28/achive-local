import React, { lazy, Suspense } from 'react';
import { Routes, Route} from 'react-router-dom';
import HomePage from '../src/pages/HomePage/index';
import Login from './components/Login/Login';

// Lazy loaded components
const Search = lazy(() => import('../src/components/Search/Search'));
const Download = lazy(() => import('../src/components/Download/Download'));

const RouterConfig = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* Base path for the dashboard */}
        <Route path="/" element={<HomePage />}>
          {/* Nested routes under dashboard */}
          <Route index element={<Search />} />{' '}
          {/* Shows default content for "/dashboard" */}
          <Route path="search" element={<Search />} />
          <Route path="download" element={<Download />} />
          {/* Fallback for unmatched routes under "/" */}
        </Route>
        <Route path="*" element={<div>Page Not Found</div>} />{' '}
      </Routes>
    </Suspense>
  );
};

export default RouterConfig;
