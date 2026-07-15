'use client';

import React, { useState } from 'react';
import { Copy, Check, Sparkles, Lightbulb, Type, Hash, Info } from 'lucide-react';
import type { AnalysisResult } from '@/lib/types/analysis';
import { useAnalysisStore } from '@/store/analysisStore';

interface Props { data: AnalysisResult; }

export default function CompIntelContentTab({ data }: Props) {
  const { compIntelData } = useAnalysisStore();
  const competitors: any[] = compIntelData ?? data.competitors ?? [];
  const [activeCompIndex, setActiveCompIndex] = useState(0);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  if (!competitors.length) {
    return (
      <div className="flex flex-col items-center justify-center py-28 gap-5 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
          <Sparkles className="w-8 h-8" style={{ color: 'var(--text-muted)' }} />
        </div>
        <div>
          <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>No content suggestions yet</p>
          <p className="text-sm mt-1.5 max-w-sm" style={{ color: 'var(--text-muted)' }}>Generate analysis to unlock competitor content blueprints.</p>
        </div>
      </div>
    );
  }

  const activeComp = competitors[activeCompIndex] || competitors[0];
  const handle = activeComp.username ?? activeComp.handle ?? `Competitor ${activeCompIndex + 1}`;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(key);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Disclaimer / Info */}
      <div className="p-3.5 rounded-xl flex items-start gap-3" style={{ background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.1)' }}>
        <Info className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--brand-primary)' }} />
        <div className="flex-1">
          <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Original Niche Inspo (No Copyright Issues)</p>
          <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            These hooks, templates, and hashtag patterns are 100% original copy, modeled mathematically on competitor structures. You can safely adopt these concepts to match their growth triggers.
          </p>
        </div>
      </div>

      {/* Competitor Toggle Bar */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {competitors.map((comp: any, idx: number) => {
          const compHandle = comp.username ?? comp.handle ?? `Comp ${idx + 1}`;
          const isSelected = activeCompIndex === idx;
          return (
            <button
              key={idx}
              onClick={() => setActiveCompIndex(idx)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2"
              style={isSelected ? {
                background: 'linear-gradient(90deg, #f97316, #fb923c)',
                color: 'white',
                boxShadow: '0 4px 12px rgba(249,115,22,0.2)'
              } : {
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)'
              }}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: isSelected ? 'white' : '#fb923c' }} />
              @{compHandle}
            </button>
          );
        })}
      </div>

      {/* Main Intel Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Viral Hooks */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="card flex flex-col gap-4">
            <div className="card-header flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4.5 h-4.5" style={{ color: '#fb923c' }} />
                <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Hook Blueprints</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>Scroll Stoppers</span>
            </div>

            <div className="flex flex-col gap-3">
              {activeComp.sampleHooks?.map((hook: string, idx: number) => {
                const key = `hook-${idx}`;
                return (
                  <div key={idx} className="p-3.5 rounded-xl flex items-start justify-between gap-3 relative group" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                    <div className="flex-1">
                      <span className="text-[9px] uppercase font-bold tracking-wider" style={{ color: '#fb923c' }}>Hook #{idx + 1}</span>
                      <p className="text-xs font-semibold mt-1 leading-relaxed" style={{ color: 'var(--text-primary)' }}>"{hook}"</p>
                    </div>
                    <button
                      onClick={() => handleCopy(hook, key)}
                      className="p-1.5 rounded-lg transition-all opacity-40 group-hover:opacity-100"
                      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}
                    >
                      {copiedText === key ? <Check className="w-3.5 h-3.5" style={{ color: '#4ade80' }} /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                );
              }) || <p className="text-xs italic" style={{ color: 'var(--text-muted)' }}>No hooks generated.</p>}
            </div>
          </div>

          {/* Caption Templates */}
          <div className="card flex flex-col gap-4">
            <div className="card-header flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Type className="w-4.5 h-4.5" style={{ color: '#fb923c' }} />
                <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Caption Templates</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>Engagement Fill-ins</span>
            </div>

            <div className="flex flex-col gap-4">
              {activeComp.sampleCaptions?.map((caption: string, idx: number) => {
                const key = `caption-${idx}`;
                return (
                  <div key={idx} className="p-4 rounded-xl flex flex-col gap-3 relative group" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] uppercase font-bold tracking-wider" style={{ color: '#fb923c' }}>Template #{idx + 1}</span>
                      <button
                        onClick={() => handleCopy(caption, key)}
                        className="p-1.5 rounded-lg transition-all opacity-40 group-hover:opacity-100 flex items-center gap-1.5 text-[10px]"
                        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}
                      >
                        {copiedText === key ? (
                          <>
                            <Check className="w-3 h-3" style={{ color: '#4ade80' }} />
                            <span style={{ color: '#4ade80' }}>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Caption</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="text-xs leading-relaxed whitespace-pre-wrap font-sans mt-1" style={{ color: 'var(--text-secondary)' }}>
                      {caption}
                    </pre>
                  </div>
                );
              }) || <p className="text-xs italic" style={{ color: 'var(--text-muted)' }}>No caption templates generated.</p>}
            </div>
          </div>
        </div>

        {/* Right Column: Hashtag adopts & themes */}
        <div className="flex flex-col gap-6">
          <div className="card flex flex-col gap-4">
            <div className="card-header">
              <Hash className="w-4.5 h-4.5" style={{ color: '#fb923c' }} />
              <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Target Hashtags</h3>
            </div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              These high-performance hashtags are frequently used by @{handle}. Incorporate them to ride the same algorithmic associations.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {activeComp.targetHashtags?.map((tag: string, idx: number) => {
                const cleanTag = tag.startsWith('#') ? tag : `#${tag}`;
                const key = `tag-${idx}`;
                return (
                  <button
                    key={idx}
                    onClick={() => handleCopy(cleanTag, key)}
                    className="text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5"
                    style={{
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                      color: copiedText === key ? '#4ade80' : 'var(--text-primary)'
                    }}
                  >
                    <span>{cleanTag}</span>
                    {copiedText === key ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3 opacity-30 hover:opacity-100" />}
                  </button>
                );
              }) || <span className="text-xs italic" style={{ color: 'var(--text-muted)' }}>No tags listed.</span>}
            </div>
          </div>

          <div className="card flex flex-col gap-4">
            <div className="card-header">
              <Sparkles className="w-4.5 h-4.5" style={{ color: '#fb923c' }} />
              <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Best Days to Post</h3>
            </div>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              @{handle} shows spike activities or schedules on these weekdays. Try matching these days to capture audience overlaps.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {activeComp.postingDays?.map((day: string, idx: number) => (
                <span key={idx} className="text-xs font-semibold px-3 py-1.5 rounded-xl" style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.15)', color: '#fb923c' }}>
                  {day}
                </span>
              )) || <span className="text-xs italic" style={{ color: 'var(--text-muted)' }}>No days analyzed.</span>}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
