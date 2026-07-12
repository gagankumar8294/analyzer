'use client';

import React from 'react';
import { 
  TrendingUp, 
  Hash, 
  Play, 
  Music, 
  Sparkles,
  Bookmark
} from 'lucide-react';
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
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Page Title */}
      <div className="card-static rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand/5 to-purple/5 pointer-events-none" />
        <div className="relative">
          <h2 className="text-base font-extrabold text-primary">Viral Trend Intelligence</h2>
          <p className="text-[11px] text-muted mt-0.5">
            Algorithmic patterns, viral hooks, and hashtag recommendations mapped for the <span className="text-brand font-bold uppercase">&ldquo;{category}&rdquo;</span> vertical.
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/18 text-[10px] font-bold text-purple-400 flex items-center gap-1 relative">
          <Sparkles className="w-3 h-3" />
          AI-Powered
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Hooks & Tags */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          
          {/* Viral Hooks Card */}
          <div className="card flex flex-col">
            <div className="card-header">
              <Play className="w-4 h-4 text-brand" />
              <h3 className="text-sm font-bold text-primary">High-Converting Hook Templates</h3>
            </div>

            <div className="flex flex-col gap-2.5">
              {viralHooks.map((hItem, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-elevated/30 border border-subtle flex flex-col gap-1.5 relative group hover:border-brand/15 transition-all">
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] font-extrabold text-brand uppercase tracking-wider">Hook {idx + 1}</span>
                    <span className="text-[10px] text-muted font-medium">{hItem.use}</span>
                  </div>
                  <p className="text-xs font-bold text-primary leading-relaxed">&ldquo;{hItem.hook}&rdquo;</p>
                  
                  <button 
                    onClick={() => navigator.clipboard.writeText(hItem.hook)}
                    className="absolute right-2.5 bottom-2.5 p-1 bg-elevated border border-subtle text-muted hover:text-primary rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copy Hook"
                  >
                    <Bookmark className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Tags Card */}
          <div className="card flex flex-col">
            <div className="card-header">
              <Hash className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-primary">Recommended Tags</h3>
            </div>

            <div className="flex flex-wrap gap-2 py-0.5">
              {trendingTags.map((tag, idx) => (
                <span 
                  key={idx} 
                  className="px-3 py-1.5 rounded-xl bg-elevated/40 border border-subtle text-[10px] font-semibold text-primary flex items-center gap-1.5 hover:border-brand/25 transition-all cursor-default"
                >
                  <span className="text-brand">#</span>
                  {tag.replace('#', '')}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Format & Audio Trends */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          
          {/* Format Trends Card */}
          <div className="card flex flex-col">
            <div className="card-header">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <h3 className="text-sm font-bold text-primary">Niche Content Trends</h3>
            </div>

            <div className="flex flex-col gap-3">
              {nicheTrends.map((trend, idx) => (
                <div key={idx} className="flex gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-brand/10 text-brand border border-brand/15 flex items-center justify-center shrink-0 text-[9px] font-bold mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-xs text-primary leading-relaxed">{trend}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Audio Trends Card */}
          <div className="card flex flex-col">
            <div className="card-header">
              <Music className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-primary">Trending Audio Styles</h3>
            </div>

            <div className="flex flex-col gap-2">
              <div className="p-3 bg-elevated/30 border border-subtle rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-primary">Upbeat Minimal Synth</p>
                  <p className="text-[9px] text-muted">Fast-paced tutorial reels</p>
                </div>
                <span className="text-[9px] font-bold text-brand uppercase tracking-wider">High Reach</span>
              </div>

              <div className="p-3 bg-elevated/30 border border-subtle rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-primary">Lo-Fi Creator Chill</p>
                  <p className="text-[9px] text-muted">Aesthetic vlogs and BTS</p>
                </div>
                <span className="text-[9px] font-bold text-purple-400 uppercase tracking-wider">Aesthetic</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
