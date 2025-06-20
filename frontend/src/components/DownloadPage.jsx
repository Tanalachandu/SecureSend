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
      const info = await API.get(`/files/${id}`);
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
      const info = await API.get(`/files/${id}`);
      setFileMeta(info.data);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Download failed');
    } finally {
      setBusy(false);
    }
  };

  const expired = fileMeta?.expired;

  const fmtSize = b => {
    if (!b) return 'NaN MB';
    const kb = b / 1024;
    return kb < 1024 ? `${kb.toFixed(2)} KB` : `${(kb / 1024).toFixed(2)} MB`;
  };

  const fmtTime = () => {
    if (!fileMeta.expiresAt) return 'Never';
    const diff = new Date(fileMeta.expiresAt) - Date.now();
    if (diff <= 0) return 'Expired';
    const hrs = Math.floor(diff / 3600000);
    return `in about ${hrs} hour${hrs !== 1 ? 's' : ''}`;
  };

  if (loadingMeta) {
    return <div className="p-4 text-gray-400">Loading file info…</div>;
  }
  if (requiresPassword === null && errorMsg) {
    return <div className="p-4 text-red-500">{errorMsg}</div>;
  }

  if (requiresPassword && !unlocked) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-[#111] rounded-xl border border-purple-600 max-w-sm w-full p-6 text-center">
          <h1 className="text-white text-xl font-semibold mb-2">Secure File Access</h1>
          <p className="text-gray-400 mb-6">Enter the passphrase to access the shared file</p>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-black border border-gray-600 rounded px-4 py-2 pr-10 text-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          {errorMsg && <p className="mt-2 text-sm text-red-500">{errorMsg}</p>}

          <button
            onClick={handleUnlock}
            disabled={busy}
            className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded disabled:opacity-50"
          >
            {busy ? 'Unlocking…' : 'Unlock File'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className={`bg-[#111] rounded-xl border ${expired ? 'border-red-500' : 'border-green-700'} max-w-xl w-full p-6`}>
        <div className="flex items-center justify-between mb-4">
          <span className={`text-sm font-semibold ${expired ? 'text-red-500' : 'text-green-400'}`}>
            {expired ? 'Download Limit Reached' : 'Access Granted'}
          </span>
          <span className="bg-gray-700 text-xs px-2 py-1 rounded">
            {fileMeta.originalName?.split('.').pop().toUpperCase()}
          </span>
        </div>

        <h2 className="text-lg font-bold text-purple-400 truncate mb-2">
          {fileMeta.originalName}
        </h2>
        <p className="text-xs text-gray-400 mb-1">Shared file details</p>
        <p className="text-sm mb-1">
          Size: <span className="text-green-400">{fmtSize(fileMeta.size)}</span>
        </p>
        <p className="text-sm mb-1">
          Downloads Left: <span className="text-green-400">{fileMeta.maxDownloads !== null ? fileMeta.maxDownloads - fileMeta.downloadCount : '∞'}</span>
        </p>
        <p className="text-sm mb-1 text-orange-400">Time Remaining: {fmtTime()}</p>

        {fileMeta.maxDownloads !== null && (
          <div className="w-full bg-gray-700 h-2 rounded mt-2">
            <div
              className="bg-purple-600 h-2 rounded"
              style={{ width: `${(fileMeta.downloadCount / fileMeta.maxDownloads) * 100}%` }}
            />
          </div>
        )}
        {fileMeta.expiresAt && (
          <p className="text-xs text-gray-500 mt-1">
            Expires {new Date(fileMeta.expiresAt).toDateString()}
          </p>
        )}

        {expired ? (
          <p className="mt-4 text-red-500 text-center font-semibold">
            This file has reached its download limit.
          </p>
        ) : (
          <>
            {errorMsg && <p className="mt-2 text-sm text-red-500">{errorMsg}</p>}
            <button
              onClick={handleDownload}
              disabled={busy}
              className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded disabled:opacity-50"
            >
              {busy ? 'Downloading…' : 'Download File'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
