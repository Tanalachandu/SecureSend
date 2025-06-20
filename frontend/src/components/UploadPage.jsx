import React, { useState } from 'react';
import API from '../utils/api';

function UploadPage() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [maxDownloads, setMaxDownloads] = useState('');
  const [expireHours, setExpireHours] = useState('');
  const [link, setLink] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a file');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('password', password);
    formData.append('maxDownloads', maxDownloads);
    formData.append('expireHours', expireHours);

    try {
      const res = await API.post('/files/upload', formData);
      const { id, accessKey } = res.data;
      let url = `${window.location.origin}/download/${id}`;
      if (accessKey) url += `?key=${accessKey}`;
      setLink(url);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0f1a] text-white flex items-center justify-center p-6">
      <div className="bg-[#1b1e2b] p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-[#2c3146]">
        <h2 className="text-2xl font-bold mb-6 text-white">🚀 Upload File</h2>

        {error && <p className="text-red-400 mb-4 font-medium">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full p-2 bg-[#2a2e42] border border-gray-700 rounded outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password (optional)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 bg-[#2a2e42] border border-gray-700 rounded outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Max Downloads (optional)"
            value={maxDownloads}
            onChange={(e) => setMaxDownloads(e.target.value)}
            className="w-full p-2 bg-[#2a2e42] border border-gray-700 rounded outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Expire After (Hours)"
            value={expireHours}
            onChange={(e) => setExpireHours(e.target.value)}
            className="w-full p-2 bg-[#2a2e42] border border-gray-700 rounded outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded font-semibold transition-all shadow-md hover:shadow-lg"
          >
            Upload
          </button>
        </form>

        {link && (
          <div className="mt-6 p-4 bg-[#262a3f] rounded-lg border border-gray-700">
            <p className="text-green-400 mb-2 font-semibold">Copy and share this link:</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={link}
                readOnly
                className="flex-1 bg-[#1e2235] text-white p-2 rounded border border-gray-600"
              />
              <button
                onClick={() => navigator.clipboard.writeText(link)}
                className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded font-medium"
              >
                Copy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadPage;
