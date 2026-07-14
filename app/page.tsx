'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles, Search, ArrowRight, BarChart3,
  Brain, FileDown, Shield, Zap,
  CheckCircle2, HelpCircle, Loader2
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
    if (isLoading) return;
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
    { icon: BarChart3, title: 'Real Analytics', desc: 'Engagement rates, posting frequency, and content type breakdown from live data.' },
    { icon: Brain, title: 'AI Strategy', desc: 'Gemini AI generates niche analysis, competitor mapping, and 90-day content plans.' },
    { icon: FileDown, title: 'PDF Reports', desc: 'Download a complete branded report with all insights, charts, and recommendations.' },
  ];

  const stats = [
    { value: '100%', label: 'Free Forever' },
    { value: '~30s', label: 'Analysis Time' },
    { value: '90-Day', label: 'Content Plan' },
    { value: 'AI', label: 'Competitor Map' },
  ];

  if (status === 'error' && error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8" style={{ background: 'var(--bg-base)' }}>
        <div className="w-full max-w-lg">
          <ErrorPanel error={error} onRetry={() => { reset(); }} onReset={() => { reset(); setInput(''); }} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col" style={{ background: 'var(--bg-base)' }}>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'rgba(9,9,11,0.85)', backdropFilter: 'blur(16px)' }}>
        <div className="max-w-5xl mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-brand)', boxShadow: 'var(--shadow-brand)' }}>
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-bold text-sm tracking-tight gradient-text">
              InstaAnalyzer
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full" style={{ color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
              <Shield className="w-3.5 h-3.5" style={{ color: 'var(--color-success)' }} />
              Public data only · No login
            </span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 py-20 md:py-28 text-center">
        <div className="flex flex-col items-center gap-10 w-full max-w-2xl animate-fade-in">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', color: 'var(--brand-primary)' }}>
            <Zap className="w-3.5 h-3.5" />
            AI-Powered · Free · No API Key Needed
          </div>

          {/* Headline */}
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
              Turn any Instagram profile<br />
              <span className="gradient-text">into a growth strategy</span>
            </h1>
            <p className="text-base max-w-xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Paste any public Instagram username. Get real analytics, AI competitor analysis, a 90-day content calendar, and a downloadable PDF report.
            </p>
          </div>

          {/* Search Form */}
          <div className="w-full flex flex-col gap-3">
            <form onSubmit={handleSubmit} className="w-full flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors z-10" style={{ color: 'var(--text-muted)' }}>
                  <Search className="w-5 h-5 group-focus-within:text-[var(--brand-primary)]" />
                </div>
                <input
                  type="text"
                  value={input}
                  onChange={e => { setInput(e.target.value); setInputError(''); }}
                  placeholder="@username or instagram.com/username"
                  disabled={isLoading}
                  className="w-full h-14 rounded-2xl text-sm font-medium outline-none transition-all duration-200 disabled:opacity-50"
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-primary)',
                    paddingLeft: '48px',
                    paddingRight: '16px',
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="h-14 px-8 rounded-2xl text-white font-bold text-sm transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg sm:min-w-[160px] cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                style={{ 
                  background: 'var(--gradient-brand)', 
                  boxShadow: 'var(--shadow-brand)',
                  cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer'
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Analyze Profile</span>
                    <ArrowRight className="w-4.5 h-4.5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
            {inputError && (
              <p className="mt-1 text-xs font-medium pl-1 text-left" style={{ color: 'var(--color-error)' }}>{inputError}</p>
            )}

            {/* ZIP Upload toggle */}
            <div className="flex items-center justify-center">
              <button
                onClick={() => setShowZip(v => !v)}
                className="flex items-center gap-2 text-xs font-medium transition-colors"
                style={{ color: 'var(--text-muted)' }}
              >
                <HelpCircle className="w-3.5 h-3.5" />
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
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-3">
            {stats.map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-1 p-4 rounded-xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                <span className="text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}>{s.value}</span>
                <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Feature cards */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 md:mt-24 mb-12 md:mb-16 animate-fade-in" style={{ animationDelay: '200ms' }}>
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="group p-6 md:p-8 rounded-2xl text-left flex flex-col gap-5 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-lg hover:border-[var(--brand-primary)]/20"
                style={{
                  background: 'var(--bg-surface)',
                  borderColor: 'var(--border-subtle)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  boxShadow: 'var(--shadow-card)'
                }}
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110" style={{ background: 'var(--gradient-brand-soft)', border: '1px solid var(--border-subtle)' }}>
                  <Icon className="w-6 h-6" style={{ color: 'var(--brand-primary)' }} />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-bold text-sm tracking-tight" style={{ color: 'var(--text-primary)' }}>{f.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 px-8" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
          <p>&copy; {new Date().getFullYear()} InstaAnalyzer · Only analyzes public profiles</p>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5" style={{ color: 'var(--color-success)' }} />No account needed</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5" style={{ color: 'var(--color-success)' }} />100% free</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5" style={{ color: 'var(--color-success)' }} />No data stored</span>
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
