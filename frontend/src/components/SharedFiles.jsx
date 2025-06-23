import React, { useEffect, useState } from 'react';
import API from '../utils/api';

function SharedFiles() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [copied, setCopied] = useState(false);

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
    if (diff === 0) return 'Expired';

    const hrs = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    
    let timeString = '';
    if (hrs > 0) timeString += `${hrs}h `;
    timeString += `${mins}m remaining`;
    
    return timeString.trim();
  };

  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); 
  };

  return (
    <div className="min-h-screen bg-true-black text-text-white p-6 md:p-10 font-sans">
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-text-white">Your Shared Files</h2>
      
      {error && (
        <p className="bg-accent-red/20 text-accent-red border border-accent-red px-4 py-3 rounded-md mb-6 animate-fade-in">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {files.map(f => (
          <div 
            key={f.id} 
            className="bg-card-dark-gray rounded-lg shadow-card-elevate p-5 border border-border-subtle 
                       animate-fade-in hover:shadow-lg transition-shadow duration-200 transform hover:scale-[1.02] cursor-pointer"
            onClick={() => setSelectedFile(f)} 
          >
            <div className="flex items-center justify-between mb-3">
              <span className="bg-true-black text-text-light-gray text-xs font-semibold px-2.5 py-1 rounded-full border border-border-subtle">
                {f.downloadCount}/{f.maxDownloads || '∞'}
              </span>
              <span className={`font-semibold text-sm ${new Date(f.expiresAt) <= new Date() ? 'text-accent-red' : 'text-accent-yellow'}`}>
                {timeRemaining(f.expiresAt)}
              </span>
            </div>
            <p className="text-xl font-semibold truncate mb-1">{f.originalName}</p>
            <p className="text-sm text-text-light-gray">Shared: {new Date(f.createdAt).toDateString()}</p>
            {/* The "View Details" button was removed as per previous instruction to make whole card clickable */}
          </div>
        ))}

        {files.length === 0 && !error && (
          <div className="col-span-full text-center text-text-light-gray py-10">
            <p className="text-xl font-medium">No files shared yet.</p>
            <p className="text-md mt-2">Upload a document to get started!</p>
          </div>
        )}
      </div>

      {selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-card-dark-gray p-8 rounded-lg w-full max-w-xl mx-auto text-text-white shadow-card-elevate border border-border-subtle animate-pop-scale">
            <h3 className="text-2xl font-bold mb-6">Share Details</h3>
            
            <div className="bg-card-inner-dark p-4 rounded-md mb-4 border border-border-subtle">
              <p className="text-lg font-semibold mb-1">{selectedFile.originalName}</p>
              <p className="text-sm text-text-light-gray">
                {(selectedFile.size / 1024).toFixed(2)} KB · Shared on {new Date(selectedFile.createdAt).toDateString()}
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2 text-text-light-gray">Share Link</label>
              <div className="flex items-center gap-3 bg-card-inner-dark p-3 rounded-md border border-border-subtle group">
                <input
                  readOnly
                  value={`${window.location.origin}/download/${selectedFile.id}`}
                  className="bg-transparent w-full text-text-white outline-none text-base truncate"
                />
                <button
                  onClick={() => handleCopyLink(`${window.location.origin}/download/${selectedFile.id}`)}
                  className="p-2 rounded-md bg-transparent hover:bg-true-black transition-colors duration-200 text-accent-blue flex-shrink-0"
                  aria-label="Copy link to clipboard"
                >
                  {copied ? (
                    <span className="text-accent-green text-xl animate-copied-fade">✅</span> 
                  ) : (
                    <span className="text-accent-blue text-xl">📋</span> 
                  )}
                </button>
              </div>
            </div>
            
            <div className="bg-card-inner-dark p-4 rounded-md text-sm mb-6 border border-border-subtle">
              <p className="mb-1">This file has been accessed <strong className="text-accent-blue">{selectedFile.downloadCount}</strong> times out of <strong className="text-accent-blue">{selectedFile.maxDownloads || '∞'}</strong> allowed downloads.</p>
              <p className={`font-semibold ${new Date(selectedFile.expiresAt) <= new Date() ? 'text-accent-red' : 'text-accent-yellow'}`}>
                It will expire <strong>{timeRemaining(selectedFile.expiresAt)}</strong>.
              </p>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={async () => {
                  if (window.confirm('Are you sure you want to delete this file?')) {
                    try {
                      await API.delete(`/files/${selectedFile.id}`);
                      setFiles(prev => prev.filter(f => f.id !== selectedFile.id));
                      setSelectedFile(null);
                    } catch (err) {
                      alert('Failed to delete file.');
                    }
                  }
                }}
                className="bg-accent-red hover:bg-red-600 text-white font-semibold px-5 py-2.5 rounded-md transition-all duration-200 shadow-btn-hover"
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedFile(null)}
                className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-5 py-2.5 rounded-md transition-all duration-200 shadow-btn-hover"
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