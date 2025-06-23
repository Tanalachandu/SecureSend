import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

import App from './App'; // decides redirect or landing
import Login from './components/Login';
import Register from './components/Register';
import UploadPage from './components/UploadPage';
import SharedFiles from './components/SharedFiles';
import DownloadPage from './components/DownloadPage';
import Layout from './components/Layout';
import NotFound from './components/NotFound'; // Optional
import './index.css';

// ✅ Check if user is authenticated
const isAuthenticated = () => !!localStorage.getItem('token');

// ✅ Guarded layout for private routes
const PrivateRoute = () => {
  return isAuthenticated() ? <Layout><Outlet /></Layout> : <Navigate to="/login" replace />;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Root: logic to redirect to upload or landing */}
        <Route path="/" element={<App />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/download/:id" element={<DownloadPage />} /> {/* ✅ Now public */}

        {/* Protected Routes (inside Layout) */}
        <Route path="/" element={<PrivateRoute />}>
          <Route path="upload" element={<UploadPage />} />
          <Route path="files" element={<SharedFiles />} />
        </Route>

        {/* Optional 404 fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
