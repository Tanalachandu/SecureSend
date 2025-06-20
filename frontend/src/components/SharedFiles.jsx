// ✅ UPDATED: SharedFiles.jsx
import React, { useEffect, useState } from 'react';
import API from '../utils/api';

function SharedFiles() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    API.get('/files/list')
      .then(res => {
        const live = res.data.filter(f =>
          (!f.expiresAt || new Date(f.expiresAt) > new Date()) &&
          (f.maxDownloads == null || f.downloadCount < f.maxDownloads)
        );
        setFiles(live);
      })
      .catch(err => setError(err.response?.data?.error || 'Failed to load files'));
  }, []);

  const timeRemaining = expiresAt => {
    if (!expiresAt) return 'No expiry';
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = Math.max(expiry - now, 0);
    const hrs = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    return `${hrs}h ${mins}m remaining`;
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h2 className="text-2xl font-semibold mb-6">Your Shared Files</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map(f => (
          <div key={f.id} className="bg-[#111] rounded-lg shadow-md p-4 relative">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-gray-800 text-blue-300 text-xs px-2 py-1 rounded-full">
                {f.downloadCount}/{f.maxDownloads || '∞'}
              </div>
            </div>
            <p className="text-sm font-semibold truncate">{f.originalName}</p>
            <p className="text-xs text-gray-400">Shared: {new Date(f.createdAt).toDateString()}</p>
            <p className="text-xs text-yellow-400 mt-2">{timeRemaining(f.expiresAt)}</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelectedFile(f)}
                className="text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#1f1f1f] p-6 rounded-lg w-full max-w-lg mx-4 text-white">
            <h3 className="text-xl font-semibold mb-4">Share Details</h3>
            <div className="bg-[#2a2a2a] p-4 rounded mb-4">
              <p className="font-medium">{selectedFile.originalName}</p>
              <p className="text-sm text-gray-400">
                {(selectedFile.size / 1024).toFixed(2)} KB · Shared on {new Date(selectedFile.createdAt).toDateString()}
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">Share Link</label>
              <div className="flex items-center gap-2 bg-[#2a2a2a] p-2 rounded">
                <input
                  readOnly
                  value={`${window.location.origin}/download/${selectedFile.id}`}
                  className="bg-transparent w-full text-white outline-none"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}/download/${selectedFile.id}`)}
                  className="text-blue-400 hover:text-blue-500"
                >📋</button>
              </div>
            </div>
            <div className="bg-gray-800 p-3 rounded text-sm mb-4">
              <p>This file has been accessed <strong>{selectedFile.downloadCount}</strong> times out of <strong>{selectedFile.maxDownloads || '∞'}</strong> allowed downloads.</p>
              <p>It will expire <strong>{timeRemaining(selectedFile.expiresAt)}</strong>.</p>
            </div>
            <div className="text-right flex justify-end gap-2">
              <button
                onClick={async () => {
                  try {
                    await API.delete(`/files/${selectedFile.id}`);
                    setFiles(prev => prev.filter(f => f.id !== selectedFile.id));
                    setSelectedFile(null);
                  } catch (err) {
                    alert('Failed to delete file.');
                  }
                }}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedFile(null)}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SharedFiles;
