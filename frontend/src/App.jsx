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
    const isRoot = location.pathname === '/';
    const isDownload = location.pathname.startsWith('/download');

    if (isRoot) {
      if (token) navigate('/upload', { replace: true });
      else setInitialized(true); // show landing page
    } else {
      setInitialized(true); // all other routes should render normally
    }
  }, [location, navigate]);

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
