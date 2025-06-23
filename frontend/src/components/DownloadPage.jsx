// ✅ Updated DownloadPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import API from '../utils/api';
import { downloadBlob } from '../utils/cryptoUtils';

export default function DownloadPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const accessKey = searchParams.get('key') || '';

  const [fileMeta, setFileMeta] = useState(null);
  const [requiresPassword, setRequiresPassword] = useState(null);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    API.get(`/files/${id}`, { params: accessKey ? { accessKey } : {} })
      .then(res => {
        setFileMeta(res.data);
        setRequiresPassword(res.data.requiresPassword);
        if (!res.data.requiresPassword) {
          setUnlocked(true);
        }
      })
      .catch(err => setErrorMsg(err.response?.data?.error || 'Error loading file info'))
      .finally(() => setLoadingMeta(false));
  }, [id, accessKey]);

  const handleUnlock = async () => {
    if (!password) {
      setErrorMsg('Please enter the passphrase');
      return;
    }
    setErrorMsg('');
    setBusy(true);
    try {
      await API.post(`/files/unlock/${id}`, { password });
      const info = await API.get(`/files/${id}`); // Fetch updated info after successful unlock
      setFileMeta(info.data);
      setUnlocked(true);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Incorrect passphrase');
    } finally {
      setBusy(false);
    }
  };

  const handleDownload = async () => {
    setErrorMsg('');
    setBusy(true);
    try {
      const res = await API.post(
        `/files/download/${id}`,
        { password, accessKey },
        { responseType: 'arraybuffer' }
      );
      downloadBlob(res.data, fileMeta.originalName);
      const info = await API.get(`/files/${id}`); // Fetch updated info after download
      setFileMeta(info.data);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Download failed');
    } finally {
      setBusy(false);
    }
  };

  const expired = fileMeta?.expired || (fileMeta && (new Date(fileMeta.expiresAt) <= new Date() || (fileMeta.maxDownloads !== null && fileMeta.downloadCount >= fileMeta.maxDownloads)));

  const fmtSize = b => {
    if (b == null) return 'N/A'; // Handle null or undefined
    const kb = b / 1024;
    return kb < 1024 ? `${kb.toFixed(2)} KB` : `${(kb / 1024).toFixed(2)} MB`;
  };

  const fmtTime = () => {
    if (!fileMeta.expiresAt) return 'Never';
    const diff = new Date(fileMeta.expiresAt) - Date.now();
    if (diff <= 0) return 'Expired';
    const hrs = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    
    let timeString = '';
    if (hrs > 0) timeString += `${hrs}h `;
    timeString += `${mins}m remaining`;
    
    return timeString.trim();
  };

  if (loadingMeta) {
    return (
      <div className="min-h-screen bg-true-black text-text-white flex items-center justify-center font-sans">
        <p className="text-text-light-gray animate-pulse">Loading file info…</p>
      </div>
    );
  }
  
  if (requiresPassword === null && errorMsg) {
    return (
      <div className="min-h-screen bg-true-black text-text-white flex items-center justify-center font-sans">
        <p className="text-accent-red">{errorMsg}</p>
      </div>
    );
  }

  if (requiresPassword && !unlocked) {
    return (
      <div className="min-h-screen bg-true-black flex items-center justify-center p-4 font-sans">
        <div className="bg-card-dark-gray rounded-lg shadow-card-elevate max-w-sm w-full p-6 text-center border border-border-subtle animate-fade-in">
          <h1 className="text-text-white text-xl font-semibold mb-2">Secure File Access</h1>
          <p className="text-text-light-gray mb-6">Enter the passphrase to access the shared file</p>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-card-inner-dark border border-border-subtle rounded px-4 py-2 pr-10 text-text-white placeholder-text-light-gray focus:outline-none focus:ring-1 focus:ring-accent-blue transition-all duration-200"
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

          {errorMsg && <p className="mt-4 text-sm text-accent-red animate-fade-in">{errorMsg}</p>}

          <button
            onClick={handleUnlock}
            disabled={busy}
            className="mt-6 w-full bg-accent-blue hover:bg-blue-600 text-text-white font-semibold py-2 rounded disabled:opacity-50 shadow-btn-hover transition-all duration-200"
          >
            {busy ? 'Unlocking…' : 'Unlock File'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-true-black text-text-white flex items-center justify-center p-4 font-sans">
      <div className={`bg-card-dark-gray rounded-lg shadow-card-elevate max-w-xl w-full p-6 border ${expired ? 'border-accent-red' : 'border-accent-green'} animate-fade-in`}>
        <div className="flex items-center justify-between mb-4">
          <span className={`text-sm font-semibold ${expired ? 'text-accent-red' : 'text-accent-green'}`}>
            {expired ? 'File Expired or Limit Reached' : 'Access Granted'}
          </span>
          {fileMeta.originalName && (
            <span className="bg-card-inner-dark text-text-light-gray text-xs px-2 py-1 rounded">
              {fileMeta.originalName.split('.').pop().toUpperCase()}
            </span>
          )}
        </div>

        <h2 className="text-xl font-bold text-accent-blue truncate mb-2">
          {fileMeta.originalName}
        </h2>
        <p className="text-sm text-text-light-gray mb-3">Shared file details</p>
        
        <div className="space-y-2 mb-4">
          <p className="text-base text-text-white">
            Size: <span className="text-accent-green font-medium">{fmtSize(fileMeta.size)}</span>
          </p>
          <p className="text-base text-text-white">
            Downloads Left: <span className="text-accent-green font-medium">{fileMeta.maxDownloads !== null ? fileMeta.maxDownloads - fileMeta.downloadCount : '∞'}</span>
          </p>
          <p className="text-base text-accent-yellow">Time Remaining: {fmtTime()}</p>
        </div>

        {fileMeta.maxDownloads !== null && (
          <div className="w-full bg-card-inner-dark h-2 rounded mt-2">
            <div
              className="bg-accent-blue h-2 rounded transition-all duration-300"
              style={{ width: `${(fileMeta.downloadCount / fileMeta.maxDownloads) * 100}%` }}
            />
          </div>
        )}
        {fileMeta.expiresAt && (
          <p className="text-xs text-text-light-gray mt-2">
            Expires {new Date(fileMeta.expiresAt).toLocaleString()}
          </p>
        )}

        {expired ? (
          <p className="mt-6 text-accent-red text-center font-semibold text-lg animate-fade-in">
            This file has expired or reached its download limit.
          </p>
        ) : (
          <>
            {errorMsg && <p className="mt-4 text-sm text-accent-red animate-fade-in">{errorMsg}</p>}
            <button
              onClick={handleDownload}
              disabled={busy}
              className="mt-6 w-full bg-accent-blue hover:bg-blue-600 text-text-white font-semibold py-3 rounded disabled:opacity-50 shadow-btn-hover transition-all duration-200"
            >
              {busy ? 'Downloading…' : 'Download File'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}