import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl sm:text-5xl font-bold text-center leading-tight">
        YOUR FILES. <span className="text-indigo-400">FULLY ENCRYPTED.</span><br />
        COMPLETELY PRIVATE.
      </h1>

      {/* Optional quote/line below the header */}
      <p className="text-center mt-6 max-w-xl text-gray-300 text-lg">
        End-to-end encryption in your browser — your keys never leave your device.  
        Share files confidently knowing your privacy is protected.
      </p>

      <button
        onClick={handleStart}
        className="mt-8 bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg text-white font-semibold text-lg"
      >
        Start Sharing Securely
      </button>
    </div>
  );
}
