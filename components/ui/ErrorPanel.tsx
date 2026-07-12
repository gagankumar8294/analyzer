'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldAlert, Sparkles } from 'lucide-react';

interface ErrorPanelProps {
  error: string;
  onRetry: () => void;
  onReset: () => void;
  onDemoMode?: () => void;
}

export default function ErrorPanel({ error, onRetry, onReset, onDemoMode }: ErrorPanelProps) {
  const isRateLimit = error.toLowerCase().includes('rate limit') || error.toLowerCase().includes('429') || error.toLowerCase().includes('too many requests');
  const isPrivate = error.toLowerCase().includes('private') || error.toLowerCase().includes('restricted');
  const isSubscribedError = error.toLowerCase().includes('subscribed') || error.toLowerCase().includes('403') || error.toLowerCase().includes('forbidden');

  return (
    <div className="w-full max-w-md card-glass border border-red-500/20 p-6 md:p-8 rounded-2xl flex flex-col items-center text-center gap-6 shadow-lg animate-scale-in relative overflow-hidden">
      {/* Glow border effect */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-red-500/50" />

      {/* Warning Icon */}
      <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 animate-pulse">
        <AlertTriangle className="w-10 h-10" />
      </div>

      {/* Error Details */}
      <div className="flex flex-col gap-2">
        <h3 className="text-heading-3 font-extrabold text-primary">
          Analysis Encountered an Issue
        </h3>
        <p className="text-body-sm text-red-300 font-semibold bg-red-500/5 border border-red-500/10 px-3 py-2 rounded-lg break-words">
          {error}
        </p>
      </div>

      {/* Dynamic Actionable Solutions */}
      <div className="w-full text-left p-4 rounded-xl bg-elevated border border-default flex flex-col gap-2">
        <p className="text-caption text-muted font-bold tracking-wide uppercase flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-brand" />
          Recommended Actions
        </p>
        
        {isRateLimit ? (
          <p className="text-body-sm text-muted">
            Instagram scraper limits were reached. Try again later or use the ZIP Data Upload option for a reliable, zero-limit analysis.
          </p>
        ) : isPrivate ? (
          <p className="text-body-sm text-muted">
            The requested profile is private. InstaAnalyzer can only retrieve data from public accounts. Please verify the profile visibility.
          </p>
        ) : isSubscribedError ? (
          <p className="text-body-sm text-muted">
            The API subscription is not active. Please check your Apify token configuration, or proceed using AI-generated demo data.
          </p>
        ) : (
          <p className="text-body-sm text-muted">
            This could be a temporary Instagram connection drop, rate limit, or proxy configuration issue. You can try retrying or proceed using AI-generated demo data.
          </p>
        )}
      </div>

      {/* Button controls */}
      <div className="flex flex-col gap-3 w-full mt-2">
        {onDemoMode && (
          <button
            onClick={onDemoMode}
            className="w-full btn btn-primary bg-brand-gradient text-white flex items-center justify-center gap-2 text-caption font-bold tracking-wider uppercase h-11 shadow-brand cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            Proceed with AI Demo Data
          </button>
        )}
        <div className="grid grid-cols-2 gap-3 w-full">
          <button
            onClick={onRetry}
            className="btn btn-secondary flex items-center justify-center gap-2 text-caption font-bold tracking-wider uppercase h-11 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Scan
          </button>
          <button
            onClick={onReset}
            className="btn btn-secondary flex items-center justify-center gap-2 text-caption font-bold tracking-wider uppercase h-11 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Back Home
          </button>
        </div>
      </div>
    </div>
  );
}
