import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

import App from './App'; // smart landing or redirect
import Login from './components/Login';
import Register from './components/Register';
import UploadPage from './components/UploadPage';
import SharedFiles from './components/SharedFiles';
import DownloadPage from './components/DownloadPage';
import Layout from './components/Layout';
import './index.css';

// ✅ Auth helper
const isAuthenticated = () => !!localStorage.getItem('token');

// ✅ Private wrapper
const PrivateRoute = () => {
  return isAuthenticated() ? <Layout><Outlet /></Layout> : <Navigate to="/login" replace />;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Smart landing/login redirect */}
        <Route path="/" element={<App />} />

        {/* Public pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/download/:id" element={<DownloadPage />} /> {/* ✅ Now public */}

        {/* Protected dashboard pages */}
        <Route path="/" element={<PrivateRoute />}>
          <Route path="upload" element={<UploadPage />} />
          <Route path="files" element={<SharedFiles />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
