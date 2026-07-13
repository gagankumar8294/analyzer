'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { AnalysisResult } from '@/lib/types/analysis';
import { formatCount } from '@/lib/utils/engagement';

interface Props { data: AnalysisResult; }

const COMP_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#818cf8'];

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

export default function CompetitorsTab({ data }: Props) {
  const competitors: any[] = data.competitors ?? [];

  if (!competitors.length) {
    return (
      <div className="flex flex-col items-center justify-center py-28 gap-5 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
          <Users2 className="w-8 h-8" style={{ color: 'var(--text-muted)' }} />
        </div>
        <div>
          <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>No competitor data yet</p>
          <p className="text-sm mt-1.5 max-w-sm" style={{ color: 'var(--text-muted)' }}>Competitor analysis requires AI insight generation. Try re-running the analysis.</p>
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

      <div className="card flex flex-col">
        <div className="card-header">
          <TrendingUp className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />
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
                <Cell key={i} fill={entry.fill} opacity={i === 0 ? 1 : 0.7} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Competitor Profiles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {competitors.slice(0, 6).map((comp: any, i: number) => {
            const handle = comp.username ?? comp.handle ?? `competitor${i + 1}`;
            const followers = comp.followers ?? comp.followersCount ?? 0;
            const diff = followers - data.profile.followers;
            const pct = data.profile.followers > 0 ? Math.abs(Math.round((diff / data.profile.followers) * 100)) : 0;

            return (
              <div key={i} className="card flex flex-col gap-3.5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shrink-0" style={{ background: 'var(--gradient-brand)' }}>
                    {handle[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>@{handle}</p>
                    {comp.niche && <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{comp.niche}</p>}
                  </div>
                  {diff > 0 ? (
                    <div className="flex items-center gap-1 text-xs font-bold shrink-0" style={{ color: '#f87171' }}>
                      <TrendingUp className="w-3.5 h-3.5" />+{pct}%
                    </div>
                  ) : diff < 0 ? (
                    <div className="flex items-center gap-1 text-xs font-bold shrink-0" style={{ color: '#4ade80' }}>
                      <TrendingDown className="w-3.5 h-3.5" />-{pct}%
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-xs font-bold shrink-0" style={{ color: 'var(--text-muted)' }}>
                      <Minus className="w-3.5 h-3.5" />Same
                    </div>
                  )}
                </div>

                {followers > 0 && (
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-2.5 rounded-xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Followers</p>
                      <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{formatCount(followers)}</p>
                    </div>
                    {comp.engagementRate != null && (
                      <div className="p-2.5 rounded-xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Eng. Rate</p>
                        <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{comp.engagementRate}%</p>
                      </div>
                    )}
                  </div>
                )}

                {comp.reason && (
                  <p className="text-xs leading-relaxed pt-2.5" style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)' }}>{comp.reason}</p>
                )}

                <div className="flex flex-col gap-1.5">
                  {comp.strengths?.slice(0, 2).map((s: string, j: number) => (
                    <div key={j} className="flex items-start gap-2 text-xs" style={{ color: '#4ade80' }}>
                      <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#4ade80' }} />{s}
                    </div>
                  ))}
                  {comp.weaknesses?.slice(0, 1).map((w: string, j: number) => (
                    <div key={j} className="flex items-start gap-2 text-xs" style={{ color: '#facc15' }}>
                      <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ color: '#facc15', background: '#facc15' }} />{w}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
