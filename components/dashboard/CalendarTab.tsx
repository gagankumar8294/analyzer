'use client';

import React, { useState } from 'react';
import { Clock, Play, Layers, Image as ImageIcon, Download, Edit3, Check, Sparkles, ChevronDown, ArrowRight, FileText } from 'lucide-react';
import type { AnalysisResult } from '@/lib/types/analysis';
import { useAnalysisStore } from '@/store/analysisStore';

interface CalendarTabProps {
  data: AnalysisResult;
}

export default function CalendarTab({ data }: CalendarTabProps) {
  const calendarData = useAnalysisStore((state) => state.calendarData);
  const calendar = calendarData ?? [];
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
      case 'REEL':     return { bg: 'rgba(99,102,241,0.1)', color: 'var(--brand-primary)', border: 'rgba(99,102,241,0.2)' };
      case 'CAROUSEL': return { bg: 'rgba(139,92,246,0.1)', color: 'var(--brand-secondary)', border: 'rgba(139,92,246,0.2)' };
      case 'STORY':    return { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: 'rgba(59,130,246,0.2)' };
      default:         return { bg: 'rgba(167,139,250,0.1)', color: '#a78bfa', border: 'rgba(167,139,250,0.2)' };
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
    <div className="flex flex-col gap-8 animate-fade-in">
      
      <div className="card-static rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-5 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(90deg, rgba(99,102,241,0.04) 0%, rgba(139,92,246,0.03) 100%)' }} />
        <div className="relative">
          <h2 className="text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}>90-Day Content Planner</h2>
          <p className="text-sm max-w-xl mt-1" style={{ color: 'var(--text-secondary)' }}>
            Browse, customize, and refine AI-formulated ideas for your posting schedule.
          </p>
        </div>
        
        <button
          onClick={handleExportCSV}
          className="btn btn-primary inline-flex items-center gap-2.5 relative"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div 
        className="flex p-1 rounded-2xl max-w-full overflow-x-auto shrink-0 select-none no-scrollbar self-center sm:self-start shadow-sm" 
        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
      >
        <div className="flex gap-1.5 p-0.5">
          {(['ALL', 'REEL', 'CAROUSEL', 'POST', 'STORY'] as const).map(type => {
            const isSelected = filterType === type;
            return (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className="px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 shrink-0 cursor-pointer flex items-center gap-1.5"
                style={{
                  background: isSelected ? 'var(--gradient-brand)' : 'transparent',
                  color: isSelected ? '#fff' : 'var(--text-secondary)',
                  boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                }}
              >
                {type === 'ALL' ? 'All Formats' : type === 'REEL' ? 'Reels' : type === 'CAROUSEL' ? 'Carousels' : type === 'STORY' ? 'Stories' : 'Posts'}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-4">
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
              className="rounded-2xl transition-all duration-300 shadow-sm"
              style={{
                background: 'var(--bg-surface)',
                border: isExpanded ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                boxShadow: isExpanded ? '0 8px 24px rgba(99,102,241,0.06)' : 'var(--shadow-sm)',
                transform: !isExpanded ? 'none' : 'scale-[1.002]',
              }}
            >
              <div 
                onClick={() => !isEditing && setExpandedIndex(isExpanded ? null : idx)}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer p-5 sm:p-6 select-none"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-all" style={{ background: formatColor.bg, border: `1px solid ${formatColor.border}` }}>
                    <FormatIcon className="w-5 h-5" style={{ color: formatColor.color }} />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm sm:text-base font-extrabold" style={{ color: 'var(--text-primary)' }}>{item.theme}</span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider" style={{ background: formatColor.bg, border: `1px solid ${formatColor.border}`, color: formatColor.color }}>
                        {item.contentType}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm mt-1 line-clamp-1" style={{ color: 'var(--text-secondary)' }}>{item.idea}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 self-stretch sm:self-center">
                  <span className="text-xs font-bold flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                    <Clock className="w-3.5 h-3.5" style={{ color: 'var(--brand-primary)' }} />
                    {displayDate}
                  </span>
                  {!isEditing && (
                    <ChevronDown 
                      className={`w-4 h-4 transition-transform duration-300 shrink-0 ${isExpanded ? 'rotate-180' : ''}`} 
                      style={{ color: isExpanded ? 'var(--brand-primary)' : 'var(--text-muted)' }}
                    />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="p-5 sm:p-6 flex flex-col gap-5 animate-fade-in" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  
                  {isEditing ? (
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>Pillar Theme</label>
                          <input type="text" className="input" value={editForm.theme} onChange={e => setEditForm({ ...editForm, theme: e.target.value })} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>Idea Outline</label>
                          <input type="text" className="input" value={editForm.idea} onChange={e => setEditForm({ ...editForm, idea: e.target.value })} />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5 relative">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>Hook Text Overlay</label>
                          <button type="button" onClick={() => handleAISuggest(idx, 'hook', editForm.hook)}
                            className="text-xs font-bold hover:underline flex items-center gap-1.5" style={{ color: 'var(--brand-primary)' }}>
                            <Sparkles className="w-3 h-3" /> Improve Hook (AI)
                          </button>
                        </div>
                        <textarea rows={2} className="textarea" value={editForm.hook} onChange={e => setEditForm({ ...editForm, hook: e.target.value })} />
                      </div>

                      <div className="flex flex-col gap-1.5 relative">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>Caption Text</label>
                          <button type="button" onClick={() => handleAISuggest(idx, 'caption', editForm.caption)}
                            className="text-xs font-bold hover:underline flex items-center gap-1.5" style={{ color: 'var(--brand-primary)' }}>
                            <Sparkles className="w-3 h-3" /> Rewrite Caption (AI)
                          </button>
                        </div>
                        <textarea rows={4} className="textarea" value={editForm.caption} onChange={e => setEditForm({ ...editForm, caption: e.target.value })} />
                      </div>

                      {item.contentType === 'REEL' && (
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>Voiceover Script / Storyboard</label>
                          <textarea rows={3} className="textarea" value={editForm.script} onChange={e => setEditForm({ ...editForm, script: e.target.value })} />
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>Call To Action</label>
                          <input type="text" className="input" value={editForm.cta} onChange={e => setEditForm({ ...editForm, cta: e.target.value })} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>Hashtags (comma separated)</label>
                          <input type="text" className="input" value={editForm.hashtagsStr} onChange={e => setEditForm({ ...editForm, hashtagsStr: e.target.value })} />
                        </div>
                      </div>

                      {suggestingIndex === idx && suggestions.length > 0 && (
                        <div className="p-4 rounded-xl flex flex-col gap-3" style={{ background: 'rgba(139,92,246,0.04)', border: '1px solid rgba(139,92,246,0.15)' }}>
                          <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-1.5" style={{ color: 'var(--brand-secondary)' }}>
                            <Sparkles className="w-3.5 h-3.5" /> AI Suggestions
                          </span>
                          <div className="flex flex-col gap-2">
                            {suggestions.map((sug, sIdx) => (
                              <button key={sIdx} type="button" onClick={() => applySuggestion(sug)}
                                className="p-3 rounded-xl text-left text-xs transition-colors cursor-pointer" style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>
                                {sug}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end gap-3 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                        <button onClick={() => setEditingIndex(null)} className="px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer" style={{ color: 'var(--text-muted)' }}>
                          Cancel
                        </button>
                        <button onClick={() => handleSaveEdit(idx)} className="btn btn-primary btn-sm inline-flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" /> Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-3 p-5 sm:p-6 rounded-2xl transition-all" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--brand-primary)' }}>
                            <Sparkles className="w-3.5 h-3.5" /> Hook Text Overlay
                          </span>
                          <p className="text-sm font-extrabold leading-relaxed" style={{ color: 'var(--text-primary)' }}>&ldquo;{item.hook}&rdquo;</p>
                        </div>
                        <div className="flex flex-col gap-3 p-5 sm:p-6 rounded-2xl transition-all" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--brand-secondary)' }}>
                            <ArrowRight className="w-3.5 h-3.5" /> Call to Action (CTA)
                          </span>
                          <p className="text-sm font-extrabold leading-relaxed" style={{ color: 'var(--text-primary)' }}>{item.cta}</p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2.5">
                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-2 px-1" style={{ color: 'var(--text-muted)' }}>
                          <FileText className="w-3.5 h-3.5" style={{ color: 'var(--brand-primary)' }} /> Caption Copy
                        </span>
                        <p className="text-sm leading-relaxed p-5 sm:p-6 rounded-2xl whitespace-pre-wrap" style={{ color: 'var(--text-primary)', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                          {item.caption}
                        </p>
                      </div>

                      {item.contentType === 'REEL' && item.script && (
                        <div className="flex flex-col gap-2.5">
                          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-2 px-1" style={{ color: 'var(--text-muted)' }}>
                            <Play className="w-3.5 h-3.5" style={{ color: 'var(--brand-secondary)' }} /> Video Script / Storyboard
                          </span>
                          <div className="text-sm leading-relaxed p-5 sm:p-6 rounded-2xl whitespace-pre-wrap" style={{ color: 'var(--text-primary)', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                            {item.script}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 pt-1">
                        {item.hashtags.map((tag: string, tIdx: number) => (
                          <span key={tIdx} className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all hover:opacity-80" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--brand-primary)' }}>
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex justify-end pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                        <button onClick={() => handleStartEdit(idx, item)}
                          className="px-4 py-2.5 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer hover:bg-[var(--bg-hover)]" style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>
                          <Edit3 className="w-3.5 h-3.5" style={{ color: 'var(--brand-primary)' }} /> Edit Post
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
