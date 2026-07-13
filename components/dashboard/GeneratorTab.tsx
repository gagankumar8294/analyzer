'use client';

import React, { useState } from 'react';
import { Sparkles, FileText, Copy, Check, RefreshCw, Send, MessageSquare } from 'lucide-react';

interface GeneratedPost {
  contentType: 'REEL' | 'CAROUSEL' | 'IMAGE' | 'STORY';
  theme: string;
  idea: string;
  hook: string;
  caption: string;
  script: string;
  cta: string;
  hashtags: string[];
}

export default function GeneratorTab() {
  const [contentType, setContentType] = useState<'REEL' | 'CAROUSEL' | 'IMAGE' | 'STORY'>('REEL');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Inspirational & Professional');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedPost | null>(null);
  const [copyStatus, setCopyStatus] = useState<Record<string, boolean>>({});

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;

    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentType, topic, tone }),
      });
      if (!res.ok) throw new Error('Failed to generate post outline');
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (field: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(prev => ({ ...prev, [field]: true }));
    setTimeout(() => setCopyStatus(prev => ({ ...prev, [field]: false })), 1500);
  };

  const handleCopyAll = () => {
    if (!result) return;
    const fullText = `Theme: ${result.theme}\nFormat: ${result.contentType}\nHook Overlay: ${result.hook}\nCaption:\n${result.caption}\n\nCTA: ${result.cta}\nHashtags: ${result.hashtags.join(' ')}${result.script ? `\nScript:\n${result.script}` : ''}`.trim();
    handleCopy('all', fullText);
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      
      <div className="card-static rounded-2xl relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(90deg, rgba(99,102,241,0.04) 0%, rgba(139,92,246,0.03) 100%)' }} />
        <div className="relative">
          <h2 className="text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}>AI Content Writer Playground</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Draft bespoke, high-converting posts customized to your exact niche and audience in seconds.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <form onSubmit={handleGenerate} className="card lg:col-span-5 flex flex-col gap-5 self-start">
          <div className="card-header">
            <Sparkles className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />
            <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Post Settings</h3>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>Format</label>
            <div className="grid grid-cols-4 gap-1.5 p-1.5 rounded-xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
              {(['REEL', 'CAROUSEL', 'IMAGE', 'STORY'] as const).map(fmt => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setContentType(fmt)}
                  className="py-2.5 px-1 rounded-lg text-xs font-bold transition-all"
                  style={{
                    background: contentType === fmt ? 'var(--brand-primary)' : 'transparent',
                    color: contentType === fmt ? '#fff' : 'var(--text-muted)',
                  }}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>Topic / Focus keywords</label>
            <textarea
              className="textarea"
              rows={4}
              placeholder="e.g. 3 time-saving design triggers to automate Figma layout setups"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>Tone of Voice</label>
            <select className="input w-full" value={tone} onChange={e => setTone(e.target.value)}>
              <option value="Inspirational & Professional">Inspirational & Professional</option>
              <option value="Direct & Analytical">Direct & Analytical</option>
              <option value="Casual & Humorous">Casual & Humorous</option>
              <option value="Urgent & Educational">Urgent & Educational</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading || !topic}
            className="btn btn-primary w-full flex items-center justify-center gap-2.5 mt-1"
          >
            {loading ? (
              <><RefreshCw className="w-4 h-4 animate-spin" />Drafting...</>
            ) : (
              <><Send className="w-4 h-4" />Generate Strategy Outline</>
            )}
          </button>
        </form>

        <div className="lg:col-span-7 flex flex-col gap-5">
          {result ? (
            <div className="card flex flex-col gap-5 relative animate-fade-in">
              <div className="card-header">
                <FileText className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />
                <span className="text-sm font-bold flex-1" style={{ color: 'var(--text-primary)' }}>{result.theme}</span>
                <button onClick={handleCopyAll}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all" style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>
                  {copyStatus['all'] ? (
                    <><Check className="w-3.5 h-3.5" style={{ color: '#4ade80' }} />Copied!</>
                  ) : (
                    <><Copy className="w-3.5 h-3.5" style={{ color: 'var(--brand-primary)' }} />Copy All</>
                  )}
                </button>
              </div>

              <div className="flex flex-col gap-2 p-4 rounded-xl relative group" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--brand-primary)', fontSize: '0.65rem' }}>Hook text overlay</span>
                  <button onClick={() => handleCopy('hook', result.hook)}
                    className="p-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100" style={{ color: 'var(--text-muted)' }}>
                    {copyStatus['hook'] ? <Check className="w-3.5 h-3.5" style={{ color: '#4ade80' }} /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-sm font-bold italic leading-relaxed" style={{ color: 'var(--text-primary)' }}>&ldquo;{result.hook}&rdquo;</p>
              </div>

              <div className="flex flex-col gap-2 p-4 rounded-xl relative group" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>Caption Copy</span>
                  <button onClick={() => handleCopy('caption', result.caption)}
                    className="p-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100" style={{ color: 'var(--text-muted)' }}>
                    {copyStatus['caption'] ? <Check className="w-3.5 h-3.5" style={{ color: '#4ade80' }} /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-primary)' }}>{result.caption}</p>
              </div>

              {result.contentType === 'REEL' && result.script && (
                <div className="flex flex-col gap-2 p-4 rounded-xl relative group" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--brand-secondary)', fontSize: '0.65rem' }}>Reels Script & Cues</span>
                    <button onClick={() => handleCopy('script', result.script)}
                      className="p-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100" style={{ color: 'var(--text-muted)' }}>
                      {copyStatus['script'] ? <Check className="w-3.5 h-3.5" style={{ color: '#4ade80' }} /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-primary)' }}>{result.script}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-2 p-4 rounded-xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>Call to Action</span>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{result.cta}</p>
                </div>
                <div className="flex flex-col gap-2 p-4 rounded-xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>Tags</span>
                  <div className="flex flex-wrap gap-1.5 mt-0.5">
                    {result.hashtags.map((tag, tIdx) => (
                      <span key={tIdx} className="px-2 py-0.5 rounded-lg text-xs font-bold" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--brand-primary)' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-16 text-center flex flex-col items-center justify-center h-full min-h-[300px]" style={{ borderStyle: 'dashed', borderWidth: '2px' }}>
              <MessageSquare className="w-10 h-10 mb-4 animate-bounce" style={{ color: 'var(--text-muted)' }} />
              <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>No Outline Drafted Yet</p>
              <p className="text-xs max-w-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>
                Enter your keywords on the left and select a format to kick off your strategy session.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
