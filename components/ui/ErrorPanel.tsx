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
    <div
      className="w-full max-w-md p-8 rounded-2xl flex flex-col items-center text-center gap-7 animate-scale-in relative overflow-hidden"
      style={{ background: 'var(--bg-surface)', border: '1px solid rgba(239,68,68,0.2)', boxShadow: 'var(--shadow-lg)' }}
    >
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'rgba(239,68,68,0.5)' }} />

      <div className="p-4 rounded-2xl" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
        <AlertTriangle className="w-10 h-10" style={{ color: '#f87171' }} />
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
          Analysis Encountered an Issue
        </h3>
        <p className="text-sm font-semibold px-4 py-2.5 rounded-xl break-words" style={{ color: '#fca5a5', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)' }}>
          {error}
        </p>
      </div>

      <div className="w-full text-left p-5 rounded-xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}>
        <p className="text-xs font-bold uppercase flex items-center gap-2 mb-2" style={{ color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
          <ShieldAlert className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />
          Recommended Actions
        </p>
        
        {isRateLimit ? (
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Instagram scraper limits were reached. Try again later or use the ZIP Data Upload option for a reliable, zero-limit analysis.
          </p>
        ) : isPrivate ? (
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            The requested profile is private. InstaAnalyzer can only retrieve data from public accounts. Please verify the profile visibility.
          </p>
        ) : isSubscribedError ? (
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            The API subscription is not active. Please check your Apify token configuration, or proceed using AI-generated demo data.
          </p>
        ) : (
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            This could be a temporary Instagram connection drop, rate limit, or proxy configuration issue. You can try retrying or proceed using AI-generated demo data.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 w-full mt-1">
        {onDemoMode && (
          <button
            onClick={onDemoMode}
            className="w-full flex items-center justify-center gap-2.5 text-xs font-bold uppercase h-12 rounded-xl transition-all"
            style={{ background: 'var(--gradient-brand)', color: '#fff', boxShadow: 'var(--shadow-brand)' }}
          >
            <Sparkles className="w-4 h-4" />
            Proceed with AI Demo Data
          </button>
        )}
        <div className="grid grid-cols-2 gap-3 w-full">
          <button
            onClick={onRetry}
            className="btn btn-secondary flex items-center justify-center gap-2 text-xs font-bold uppercase h-11"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Scan
          </button>
          <button
            onClick={onReset}
            className="btn btn-secondary flex items-center justify-center gap-2 text-xs font-bold uppercase h-11"
          >
            <Home className="w-4 h-4" />
            Back Home
          </button>
        </div>
      </div>
    </div>
  );
}
