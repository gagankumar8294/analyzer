'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, File, AlertCircle, X, CheckCircle2 } from 'lucide-react';

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
    // Limit to 100MB for safe browser parsing
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
      <label className="text-body-sm font-semibold text-muted pl-1">
        Your Account Data (Instagram ZIP Export)
      </label>
      
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => !file && !isLoading && inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 flex flex-col items-center justify-center gap-4 text-center cursor-pointer min-h-[200px]
          ${dragActive ? 'border-brand bg-brand/5 shadow-brand' : 'border-default bg-surface/50 hover:border-strong'}
          ${file ? 'border-green-500/50 bg-green-500/5' : ''}
          ${isLoading ? 'opacity-50 pointer-events-none' : ''}
        `}
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
            <div className={`p-4 rounded-full bg-elevated border border-default text-muted transition-transform duration-300 ${dragActive ? 'scale-110 text-brand' : ''}`}>
              <UploadCloud className="w-8 h-8" />
            </div>
            <div>
              <p className="text-body font-semibold text-primary">
                Drag & drop your Instagram data ZIP
              </p>
              <p className="text-caption text-muted mt-1">
                or click to browse from your computer (max 100MB)
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-caption font-medium max-w-sm mt-1">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>We parse ZIP exports fully locally in your browser.</span>
            </div>
          </>
        ) : (
          <div className="w-full flex items-center justify-between gap-4 p-3 bg-elevated border border-default rounded-lg animate-scale-in">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded bg-green-500/10 text-green-400 border border-green-500/20">
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <CheckCircle2 className="w-5 h-5" />
                )}
              </div>
              <div className="text-left">
                <p className="text-body-sm font-semibold text-primary max-w-[200px] sm:max-w-xs truncate">
                  {file.name}
                </p>
                <p className="text-caption text-muted">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB • {isLoading ? 'Parsing ZIP archive...' : 'Ready for analysis'}
                </p>
              </div>
            </div>
            {!isLoading && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
                className="p-1.5 rounded-lg bg-surface hover:bg-hover text-muted hover:text-primary transition-colors border border-default"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-caption text-red-400 font-medium pl-1 animate-fade-in">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
