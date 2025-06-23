import React, { useState } from 'react';
import API from '../utils/api';

function UploadPage() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [maxDownloads, setMaxDownloads] = useState('');
  const [expireHours, setExpireHours] = useState('');
  const [link, setLink] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false); // State for copy feedback

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setLink(''); // Clear previous link
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    if (password) formData.append('password', password);
    if (maxDownloads) formData.append('maxDownloads', maxDownloads);
    if (expireHours) formData.append('expireHours', expireHours);

    try {
      const res = await API.post('/files/upload', formData);
      const { id, accessKey } = res.data;
      let url = `${window.location.origin}/download/${id}`;
      if (accessKey) url += `?key=${accessKey}`;
      setLink(url);
      setFile(null); // Clear file input after successful upload
      setPassword('');
      setMaxDownloads('');
      setExpireHours('');
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed. Please try again.');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
  };

  return (
    <div className="min-h-screen bg-true-black text-text-white flex items-center justify-center p-6 font-sans">
      <div className="bg-card-dark-gray p-8 rounded-lg shadow-card-elevate w-full max-w-lg border border-border-subtle animate-fade-in">
        <h2 className="text-2xl font-bold mb-6 text-text-white text-center">🚀 Upload File</h2>

        {error && (
          <p className="bg-accent-red/20 text-accent-red border border-accent-red px-4 py-3 rounded-md mb-4 text-center animate-fade-in">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-text-light-gray text-sm mb-1">Select File:</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full p-2 bg-card-inner-dark text-text-white border border-border-subtle rounded outline-none 
                       focus:ring-1 focus:ring-accent-blue transition-all duration-200 file:mr-4 file:py-2 file:px-4
                       file:rounded-md file:border-0 file:text-sm file:font-semibold
                       file:bg-accent-blue/80 file:text-text-white hover:file:bg-accent-blue cursor-pointer"
          />
          <input
            type="password"
            placeholder="Password (optional)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-card-inner-dark text-text-white placeholder-text-light-gray border border-border-subtle rounded outline-none 
                       focus:ring-1 focus:ring-accent-blue transition-all duration-200"
          />
          <input
            type="number"
            placeholder="Max Downloads (optional, e.g., 5)"
            value={maxDownloads}
            onChange={(e) => setMaxDownloads(e.target.value)}
            min="1"
            className="w-full p-3 bg-card-inner-dark text-text-white placeholder-text-light-gray border border-border-subtle rounded outline-none 
                       focus:ring-1 focus:ring-accent-blue transition-all duration-200"
          />
          <input
            type="number"
            placeholder="Expire After (Hours, e.g., 24)"
            value={expireHours}
            onChange={(e) => setExpireHours(e.target.value)}
            min="1"
            className="w-full p-3 bg-card-inner-dark text-text-white placeholder-text-light-gray border border-border-subtle rounded outline-none 
                       focus:ring-1 focus:ring-accent-blue transition-all duration-200"
          />
          <button
            type="submit"
            className="w-full bg-accent-blue text-white font-semibold p-3 rounded hover:bg-blue-600 transition-all duration-200 shadow-btn-hover"
          >
            Upload File
          </button>
        </form>

        {link && (
          <div className="mt-6 p-4 bg-card-dark-gray rounded-lg border border-border-subtle animate-fade-in">
            <p className="text-accent-green mb-2 font-semibold text-center">Your file has been uploaded!</p>
            <label className="block text-text-light-gray text-sm mb-1">Share Link:</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={link}
                readOnly
                className="flex-1 bg-card-inner-dark text-text-white p-3 rounded border border-border-subtle outline-none truncate"
              />
              <button
                onClick={handleCopyLink}
                className="bg-accent-green hover:bg-green-600 px-4 py-2 rounded font-medium text-white transition-colors duration-200 flex-shrink-0"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadPage;