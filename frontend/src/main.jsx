import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App'; // Rename App to Home for clarity
import Login from './components/Login';
import Register from './components/Register';
import UploadPage from './components/UploadPage';
import SharedFiles from './components/SharedFiles';
import DownloadPage from './components/DownloadPage';
import Layout from './components/Layout';
import './index.css';

const isAuthenticated = () => !!localStorage.getItem('token');
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected layout route with sidebar */}
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<App />} /> {/* or rename App to Home */}
        <Route path="upload" element={<UploadPage />} />
        <Route path="files" element={<SharedFiles />} />
        <Route path="download/:id" element={<DownloadPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
