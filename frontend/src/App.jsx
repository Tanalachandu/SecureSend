import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isRoot = location.pathname === '/';

    // Only act when visiting the root URL
    if (isRoot) {
      if (token) navigate('/upload', { replace: true });
      else navigate('/', { replace: true }); // show landing page
    }
  }, [location, navigate]);

  return null; // Just handles redirection logic
}

export default App;
