'use client';

import React, { useState } from 'react';
import { CheckCircle2, Clock, TrendingUp, Zap, Calendar } from 'lucide-react';
import type { AnalysisResult } from '@/lib/types/analysis';

interface ActionPlanTabProps {
  data: AnalysisResult;
}

export default function ActionPlanTab({ data }: ActionPlanTabProps) {
  const { actionPlan } = data;
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const toggleCheck = (idx: number) => {
    setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority.toUpperCase()) {
      case 'HIGH':
        return { color: '#ef4444', label: 'HIGH' };
      case 'MEDIUM':
        return { color: '#eab308', label: 'MEDIUM' };
      default:
        return { color: '#3b82f6', label: 'LOW' };
    }
  };

  const roadmapSteps = [
    { phase: 'Days 1-7', title: 'Bio & SEO Setup', detail: 'Optimize profile keywords, update category tags, and configure Linktree redirects.' },
    { phase: 'Days 8-14', title: 'Content Consistency', detail: 'Establish the 3 core content pillars and pre-schedule at least 4 Reels/Carousels.' },
    { phase: 'Days 15-21', title: 'Engagement Boost', detail: 'Implement DM automation keywords to drive conversations.' },
    { phase: 'Days 22-30', title: 'Competitor Overlap', detail: 'Audit performance metrics of recently uploaded posts and adjust hooks.' },
  ];

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      
      <div className="card-static rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(90deg, rgba(99,102,241,0.04) 0%, rgba(34,197,94,0.03) 100%)' }} />
        <div className="relative">
          <h2 className="text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}>Your Optimization Checklist</h2>
          <p className="text-sm max-w-xl mt-1" style={{ color: 'var(--text-secondary)' }}>
            Complete these specific actions to grow your brand, increase SEO discoverability, and bridge competitor gaps.
          </p>
        </div>
        <div className="flex items-center gap-4 p-4 rounded-xl relative" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
          <div className="text-right">
            <span className="text-xs font-bold uppercase block" style={{ color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Progress</span>
            <span className="text-sm font-extrabold" style={{ color: 'var(--text-primary)' }}>
              {Object.values(checkedItems).filter(Boolean).length} / {actionPlan.length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm" style={{ border: '2px solid var(--border-brand)', color: 'var(--brand-primary)', background: 'rgba(99,102,241,0.05)' }}>
            {Math.round((Object.values(checkedItems).filter(Boolean).length / (actionPlan.length || 1)) * 100)}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="card lg:col-span-2 flex flex-col">
          <div className="card-header">
            <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />
            <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Action Checklist</h3>
          </div>

          <div className="flex flex-col gap-3">
            {actionPlan.map((item, idx) => {
              const styles = getPriorityStyles(item.priority);
              const isChecked = checkedItems[idx] || false;
              
              return (
                <div 
                  key={idx} 
                  className="p-4 rounded-xl flex gap-3.5 transition-all"
                  style={{
                    border: isChecked ? '1px solid var(--border-subtle)' : '1px solid var(--border-subtle)',
                    background: isChecked ? 'var(--bg-elevated)' : 'rgba(39,39,42,0.3)',
                    opacity: isChecked ? 0.5 : 1,
                  }}
                >
                  <button 
                    onClick={() => toggleCheck(idx)}
                    className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors mt-0.5"
                    style={{
                      border: isChecked ? 'none' : '2px solid var(--border-default)',
                      background: isChecked ? 'var(--brand-primary)' : 'transparent',
                      color: isChecked ? '#fff' : 'transparent',
                    }}
                  >
                    {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>

                  <div className="flex-1 flex flex-col gap-2.5">
                    <div className="flex flex-wrap items-center gap-2 justify-between">
                      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{item.category}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold flex items-center gap-1.5" style={{ background: `${styles.color}10`, color: styles.color, border: `1px solid ${styles.color}25` }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: styles.color }} />
                        {styles.label}
                      </span>
                    </div>

                    <p className="text-sm font-bold leading-relaxed" style={{ color: isChecked ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: isChecked ? 'line-through' : 'none' }}>
                      {item.action}
                    </p>

                    <div className="grid grid-cols-2 gap-3 pt-2.5 text-xs font-medium" style={{ borderTop: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                      <div className="flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5" style={{ color: '#4ade80' }} />
                        <span>Impact: <strong style={{ color: 'var(--text-primary)' }}>{item.expectedImpact}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" style={{ color: '#60a5fa' }} />
                        <span>Target: <strong style={{ color: 'var(--text-primary)' }}>{item.timeframe}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card lg:col-span-1 flex flex-col">
          <div className="card-header">
            <Calendar className="w-4 h-4" style={{ color: 'var(--brand-secondary)' }} />
            <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>30-Day Roadmap</h3>
          </div>

          <div className="flex flex-col gap-6 relative pl-6 py-2">
            <div className="absolute top-0 bottom-0 left-[7px] w-px" style={{ background: 'var(--border-subtle)' }} />

            {roadmapSteps.map((step, idx) => (
              <div key={idx} className="flex gap-3.5 relative">
                <div className="w-4 h-4 rounded-full flex items-center justify-center absolute left-[-25px] top-1.5 z-10" style={{ border: '2px solid var(--brand-primary)', background: 'var(--bg-surface)' }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--brand-primary)' }} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-extrabold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>{step.phase}</span>
                  <h4 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{step.title}</h4>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{step.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl flex gap-3 mt-auto" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
            <Zap className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#eab308' }} />
            <div>
              <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Pro Tip</p>
              <p className="text-xs leading-relaxed mt-0.5" style={{ color: 'var(--text-muted)' }}>
                Always audit post metrics 48 hours after upload. If a post underperforms, review the hook text overlay.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
