'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, AlertCircle, X, CheckCircle2 } from 'lucide-react';

interface UploadDataProps {
  onUpload: (file: File) => void;
  isLoading: boolean;
}

export default function UploadData({ onUpload, isLoading }: UploadDataProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    setError(null);
    if (!selectedFile.name.endsWith('.zip')) {
      setError('Please upload a valid .zip archive exported from Instagram.');
      return;
    }
    if (selectedFile.size > 100 * 1024 * 1024) {
      setError('ZIP file is too large (maximum 100MB supported).');
      return;
    }
    setFile(selectedFile);
    onUpload(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <label className="text-sm font-semibold pl-1" style={{ color: 'var(--text-secondary)' }}>
        Your Account Data (Instagram ZIP Export)
      </label>
      
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => !file && !isLoading && inputRef.current?.click()}
        className="relative border-2 border-dashed rounded-2xl p-10 transition-all duration-300 flex flex-col items-center justify-center gap-5 text-center cursor-pointer min-h-[220px]"
        style={{
          borderColor: dragActive ? 'var(--brand-primary)' : file ? 'rgba(34,197,94,0.4)' : 'var(--border-default)',
          background: dragActive ? 'rgba(99,102,241,0.04)' : file ? 'rgba(34,197,94,0.03)' : 'var(--bg-surface)',
          opacity: isLoading ? 0.5 : 1,
          pointerEvents: isLoading ? 'none' : 'auto',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".zip"
          className="hidden"
          onChange={handleChange}
          disabled={isLoading}
        />

        {!file ? (
          <>
            <div
              className="p-5 rounded-2xl transition-transform duration-300"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-default)',
                color: dragActive ? 'var(--brand-primary)' : 'var(--text-muted)',
                transform: dragActive ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              <UploadCloud className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Drag & drop your Instagram data ZIP
              </p>
              <p className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>
                or click to browse from your computer (max 100MB)
              </p>
            </div>
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium max-w-sm"
              style={{ background: 'rgba(234,179,8,0.06)', border: '1px solid rgba(234,179,8,0.15)', color: '#facc15' }}
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>We parse ZIP exports fully locally in your browser.</span>
            </div>
          </>
        ) : (
          <div
            className="w-full flex items-center justify-between gap-4 p-4 rounded-xl animate-scale-in"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
          >
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-lg" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)' }}>
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5" style={{ color: 'var(--color-success)' }} fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--color-success)' }} />
                )}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold max-w-[200px] sm:max-w-xs truncate" style={{ color: 'var(--text-primary)' }}>
                  {file.name}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {(file.size / (1024 * 1024)).toFixed(2)} MB · {isLoading ? 'Parsing ZIP archive...' : 'Ready for analysis'}
                </p>
              </div>
            </div>
            {!isLoading && (
              <button
                onClick={(e) => { e.stopPropagation(); removeFile(); }}
                className="p-2 rounded-lg transition-colors"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', color: 'var(--text-muted)' }}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs font-medium pl-1 animate-fade-in" style={{ color: 'var(--color-error)' }}>
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
