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
import './index.css';

// ✅ Helper: check if token exists
const isAuthenticated = () => !!localStorage.getItem('token');

// ✅ Wrapper: Protect route
const PrivateRoute = () => {
  return isAuthenticated() ? <Layout><Outlet /></Layout> : <Navigate to="/login" replace />;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Root: smart logic based on login */}
        <Route path="/" element={<App />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Private Routes inside sidebar layout */}
        <Route path="/" element={<PrivateRoute />}>
          <Route path="upload" element={<UploadPage />} />
          <Route path="files" element={<SharedFiles />} />
          <Route path="download/:id" element={<DownloadPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
