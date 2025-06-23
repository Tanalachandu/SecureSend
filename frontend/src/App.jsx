import { useEffect } from 'react';
import { useLocation, useNavigate, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import UploadPage from './components/UploadPage';
import Dashboard from './components/Dashboard';
import DownloadPage from './components/DownloadPage';
import NotFound from './components/NotFound';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isRoot = location.pathname === '/';

    // Redirect ONLY if you're on homepage ("/")
    if (isRoot) {
      if (token) navigate('/upload', { replace: true });
      else navigate('/', { replace: true });
    }
  }, [location, navigate]);

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
