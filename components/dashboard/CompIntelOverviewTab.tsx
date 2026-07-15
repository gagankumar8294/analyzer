'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users2, TrendingUp, TrendingDown, Minus, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';
import type { AnalysisResult } from '@/lib/types/analysis';
import { formatCount } from '@/lib/utils/engagement';

interface Props { data: AnalysisResult; }

const COMP_COLORS = ['#fb923c', '#f97316', '#ea580c', '#c2410c', '#9a3412'];

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="p-3 rounded-xl text-xs shadow-lg" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}>
      <p className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.fill ?? p.color }}>{p.name}: {formatCount(p.value)}</p>
      ))}
    </div>
  );
};

export default function CompIntelOverviewTab({ data }: Props) {
  const competitors: any[] = data.competitors ?? [];

  if (!competitors.length) {
    return (
      <div className="flex flex-col items-center justify-center py-28 gap-5 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
          <Users2 className="w-8 h-8" style={{ color: 'var(--text-muted)' }} />
        </div>
        <div>
          <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>No competitor data yet</p>
          <p className="text-sm mt-1.5 max-w-sm" style={{ color: 'var(--text-muted)' }}>Competitor profiles require AI insight generation. Try re-running the analysis.</p>
        </div>
      </div>
    );
  }

  const chartData = [
    { name: `@${data.profile.username}`, followers: data.profile.followers, fill: '#6366f1' },
    ...competitors.slice(0, 5).map((c: any, i: number) => ({
      name: `@${c.username ?? c.handle ?? `competitor${i + 1}`}`,
      followers: c.followers ?? c.followersCount ?? 0,
      fill: COMP_COLORS[i % COMP_COLORS.length],
    })),
  ];

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Follower Comparison */}
      <div className="card flex flex-col">
        <div className="card-header">
          <TrendingUp className="w-4 h-4" style={{ color: '#f97316' }} />
          <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Follower Comparison</h3>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ top: 5, right: 15, left: 30, bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} angle={-35} textAnchor="end" />
            <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} tickFormatter={v => formatCount(v)} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="followers" name="Followers" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} opacity={i === 0 ? 1 : 0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Competitor Profiles Grid */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Enriched Competitor Profiles</h3>
        <div className="grid grid-cols-1 gap-6">
          {competitors.map((comp: any, i: number) => {
            const handle = comp.username ?? comp.handle ?? `competitor${i + 1}`;
            const followers = comp.followers ?? comp.followersCount ?? 0;
            const diff = followers - data.profile.followers;
            const pct = data.profile.followers > 0 ? Math.abs(Math.round((diff / data.profile.followers) * 100)) : 0;

            return (
              <div key={i} className="card flex flex-col gap-4 relative overflow-hidden" style={{ borderLeft: '3px solid #f97316' }}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shrink-0" style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)' }}>
                      {handle[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>@{handle}</span>
                        {comp.niche && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(249,115,22,0.1)', color: '#fb923c', border: '1px solid rgba(249,115,22,0.15)' }}>
                            {comp.niche}
                          </span>
                        )}
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {comp.reason || 'Primary niche competitor identified by AI audits.'}
                      </p>
                    </div>
                  </div>

                  {diff > 0 ? (
                    <div className="flex items-center gap-1 text-xs font-bold" style={{ color: '#f87171' }}>
                      <TrendingUp className="w-3.5 h-3.5" />+{pct}% vs you
                    </div>
                  ) : diff < 0 ? (
                    <div className="flex items-center gap-1 text-xs font-bold" style={{ color: '#4ade80' }}>
                      <TrendingDown className="w-3.5 h-3.5" />-{pct}% vs you
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-xs font-bold" style={{ color: 'var(--text-muted)' }}>
                      <Minus className="w-3.5 h-3.5" />Same size
                    </div>
                  )}
                </div>

                {/* Core Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                    <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>Followers</p>
                    <p className="text-base font-extrabold mt-0.5" style={{ color: 'var(--text-primary)' }}>{formatCount(followers)}</p>
                  </div>
                  <div className="p-3 rounded-xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                    <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>Eng. Rate</p>
                    <p className="text-base font-extrabold mt-0.5 animate-pulse" style={{ color: '#fb923c' }}>{comp.engagementRate ?? 0}%</p>
                  </div>
                  <div className="p-3 rounded-xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                    <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>Avg Reel Views</p>
                    <p className="text-base font-extrabold mt-0.5" style={{ color: 'var(--text-primary)' }}>{formatCount(comp.avgReelViews ?? 0)}</p>
                  </div>
                  <div className="p-3 rounded-xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                    <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>Posting Frequency</p>
                    <p className="text-sm font-extrabold mt-1 truncate" style={{ color: 'var(--text-primary)' }}>{comp.postingFrequency || 'N/A'}</p>
                  </div>
                </div>

                {/* Content Formats distribution chips */}
                {comp.contentFormats && comp.contentFormats.length > 0 && (
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-[11px] font-bold" style={{ color: 'var(--text-muted)' }}>Formats:</span>
                    {comp.contentFormats.map((fmt: string, idx: number) => (
                      <span key={idx} className="text-[11px] font-semibold px-2 py-0.5 rounded-lg" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}>
                        {fmt}
                      </span>
                    ))}
                  </div>
                )}

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <div>
                    <h4 className="text-xs font-bold mb-2 flex items-center gap-1.5" style={{ color: '#4ade80' }}>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Core Strengths
                    </h4>
                    <ul className="flex flex-col gap-1.5">
                      {comp.strengths?.map((str: string, idx: number) => (
                        <li key={idx} className="text-xs leading-relaxed flex items-start gap-2" style={{ color: 'var(--text-muted)' }}>
                          <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: '#4ade80' }} />
                          {str}
                        </li>
                      )) || <span className="text-xs italic" style={{ color: 'var(--text-muted)' }}>No strengths analyzed yet.</span>}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold mb-2 flex items-center gap-1.5" style={{ color: '#facc15' }}>
                      <AlertTriangle className="w-3.5 h-3.5" /> Weaknesses & Gaps
                    </h4>
                    <ul className="flex flex-col gap-1.5">
                      {comp.weaknesses?.map((weak: string, idx: number) => (
                        <li key={idx} className="text-xs leading-relaxed flex items-start gap-2" style={{ color: 'var(--text-muted)' }}>
                          <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: '#facc15' }} />
                          {weak}
                        </li>
                      )) || <span className="text-xs italic" style={{ color: 'var(--text-muted)' }}>No gaps analyzed yet.</span>}
                    </ul>
                  </div>
                </div>

                {/* Actionable growth tip */}
                {comp.growthTip && (
                  <div className="p-3 rounded-xl flex items-start gap-2.5 mt-2" style={{ background: 'rgba(249,115,22,0.04)', border: '1px dashed rgba(249,115,22,0.2)' }}>
                    <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#fb923c' }} />
                    <div className="flex-1">
                      <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#fb923c' }}>AI Combat Strategy</p>
                      <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-primary)' }}>{comp.growthTip}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
