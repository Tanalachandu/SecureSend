import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../utils/api';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // New state for confirm password visibility

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await API.post('/auth/register', {
        email,
        username,
        password
      });
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-true-black p-4 font-sans">
      <div className="bg-card-dark-gray p-6 rounded-lg shadow-card-elevate w-full max-w-sm border border-border-subtle animate-fade-in">
        <h1 className="text-3xl font-extrabold mb-2 text-accent-blue text-center">SecureShare</h1>
        <h2 className="text-xl font-bold mb-4 text-text-white text-center">Register Account</h2>

        {error && <p className="bg-accent-red/20 text-accent-red border border-accent-red px-4 py-3 rounded-md mb-2 text-center animate-fade-in">{error}</p>}
        {success && <p className="bg-accent-green/20 text-accent-green border border-accent-green px-4 py-3 rounded-md mb-2 text-center animate-fade-in">{success}</p>}

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
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full bg-card-inner-dark text-text-white placeholder-text-light-gray p-2 rounded border border-border-subtle
                       focus:outline-none focus:ring-1 focus:ring-accent-blue"
            required
          />
          <div className="relative"> {/* Wrap password input in a relative div */}
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
          <div className="relative"> {/* Wrap confirm password input in a relative div */}
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full bg-card-inner-dark text-text-white placeholder-text-light-gray p-2 rounded border border-border-subtle
                         focus:outline-none focus:ring-1 focus:ring-accent-blue pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(v => !v)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-text-light-gray hover:text-text-white transition-colors duration-200"
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showConfirmPassword ? '🙈' : '👁️'}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-accent-blue text-white p-2 rounded hover:bg-blue-600 transition-colors duration-200 shadow-btn-hover"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-sm text-text-light-gray text-center">
          Already have an account? <Link to="/login" className="text-accent-blue hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;