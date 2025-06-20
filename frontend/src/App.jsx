import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };
  const username = localStorage.getItem('username');
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Welcome{username ? `, ${username}` : ''}!</h1>
        <nav className="flex flex-col space-y-2">
          <Link to="/upload" className="text-blue-500 hover:underline">Upload File</Link>
          <Link to="/files" className="text-blue-500 hover:underline">My Shared Files</Link>
        </nav>
        <button onClick={handleLogout} className="mt-6 w-full bg-red-500 text-white p-2 rounded hover:bg-red-600">Logout</button>
      </div>
    </div>
  );
}
export default App;