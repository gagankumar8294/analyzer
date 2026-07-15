'use client';

import React, { useState } from 'react';
import { Target, CheckCircle2, Calendar, ShieldAlert, Sparkles, Award } from 'lucide-react';
import type { AnalysisResult } from '@/lib/types/analysis';
import { useAnalysisStore } from '@/store/analysisStore';

interface Props { data: AnalysisResult; }

export default function CompIntelStrategyTab({ data }: Props) {
  const { compIntelData } = useAnalysisStore();
  const competitors: any[] = compIntelData ?? data.competitors ?? [];
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  if (!competitors.length) {
    return (
      <div className="flex flex-col items-center justify-center py-28 gap-5 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
          <Target className="w-8 h-8" style={{ color: 'var(--text-muted)' }} />
        </div>
        <div>
          <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>No competitive strategy yet</p>
          <p className="text-sm mt-1.5 max-w-sm" style={{ color: 'var(--text-muted)' }}>Generate analysis to unlock the competitive playbook.</p>
        </div>
      </div>
    );
  }

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Playbook Header */}
      <div className="card relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.03), rgba(251,146,60,0.01))' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(249,115,22,0.1)' }}>
            <Target className="w-5 h-5" style={{ color: '#fb923c' }} />
          </div>
          <div>
            <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Your Competitive Growth Roadmap</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Follow these priority steps to match and outpace your top competitor feeds in content delivery.
            </p>
          </div>
        </div>
      </div>

      {/* Main Roadmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Phase 1: Immediate Actions */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 px-1">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Phase 1: This Week</h4>
          </div>

          <div className="card flex flex-col gap-3">
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Quick action items to align your formats with the niche leaders.
            </p>
            <div className="flex flex-col gap-2.5 mt-1">
              {competitors.map((comp: any, cIdx: number) => {
                const handle = comp.username ?? comp.handle;
                const id = `week-${cIdx}`;
                const isChecked = checkedItems[id];
                return (
                  <label
                    key={cIdx}
                    onClick={() => toggleCheck(id)}
                    className="p-3 rounded-xl flex items-start gap-2.5 cursor-pointer transition-all select-none"
                    style={{
                      background: isChecked ? 'rgba(74,222,128,0.02)' : 'var(--bg-elevated)',
                      border: isChecked ? '1px solid rgba(74,222,128,0.15)' : '1px solid var(--border-subtle)',
                      opacity: isChecked ? 0.6 : 1
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked || false}
                      readOnly
                      className="mt-0.5 accent-emerald-500 rounded cursor-pointer"
                    />
                    <div className="flex-1">
                      <p className="text-xs font-bold" style={{ color: isChecked ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                        Adopt tags from @{handle}
                      </p>
                      <p className="text-[10px] mt-0.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        Inject their top hashtags ({comp.topHashtags?.slice(0, 3).join(', ') || '#niche'}) into your next 3 captions.
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Phase 2: Medium-Term Actions */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 px-1">
            <Calendar className="w-4 h-4 text-purple-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Phase 2: This Month</h4>
          </div>

          <div className="card flex flex-col gap-3">
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Content theme adjustments and calendar adjustments to outpace competitors.
            </p>
            <div className="flex flex-col gap-2.5 mt-1">
              {competitors.map((comp: any, cIdx: number) => {
                const handle = comp.username ?? comp.handle;
                const id = `month-${cIdx}`;
                const isChecked = checkedItems[id];
                return (
                  <label
                    key={cIdx}
                    onClick={() => toggleCheck(id)}
                    className="p-3 rounded-xl flex items-start gap-2.5 cursor-pointer transition-all select-none"
                    style={{
                      background: isChecked ? 'rgba(74,222,128,0.02)' : 'var(--bg-elevated)',
                      border: isChecked ? '1px solid rgba(74,222,128,0.15)' : '1px solid var(--border-subtle)',
                      opacity: isChecked ? 0.6 : 1
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked || false}
                      readOnly
                      className="mt-0.5 accent-emerald-500 rounded cursor-pointer"
                    />
                    <div className="flex-1">
                      <p className="text-xs font-bold" style={{ color: isChecked ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                        Target themes: {comp.contentThemes?.[0] || 'Niche topics'}
                      </p>
                      <p className="text-[10px] mt-0.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        Write 3 short reels addressing gap areas: {comp.gapVsTarget?.[0] || 'Tutorial lessons.'}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Phase 3: Long-Term Strategy */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 px-1">
            <Award className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Phase 3: Long Term</h4>
          </div>

          <div className="card flex flex-col gap-3">
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Establishing niche brand authority to solidify your target placement.
            </p>
            <div className="flex flex-col gap-2.5 mt-1">
              {competitors.map((comp: any, cIdx: number) => {
                const handle = comp.username ?? comp.handle;
                const id = `year-${cIdx}`;
                const isChecked = checkedItems[id];
                return (
                  <label
                    key={cIdx}
                    onClick={() => toggleCheck(id)}
                    className="p-3 rounded-xl flex items-start gap-2.5 cursor-pointer transition-all select-none"
                    style={{
                      background: isChecked ? 'rgba(74,222,128,0.02)' : 'var(--bg-elevated)',
                      border: isChecked ? '1px solid rgba(74,222,128,0.15)' : '1px solid var(--border-subtle)',
                      opacity: isChecked ? 0.6 : 1
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked || false}
                      readOnly
                      className="mt-0.5 accent-emerald-500 rounded cursor-pointer"
                    />
                    <div className="flex-1">
                      <p className="text-xs font-bold" style={{ color: isChecked ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                        Exploit weaknesses of @{handle}
                      </p>
                      <p className="text-[10px] mt-0.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        Capitalize on what they lack: {comp.weaknesses?.[0] || 'Community comments engagement.'}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Learning Opportunities Section */}
      <div className="card flex flex-col gap-4 mt-2">
        <div className="card-header">
          <Sparkles className="w-4.5 h-4.5" style={{ color: '#fb923c' }} />
          <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Competitor Learning Opportunities</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {competitors.map((comp: any, idx: number) => (
            <div key={idx} className="p-4 rounded-xl flex flex-col gap-2" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
              <span className="text-[10px] font-extrabold text-[#fb923c] uppercase">Inspired by @{comp.username ?? comp.handle}</span>
              <ul className="flex flex-col gap-2 mt-1">
                {comp.learningOpportunities?.map((opp: string, oIdx: number) => (
                  <li key={oIdx} className="text-xs leading-relaxed flex items-start gap-2" style={{ color: 'var(--text-secondary)' }}>
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                    <span>{opp}</span>
                  </li>
                )) || <p className="text-xs italic" style={{ color: 'var(--text-muted)' }}>No opportunities listed.</p>}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
