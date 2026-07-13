'use client';

import React from 'react';
import { TrendingUp, Hash, Play, Music, Sparkles, Bookmark } from 'lucide-react';
import type { AnalysisResult } from '@/lib/types/analysis';

interface TrendsTabProps {
  data: AnalysisResult;
}

export default function TrendsTab({ data }: TrendsTabProps) {
  const { profile } = data;
  const category = profile.category || 'Creator';

  const getCategoryTrends = (cat: string) => {
    const defaultTrends = {
      nicheTrends: [
        'Faceless aesthetics using high-contrast, moody video loops with clean sans-serif typography overlay.',
        'Mini audio vlogs detailing creator daily life or client BTS work snippets.',
        'High value carousel decks explaining 3 specific steps or action triggers for target clients.'
      ],
      viralHooks: [
        { hook: 'The biggest mistake people make when starting with [topic]...', use: 'Authority posts' },
        { hook: 'I spent 100 hours learning [skill], so you don\'t have to. Here are the 3 key secrets.', use: 'Value carousels' },
        { hook: 'Stop doing [action] if you want to achieve [goal] this year.', use: 'High-converting reels' }
      ],
      trendingTags: ['#creatoreconomy', '#buildinpublic', '#growyourbrand', '#organicreach', '#socialmediatrends']
    };

    const designTrends = {
      nicheTrends: [
        'Dark mode UI micro-animations and screen recordings of Figma workflow shortcuts.',
        'Minimalist, cream/charcoal room setups showing home workspaces or clean desk designs.',
        'Portfolio deep dives detailing the raw grid guidelines and typography pairings used in active client work.'
      ],
      viralHooks: [
        { hook: 'Stop using these 3 basic design fonts... use these alternatives instead.', use: 'Saves & Shares' },
        { hook: 'How I design client landing pages in under 3 hours (step-by-step layout secrets).', use: 'High value reel' },
        { hook: 'The Figma plugin that feels illegal to know in 2026.', use: 'Viral video topic' }
      ],
      trendingTags: ['#designinspiration', '#figmatips', '#uidesign', '#minimalistdecor', '#graphicdesigner']
    };

    const lowCat = cat.toLowerCase();
    if (lowCat.includes('design') || lowCat.includes('decor') || lowCat.includes('art') || lowCat.includes('plant')) {
      return designTrends;
    }
    return defaultTrends;
  };

  const { nicheTrends, viralHooks, trendingTags } = getCategoryTrends(category);

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      
      <div className="card-static rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(90deg, rgba(99,102,241,0.04) 0%, rgba(139,92,246,0.03) 100%)' }} />
        <div className="relative">
          <h2 className="text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}>Viral Trend Intelligence</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Algorithmic patterns, viral hooks, and hashtag recommendations mapped for the <span className="font-bold uppercase" style={{ color: 'var(--brand-primary)' }}>&ldquo;{category}&rdquo;</span> vertical.
          </p>
        </div>
        <span className="px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 relative" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', color: 'var(--brand-secondary)' }}>
          <Sparkles className="w-3.5 h-3.5" />
          AI-Powered
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          <div className="card flex flex-col">
            <div className="card-header">
              <Play className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />
              <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>High-Converting Hook Templates</h3>
            </div>

            <div className="flex flex-col gap-3">
              {viralHooks.map((hItem, idx) => (
                <div key={idx} className="p-4 rounded-xl flex flex-col gap-2 relative group transition-all" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-extrabold uppercase tracking-wider" style={{ color: 'var(--brand-primary)', fontSize: '0.6rem' }}>Hook {idx + 1}</span>
                    <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{hItem.use}</span>
                  </div>
                  <p className="text-sm font-bold leading-relaxed" style={{ color: 'var(--text-primary)' }}>&ldquo;{hItem.hook}&rdquo;</p>
                  
                  <button 
                    onClick={() => navigator.clipboard.writeText(hItem.hook)}
                    className="absolute right-3 bottom-3 p-1.5 rounded-lg transition-opacity opacity-0 group-hover:opacity-100"
                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}
                    title="Copy Hook"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="card flex flex-col">
            <div className="card-header">
              <Hash className="w-4 h-4" style={{ color: 'var(--brand-secondary)' }} />
              <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Recommended Tags</h3>
            </div>

            <div className="flex flex-wrap gap-2.5 py-1">
              {trendingTags.map((tag, idx) => (
                <span 
                  key={idx} 
                  className="px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-default"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
                >
                  <span style={{ color: 'var(--brand-primary)' }}>#</span>
                  {tag.replace('#', '')}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6">
          
          <div className="card flex flex-col">
            <div className="card-header">
              <TrendingUp className="w-4 h-4" style={{ color: '#4ade80' }} />
              <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Niche Content Trends</h3>
            </div>

            <div className="flex flex-col gap-3.5">
              {nicheTrends.map((trend, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: 'var(--brand-primary)' }}>
                    {idx + 1}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{trend}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card flex flex-col">
            <div className="card-header">
              <Music className="w-4 h-4" style={{ color: 'var(--brand-secondary)' }} />
              <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Trending Audio Styles</h3>
            </div>

            <div className="flex flex-col gap-3">
              <div className="p-4 rounded-xl flex items-center justify-between" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Upbeat Minimal Synth</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Fast-paced tutorial reels</p>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>High Reach</span>
              </div>

              <div className="p-4 rounded-xl flex items-center justify-between" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Lo-Fi Creator Chill</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Aesthetic vlogs and BTS</p>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--brand-secondary)' }}>Aesthetic</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
