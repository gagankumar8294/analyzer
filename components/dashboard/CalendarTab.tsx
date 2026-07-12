'use client';

import React, { useState } from 'react';
import { 
  Clock,
  Play,
  Layers,
  Image as ImageIcon,
  Download,
  Edit3,
  Check,
  Sparkles
} from 'lucide-react';
import type { AnalysisResult } from '@/lib/types/analysis';
import { useAnalysisStore } from '@/store/analysisStore';

interface CalendarTabProps {
  data: AnalysisResult;
}

export default function CalendarTab({ data }: CalendarTabProps) {
  const { calendar } = data;
  const updateCalendarItem = useAnalysisStore((state) => state.updateCalendarItem);

  const [filterType, setFilterType] = useState<'ALL' | 'REEL' | 'CAROUSEL' | 'POST' | 'STORY'>('ALL');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    theme: '',
    idea: '',
    hook: '',
    caption: '',
    script: '',
    cta: '',
    hashtagsStr: ''
  });

  const [suggestingIndex, setSuggestingIndex] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestingType, setSuggestingType] = useState<'hook' | 'caption'>('hook');

  const filteredCalendar = calendar.filter(item => {
    if (filterType === 'ALL') return true;
    return item.contentType === filterType;
  });

  const getFormatIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'REEL':   return Play;
      case 'CAROUSEL': return Layers;
      default:       return ImageIcon;
    }
  };

  const getFormatColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'REEL':     return 'from-pink-500/15 to-rose-500/10 text-pink-400 border-pink-500/20';
      case 'CAROUSEL': return 'from-purple-500/15 to-violet-500/10 text-purple-400 border-purple-500/20';
      case 'STORY':    return 'from-blue-500/15 to-cyan-500/10 text-blue-400 border-blue-500/20';
      default:         return 'from-orange-500/15 to-amber-500/10 text-orange-400 border-orange-500/20';
    }
  };

  const handleStartEdit = (index: number, item: any) => {
    setEditingIndex(index);
    setEditForm({
      theme: item.theme,
      idea: item.idea,
      hook: item.hook,
      caption: item.caption,
      script: item.script || '',
      cta: item.cta || '',
      hashtagsStr: item.hashtags.join(', ')
    });
  };

  const handleSaveEdit = (index: number) => {
    const updated = {
      theme: editForm.theme,
      idea: editForm.idea,
      hook: editForm.hook,
      caption: editForm.caption,
      script: editForm.script,
      cta: editForm.cta,
      hashtags: editForm.hashtagsStr.split(',').map(s => s.trim().startsWith('#') ? s.trim() : `#${s.trim()}`).filter(s => s.length > 1)
    };
    updateCalendarItem(index, updated);
    setEditingIndex(null);
  };

  const handleAISuggest = (index: number, type: 'hook' | 'caption', _currentText: string) => {
    setSuggestingIndex(index);
    setSuggestingType(type);
    
    setTimeout(() => {
      if (type === 'hook') {
        setSuggestions([
          `I bet you didn't know this simple trick for ${editForm.theme || 'this'}...`,
          `Stop scrolling if you want to fix your ${editForm.theme || 'workflow'} today!`,
          `This is the exact strategy that saved me 15 hours last week.`
        ]);
      } else {
        setSuggestions([
          `Here's exactly how to get started:\n\n1. Save this post\n2. Apply these steps\n3. Let me know your results below!`,
          `Struggling with consistency? You aren't alone. Try this exact 3-step checklist to save time and look like a pro.`,
          `This change changed everything for our brand. Read the full guide below and tell me: which step are you doing first?`
        ]);
      }
    }, 800);
  };

  const applySuggestion = (suggestion: string) => {
    if (suggestingType === 'hook') {
      setEditForm(prev => ({ ...prev, hook: suggestion }));
    } else {
      setEditForm(prev => ({ ...prev, caption: suggestion }));
    }
    setSuggestions([]);
    setSuggestingIndex(null);
  };

  const handleExportCSV = () => {
    const headers = ['Date', 'Format', 'Theme', 'Idea', 'Hook', 'Caption', 'CTA', 'Hashtags', 'Script'];
    const rows = calendar.map(item => [
      new Date(item.date).toLocaleDateString(),
      item.contentType,
      item.theme,
      item.idea,
      item.hook,
      item.caption,
      item.cta,
      item.hashtags.join(' '),
      item.script || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => 
        row.map(val => `"${val.replace(/"/g, '""')}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `insta_content_calendar_${data.profile.username}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Header bar */}
      <div className="card-static rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand/5 to-purple/5 pointer-events-none" />
        <div className="relative">
          <h2 className="text-base font-extrabold text-primary">90-Day Content Planner</h2>
          <p className="text-[11px] text-muted max-w-xl mt-0.5">
            Browse, customize, and refine AI-formulated ideas for your posting schedule.
          </p>
        </div>
        
        <button
          onClick={handleExportCSV}
          className="btn-primary inline-flex items-center gap-2 relative"
        >
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </button>
      </div>

      {/* Filter pills */}
      <div className="flex p-1 bg-elevated border border-subtle rounded-xl w-fit self-center sm:self-start">
        {(['ALL', 'REEL', 'CAROUSEL', 'POST', 'STORY'] as const).map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
              filterType === type 
                ? 'bg-brand text-white shadow-sm' 
                : 'text-muted hover:text-primary'
            }`}
          >
            {type === 'ALL' ? 'All' : type === 'REEL' ? 'Reels' : type === 'CAROUSEL' ? 'Carousels' : type === 'STORY' ? 'Stories' : 'Posts'}
          </button>
        ))}
      </div>

      {/* Calendar post items */}
      <div className="flex flex-col gap-3">
        {filteredCalendar.map((item, idx) => {
          const FormatIcon = getFormatIcon(item.contentType);
          const formatColor = getFormatColor(item.contentType);
          const isExpanded = expandedIndex === idx;
          const isEditing = editingIndex === idx;
          const itemDate = new Date(item.date);
          const displayDate = itemDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

          return (
            <div 
              key={idx} 
              className={`card-static border rounded-xl transition-all duration-200 ${
                isExpanded 
                  ? 'border-brand/25 shadow-[0_0_20px_rgba(225,48,108,0.06)]' 
                  : 'border-subtle hover:border-default'
              }`}
            >
              {/* Header Summary Row */}
              <div 
                onClick={() => !isEditing && setExpandedIndex(isExpanded ? null : idx)}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer p-4"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${formatColor} border flex items-center justify-center shrink-0`}>
                    <FormatIcon className="w-4 h-4" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-primary">{item.theme}</span>
                      <span className="px-1.5 py-0.5 rounded bg-elevated border border-subtle text-[8px] font-bold text-muted uppercase tracking-wider">
                        {item.contentType}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted mt-0.5 line-clamp-1">{item.idea}</p>
                  </div>
                </div>

                <span className="text-[10px] text-muted font-bold flex items-center gap-1 self-end sm:self-center">
                  <Clock className="w-3 h-3 text-brand" />
                  {displayDate}
                </span>
              </div>

              {/* Expandable Details */}
              {isExpanded && (
                <div className="border-t border-subtle p-4 flex flex-col gap-4 animate-fade-in">
                  
                  {isEditing ? (
                    <div className="flex flex-col gap-3.5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold text-muted uppercase tracking-wider">Pillar Theme</label>
                          <input type="text" className="input" value={editForm.theme} onChange={e => setEditForm({ ...editForm, theme: e.target.value })} />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold text-muted uppercase tracking-wider">Idea Outline</label>
                          <input type="text" className="input" value={editForm.idea} onChange={e => setEditForm({ ...editForm, idea: e.target.value })} />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 relative">
                        <div className="flex justify-between items-center">
                          <label className="text-[9px] font-bold text-muted uppercase tracking-wider">Hook Text Overlay</label>
                          <button type="button" onClick={() => handleAISuggest(idx, 'hook', editForm.hook)}
                            className="text-[9px] font-bold text-brand hover:underline flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" /> Improve Hook (AI)
                          </button>
                        </div>
                        <textarea rows={2} className="textarea" value={editForm.hook} onChange={e => setEditForm({ ...editForm, hook: e.target.value })} />
                      </div>

                      <div className="flex flex-col gap-1 relative">
                        <div className="flex justify-between items-center">
                          <label className="text-[9px] font-bold text-muted uppercase tracking-wider">Caption Text</label>
                          <button type="button" onClick={() => handleAISuggest(idx, 'caption', editForm.caption)}
                            className="text-[9px] font-bold text-brand hover:underline flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" /> Rewrite Caption (AI)
                          </button>
                        </div>
                        <textarea rows={4} className="textarea" value={editForm.caption} onChange={e => setEditForm({ ...editForm, caption: e.target.value })} />
                      </div>

                      {item.contentType === 'REEL' && (
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold text-muted uppercase tracking-wider">Voiceover Script / Storyboard</label>
                          <textarea rows={3} className="textarea" value={editForm.script} onChange={e => setEditForm({ ...editForm, script: e.target.value })} />
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold text-muted uppercase tracking-wider">Call To Action</label>
                          <input type="text" className="input" value={editForm.cta} onChange={e => setEditForm({ ...editForm, cta: e.target.value })} />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold text-muted uppercase tracking-wider">Hashtags (comma separated)</label>
                          <input type="text" className="input" value={editForm.hashtagsStr} onChange={e => setEditForm({ ...editForm, hashtagsStr: e.target.value })} />
                        </div>
                      </div>

                      {suggestingIndex === idx && suggestions.length > 0 && (
                        <div className="p-3 rounded-xl bg-purple-500/[0.04] border border-purple-500/15 flex flex-col gap-2.5">
                          <span className="text-[9px] font-bold text-purple-400 uppercase tracking-widest flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> AI Suggestions
                          </span>
                          <div className="flex flex-col gap-1.5">
                            {suggestions.map((sug, sIdx) => (
                              <button key={sIdx} type="button" onClick={() => applySuggestion(sug)}
                                className="p-2.5 rounded-lg border border-subtle bg-elevated/40 text-left text-[11px] text-primary hover:border-brand/30 transition-colors">
                                {sug}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end gap-2 border-t border-subtle pt-3">
                        <button onClick={() => setEditingIndex(null)} className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-muted hover:text-primary transition-colors">
                          Cancel
                        </button>
                        <button onClick={() => handleSaveEdit(idx)} className="btn-primary btn-sm inline-flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" /> Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3.5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5 bg-elevated/30 p-3 rounded-xl border border-subtle">
                          <span className="text-[9px] font-bold text-brand uppercase tracking-wider">Hook text overlay</span>
                          <p className="text-xs font-bold text-primary leading-relaxed">&ldquo;{item.hook}&rdquo;</p>
                        </div>
                        <div className="flex flex-col gap-1.5 bg-elevated/30 p-3 rounded-xl border border-subtle">
                          <span className="text-[9px] font-bold text-purple-400 uppercase tracking-wider">Call to Action</span>
                          <p className="text-xs font-bold text-primary leading-relaxed">{item.cta}</p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <span className="text-[9px] font-bold text-muted uppercase tracking-wider">Caption Text</span>
                        <p className="text-xs text-primary leading-relaxed bg-elevated/30 p-3 rounded-xl border border-subtle whitespace-pre-line">
                          {item.caption}
                        </p>
                      </div>

                      {item.contentType === 'REEL' && item.script && (
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[9px] font-bold text-muted uppercase tracking-wider">Video Script / Storyboard</span>
                          <div className="text-xs text-primary leading-relaxed bg-elevated/30 p-3 rounded-xl border border-subtle whitespace-pre-line">
                            {item.script}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.hashtags.map((tag: string, tIdx: number) => (
                          <span key={tIdx} className="px-2 py-0.5 rounded bg-elevated border border-subtle text-[9px] font-semibold text-brand">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex justify-end border-t border-subtle pt-2.5">
                        <button onClick={() => handleStartEdit(idx, item)}
                          className="px-3 py-1.5 rounded-lg border border-subtle bg-elevated/20 text-[11px] font-bold text-primary hover:border-brand/30 transition-colors inline-flex items-center gap-1.5">
                          <Edit3 className="w-3.5 h-3.5 text-brand" /> Edit Post
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
