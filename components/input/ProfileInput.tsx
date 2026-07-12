'use client';

import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { parseUsername, isValidUsername } from '@/lib/utils/formatting';

interface ProfileInputProps {
  onSubmit: (username: string) => void;
  isLoading: boolean;
}

export default function ProfileInput({ onSubmit, isLoading }: ProfileInputProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!input.trim()) {
      setError('Please enter a username or URL');
      return;
    }

    const username = parseUsername(input);
    if (!isValidUsername(username)) {
      setError('Invalid Instagram username format');
      return;
    }

    onSubmit(username);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-3">
        <label className="text-body-sm font-semibold text-muted pl-1">
          Competitor Instagram Username or Profile URL
        </label>
        <div className="relative flex items-center">
          <div className="absolute left-4 text-muted pointer-events-none">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="e.g. @creators or instagram.com/nike"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (error) setError(null);
            }}
            disabled={isLoading}
            className="input pl-12 pr-32 h-14 text-body font-medium"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="btn btn-primary absolute right-2 top-2 h-10 px-5 text-caption font-bold tracking-wide uppercase"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Analyzing
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Analyze
              </span>
            )}
          </button>
        </div>
        {error && (
          <p className="text-caption text-red-400 pl-1 font-medium animate-fade-in">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}
