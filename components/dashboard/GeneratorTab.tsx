'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  FileText,
  Copy, 
  Check, 
  RefreshCw,
  Send,
  MessageSquare
} from 'lucide-react';

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
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Page Title */}
      <div className="card-static rounded-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand/5 to-purple/5 pointer-events-none" />
        <div className="relative">
          <h2 className="text-base font-extrabold text-primary">AI Content Writer Playground</h2>
          <p className="text-[11px] text-muted mt-0.5">
            Draft bespoke, high-converting posts customized to your exact niche and audience in seconds.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Setup Form */}
        <form onSubmit={handleGenerate} className="card lg:col-span-5 flex flex-col gap-4 self-start">
          <div className="card-header">
            <Sparkles className="w-4 h-4 text-brand" />
            <h3 className="text-sm font-bold text-primary">Post Settings</h3>
          </div>

          {/* Format selector */}
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-bold text-muted uppercase tracking-wider">Format</label>
            <div className="grid grid-cols-4 gap-1.5 bg-elevated border border-subtle p-1 rounded-xl">
              {(['REEL', 'CAROUSEL', 'IMAGE', 'STORY'] as const).map(fmt => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setContentType(fmt)}
                  className={`py-2 px-1 rounded-lg text-[10px] font-bold transition-all ${
                    contentType === fmt 
                      ? 'bg-brand text-white shadow-sm' 
                      : 'text-muted hover:text-primary'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          {/* Topic description */}
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-bold text-muted uppercase tracking-wider">Topic / Focus keywords</label>
            <textarea
              className="textarea"
              rows={4}
              placeholder="e.g. 3 time-saving design triggers to automate Figma layout setups"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              required
            />
          </div>

          {/* Tone Selector */}
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-bold text-muted uppercase tracking-wider">Tone of Voice</label>
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
            className="btn-primary w-full flex items-center justify-center gap-2 mt-1"
          >
            {loading ? (
              <><RefreshCw className="w-4 h-4 animate-spin" />Drafting...</>
            ) : (
              <><Send className="w-4 h-4" />Generate Strategy Outline</>
            )}
          </button>
        </form>

        {/* Right Side: Results */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {result ? (
            <div className="card flex flex-col gap-4 relative animate-fade-in">
              <div className="card-header">
                <FileText className="w-4 h-4 text-brand" />
                <span className="text-sm font-bold text-primary flex-1">{result.theme}</span>
                <button onClick={handleCopyAll}
                  className="px-2.5 py-1 rounded-lg border border-subtle bg-elevated/40 hover:border-brand/20 transition-all text-[10px] font-bold text-primary flex items-center gap-1">
                  {copyStatus['all'] ? (
                    <><Check className="w-3 h-3 text-green-400" />Copied!</>
                  ) : (
                    <><Copy className="w-3 h-3 text-brand" />Copy All</>
                  )}
                </button>
              </div>

              {/* Hook Box */}
              <div className="flex flex-col gap-1.5 bg-elevated/30 border border-subtle p-3.5 rounded-xl relative group">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold text-brand uppercase tracking-wider">Hook text overlay</span>
                  <button onClick={() => handleCopy('hook', result.hook)}
                    className="p-1 hover:bg-elevated rounded text-muted hover:text-primary transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                    {copyStatus['hook'] ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <p className="text-xs font-bold text-primary italic">&ldquo;{result.hook}&rdquo;</p>
              </div>

              {/* Caption Box */}
              <div className="flex flex-col gap-1.5 bg-elevated/30 border border-subtle p-3.5 rounded-xl relative group">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold text-muted uppercase tracking-wider">Caption Copy</span>
                  <button onClick={() => handleCopy('caption', result.caption)}
                    className="p-1 hover:bg-elevated rounded text-muted hover:text-primary transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                    {copyStatus['caption'] ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <p className="text-xs text-primary leading-relaxed whitespace-pre-line">{result.caption}</p>
              </div>

              {/* Script Box */}
              {result.contentType === 'REEL' && result.script && (
                <div className="flex flex-col gap-1.5 bg-elevated/30 border border-subtle p-3.5 rounded-xl relative group">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-purple-400 uppercase tracking-wider">Reels Script & Cues</span>
                    <button onClick={() => handleCopy('script', result.script)}
                      className="p-1 hover:bg-elevated rounded text-muted hover:text-primary transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                      {copyStatus['script'] ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <p className="text-xs text-primary leading-relaxed whitespace-pre-line">{result.script}</p>
                </div>
              )}

              {/* CTA & Tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5 bg-elevated/30 border border-subtle p-3.5 rounded-xl">
                  <span className="text-[9px] font-bold text-muted uppercase tracking-wider">Call to Action</span>
                  <p className="text-xs font-semibold text-primary">{result.cta}</p>
                </div>
                <div className="flex flex-col gap-1.5 bg-elevated/30 border border-subtle p-3.5 rounded-xl">
                  <span className="text-[9px] font-bold text-muted uppercase tracking-wider">Tags</span>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {result.hashtags.map((tag, tIdx) => (
                      <span key={tIdx} className="px-1.5 py-0.5 rounded bg-elevated border border-subtle text-[9px] font-bold text-brand">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-14 text-center flex flex-col items-center justify-center border-dashed border-2 border-subtle h-full min-h-[280px]">
              <MessageSquare className="w-10 h-10 text-muted mb-3 animate-bounce" />
              <p className="text-xs font-bold text-primary">No Outline Drafted Yet</p>
              <p className="text-[10px] text-muted max-w-xs mt-1">
                Enter your keywords on the left and select a format to kick off your strategy session.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
