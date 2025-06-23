import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../utils/api';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('email', res.data.email);

      navigate('/upload');

    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-true-black p-4 font-sans">
      <div className="bg-card-dark-gray p-6 rounded-lg shadow-card-elevate w-full max-w-sm border border-border-subtle animate-fade-in">
        <h1 className="text-3xl font-extrabold mb-2 text-accent-blue text-center">SecureShare</h1>
        <h2 className="text-xl font-bold mb-4 text-text-white text-center">Login to SecureShare</h2>

        {error && <p className="bg-accent-red/20 text-accent-red border border-accent-red px-4 py-3 rounded-md mb-2 text-center animate-fade-in">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full bg-card-inner-dark text-text-white placeholder-text-light-gray p-2 rounded border border-border-subtle
                       focus:outline-none focus:ring-1 focus:ring-accent-blue"
            required
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-card-inner-dark text-text-white placeholder-text-light-gray p-2 rounded border border-border-subtle
                         focus:outline-none focus:ring-1 focus:ring-accent-blue pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-text-light-gray hover:text-text-white transition-colors duration-200"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-accent-blue text-white p-2 rounded hover:bg-blue-600 transition-colors duration-200 shadow-btn-hover"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-sm text-text-light-gray text-center">
          Don't have an account? <Link to="/register" className="text-accent-blue hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;