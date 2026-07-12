'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles, Search, ArrowRight, BarChart3,
  Brain, FileDown, Shield, Zap,
  CheckCircle2, HelpCircle
} from 'lucide-react';
import UploadData from '@/components/input/UploadData';
import ProgressOverlay from '@/components/ui/ProgressOverlay';
import ErrorPanel from '@/components/ui/ErrorPanel';
import { useAnalysis } from '@/hooks/useAnalysis';

export default function LandingPage() {
  const router = useRouter();
  const { analyze, analyzeZip, status, error, username, reset } = useAnalysis();
  const [input, setInput] = useState('');
  const [inputError, setInputError] = useState('');
  const [showZip, setShowZip] = useState(false);
  const [parsingZip, setParsingZip] = useState(false);

  const isLoading = status === 'loading' || parsingZip;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInputError('');
    const raw = input.trim().replace(/^@/, '').replace(/.*instagram\.com\//, '').split('/')[0].split('?')[0];
    if (!raw) { setInputError('Enter a username or Instagram URL'); return; }
    if (!/^[a-zA-Z0-9._]{1,30}$/.test(raw)) { setInputError('Invalid Instagram username format'); return; }
    try {
      const res = await analyze(raw);
      if (res?.profile?.username) router.push(`/analyze/${res.profile.username}`);
    } catch { /* error shown via store */ }
  };

  const handleZipUpload = async (file: File) => {
    try {
      setParsingZip(true);
      const res = await analyzeZip(file);
      if (res?.profile?.username) router.push(`/analyze/${res.profile.username}`);
    } catch { /* error shown via store */ } finally {
      setParsingZip(false);
    }
  };

  const features = [
    { icon: BarChart3, title: 'Real Analytics', desc: 'Engagement rates, posting frequency, and content type breakdown from live crawl data.', gradient: 'from-pink-500/15 to-rose-500/10', iconColor: 'text-pink-400' },
    { icon: Brain, title: 'AI Strategy', desc: 'Gemini AI generates niche analysis, competitor mapping, and 90-day content plans.', gradient: 'from-purple-500/15 to-violet-500/10', iconColor: 'text-purple-400' },
    { icon: FileDown, title: 'PDF Reports', desc: 'Download a complete branded report with all insights, charts, and recommendations.', gradient: 'from-blue-500/15 to-cyan-500/10', iconColor: 'text-blue-400' },
  ];

  const stats = [
    { value: '100%', label: 'Free Forever' },
    { value: '30s', label: 'Analysis Time' },
    { value: '90-Day', label: 'Content Plan' },
    { value: 'AI', label: 'Competitor Map' },
  ];

  if (status === 'error' && error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          <ErrorPanel error={error} onRetry={() => { reset(); }} onReset={() => { reset(); setInput(''); }} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background bg-grid-pattern overflow-hidden flex flex-col">
      {/* Ambient glows */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] rounded-full bg-brand/6 blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-purple/6 blur-[120px] pointer-events-none -z-10" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-subtle bg-background/70 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center shadow-brand">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-sm tracking-tight gradient-text">
              InstaAnalyzer
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1.5 text-[10px] text-muted border border-subtle px-2.5 py-1 rounded-full bg-surface/50 font-medium">
              <Shield className="w-3 h-3 text-green-400" />
              Public data only · No login required
            </span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 md:py-24 text-center">
        <div className="flex flex-col items-center gap-8 w-full max-w-2xl animate-fade-in">

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-[10px] font-bold">
            <Zap className="w-3 h-3" />
            AI-Powered · Free · No API Key Needed
          </div>

          {/* Headline */}
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary leading-tight">
              Turn any Instagram profile<br />
              <span className="gradient-text">into a growth strategy</span>
            </h1>
            <p className="text-sm md:text-base text-muted max-w-xl mx-auto leading-relaxed">
              Paste any public Instagram username. Get real analytics, AI competitor analysis, a 90-day content calendar, and a downloadable PDF report — in 30 seconds.
            </p>
          </div>

          {/* Search Form */}
          <div className="w-full flex flex-col gap-2.5">
            <form onSubmit={handleSubmit} className="relative w-full">
              <div className="relative flex items-center group">
                <div className="absolute left-4 text-muted pointer-events-none transition-colors group-focus-within:text-brand">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={input}
                  onChange={e => { setInput(e.target.value); setInputError(''); }}
                  placeholder="@username or instagram.com/username"
                  disabled={isLoading}
                  className="w-full h-14 pl-12 pr-40 bg-elevated border border-default rounded-xl text-sm font-medium text-primary placeholder:text-muted outline-none transition-all duration-200 focus:border-brand focus:shadow-[0_0_0_3px_rgba(225,48,108,0.1)] disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 h-10 px-5 bg-brand-gradient text-white font-bold text-xs rounded-lg shadow-brand hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed disabled:translate-y-0 flex items-center gap-1.5"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Analyzing
                    </>
                  ) : (
                    <>Analyze <ArrowRight className="w-3.5 h-3.5" /></>
                  )}
                </button>
              </div>
              {inputError && (
                <p className="mt-1.5 text-[11px] text-red-400 font-medium pl-1">{inputError}</p>
              )}
            </form>

            {/* ZIP Upload toggle */}
            <div className="flex items-center justify-center">
              <button
                onClick={() => setShowZip(v => !v)}
                className="flex items-center gap-1.5 text-[11px] text-muted hover:text-primary transition-colors"
              >
                <HelpCircle className="w-3 h-3" />
                Have your own data? Upload Instagram ZIP export instead
              </button>
            </div>

            {showZip && (
              <div className="w-full animate-fade-in-up">
                <UploadData onUpload={handleZipUpload} isLoading={isLoading} />
              </div>
            )}
          </div>

          {/* Stats strip */}
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {stats.map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-0.5 p-3.5 rounded-xl bg-surface/50 border border-subtle">
                <span className="text-lg font-extrabold text-primary">{s.value}</span>
                <span className="text-[10px] text-muted font-medium">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Feature cards */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4 mt-16 animate-fade-in" style={{ animationDelay: '200ms' }}>
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="group p-5 rounded-xl bg-surface border border-subtle hover:border-default transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)] text-left flex flex-col gap-3">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${f.gradient} border border-subtle flex items-center justify-center`}>
                  <Icon className={`w-4.5 h-4.5 ${f.iconColor}`} />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-bold text-primary text-xs">{f.title}</h3>
                  <p className="text-[11px] text-muted leading-relaxed">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-subtle py-5 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-muted">
          <p>&copy; {new Date().getFullYear()} InstaAnalyzer · Only analyzes public profiles</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-green-400" />No account needed</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-green-400" />100% free</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-green-400" />No data stored</span>
          </div>
        </div>
      </footer>

      <ProgressOverlay
        isVisible={isLoading}
        username={username || 'profile'}
        isZipMode={showZip}
      />
    </div>
  );
}
