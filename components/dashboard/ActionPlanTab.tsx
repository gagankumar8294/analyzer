'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Zap,
  Calendar
} from 'lucide-react';
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
        return { bg: 'bg-red-500/10 border-red-500/18 text-red-400', dot: 'bg-red-400', text: 'HIGH' };
      case 'MEDIUM':
        return { bg: 'bg-amber-500/10 border-amber-500/18 text-amber-400', dot: 'bg-amber-400', text: 'MEDIUM' };
      default:
        return { bg: 'bg-blue-500/10 border-blue-500/18 text-blue-400', dot: 'bg-blue-400', text: 'LOW' };
    }
  };

  const roadmapSteps = [
    { phase: 'Days 1-7', title: 'Bio & SEO Setup', detail: 'Optimize profile keywords, update category tags, and configure Linktree redirects.' },
    { phase: 'Days 8-14', title: 'Content Consistency', detail: 'Establish the 3 core content pillars and pre-schedule at least 4 Reels/Carousels.' },
    { phase: 'Days 15-21', title: 'Engagement Boost', detail: 'Implement DM automation keywords to drive conversations.' },
    { phase: 'Days 22-30', title: 'Competitor Overlap', detail: 'Audit performance metrics of recently uploaded posts and adjust hooks.' },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Top Banner */}
      <div className="card-static rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand/5 to-green-500/5 pointer-events-none" />
        <div className="relative">
          <h2 className="text-base font-extrabold text-primary">Your Optimization Checklist</h2>
          <p className="text-[11px] text-muted max-w-xl mt-0.5">
            Complete these specific actions to grow your brand, increase SEO discoverability, and bridge competitor gaps.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-elevated/60 border border-subtle p-3 rounded-xl relative">
          <div className="text-right">
            <span className="text-[9px] font-bold text-muted uppercase tracking-wider block">Progress</span>
            <span className="text-xs font-extrabold text-primary">
              {Object.values(checkedItems).filter(Boolean).length} / {actionPlan.length}
            </span>
          </div>
          <div className="w-9 h-9 rounded-full border-2 border-brand/25 flex items-center justify-center font-extrabold text-brand bg-brand/5 text-xs">
            {Math.round((Object.values(checkedItems).filter(Boolean).length / (actionPlan.length || 1)) * 100)}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Action checklist */}
        <div className="card lg:col-span-2 flex flex-col">
          <div className="card-header">
            <CheckCircle2 className="w-4 h-4 text-brand" />
            <h3 className="text-sm font-bold text-primary">Action Checklist</h3>
          </div>

          <div className="flex flex-col gap-2.5">
            {actionPlan.map((item, idx) => {
              const styles = getPriorityStyles(item.priority);
              const isChecked = checkedItems[idx] || false;
              
              return (
                <div 
                  key={idx} 
                  className={`p-3.5 rounded-xl border flex gap-3 transition-all ${
                    isChecked 
                      ? 'border-subtle bg-elevated/20 opacity-50' 
                      : 'border-subtle bg-elevated/30 hover:border-brand/15'
                  }`}
                >
                  <button 
                    onClick={() => toggleCheck(idx)}
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors mt-0.5 ${
                      isChecked 
                        ? 'border-brand bg-brand text-white' 
                        : 'border-default hover:border-brand/40'
                    }`}
                  >
                    {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>

                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2 justify-between">
                      <span className="text-[9px] font-bold text-muted uppercase tracking-widest">{item.category}</span>
                      <span className={`px-2 py-0.5 rounded-full border text-[8px] font-extrabold flex items-center gap-1 ${styles.bg}`}>
                        <span className={`w-1 h-1 rounded-full ${styles.dot}`} />
                        {styles.text}
                      </span>
                    </div>

                    <p className={`text-xs font-bold text-primary leading-relaxed ${isChecked ? 'line-through text-muted' : ''}`}>
                      {item.action}
                    </p>

                    <div className="grid grid-cols-2 gap-3 border-t border-subtle pt-2 text-[10px] font-medium text-muted">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-green-400" />
                        <span>Impact: <strong className="text-primary">{item.expectedImpact}</strong></span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-blue-400" />
                        <span>Target: <strong className="text-primary">{item.timeframe}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 30-Day roadmap sidebar */}
        <div className="card lg:col-span-1 flex flex-col">
          <div className="card-header">
            <Calendar className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-primary">30-Day Roadmap</h3>
          </div>

          <div className="flex flex-col gap-5 relative pl-3 py-2">
            <div className="absolute top-0 bottom-0 left-[18px] w-px bg-subtle" />

            {roadmapSteps.map((step, idx) => (
              <div key={idx} className="flex gap-3 relative">
                <div className="w-3.5 h-3.5 rounded-full border-2 border-brand bg-surface absolute left-[11px] top-1.5 z-10 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-brand" />
                </div>

                <div className="pl-5 flex flex-col gap-1">
                  <span className="text-[9px] font-extrabold text-brand uppercase tracking-wider">{step.phase}</span>
                  <h4 className="text-xs font-bold text-primary">{step.title}</h4>
                  <p className="text-[10px] text-muted leading-relaxed">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-elevated/50 border border-subtle flex gap-2.5 mt-auto">
            <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-bold text-primary">Pro Tip</p>
              <p className="text-[9px] text-muted leading-relaxed mt-0.5">
                Always audit post metrics 48 hours after upload. If a post underperforms, review the hook text overlay.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
