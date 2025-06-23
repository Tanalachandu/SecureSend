import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import UploadPage from './components/UploadPage';
import Dashboard from './components/Dashboard';
import DownloadPage from './components/DownloadPage';
import NotFound from './components/NotFound';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isDownloadRoute = location.pathname.startsWith('/download');

    // ✅ If not logged in and not on download page, show landing
    if (!token && !isDownloadRoute && location.pathname === '/') {
      navigate('/', { replace: true });
    }

    // ✅ If logged in and visiting root, redirect to /upload
    if (token && location.pathname === '/') {
      navigate('/upload', { replace: true });
    }

    setInitialized(true);
  }, [location.pathname, navigate]);

  if (!initialized) return null;

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/upload" element={<UploadPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/download/:id" element={<DownloadPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
