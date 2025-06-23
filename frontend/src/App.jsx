import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';

function App() {
  const navigate = useNavigate();
  const [showLanding, setShowLanding] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/upload', { replace: true });
    } else {
      setShowLanding(true);
    }
  }, [navigate]);

  if (!showLanding) return null;
  return <LandingPage />;
}

export default App;
