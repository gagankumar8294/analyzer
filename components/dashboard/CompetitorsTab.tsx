'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { AnalysisResult } from '@/lib/types/analysis';
import { formatCount } from '@/lib/utils/engagement';

interface Props { data: AnalysisResult; }

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-elevated border border-default rounded-lg p-3 shadow-lg text-xs">
      <p className="font-bold text-primary mb-1">{label}</p>
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
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-elevated border border-subtle flex items-center justify-center">
          <Users2 className="w-7 h-7 text-muted" />
        </div>
        <div>
          <p className="text-sm font-bold text-primary">No competitor data yet</p>
          <p className="text-xs text-muted mt-1 max-w-sm">Competitor analysis requires AI insight generation. Try re-running the analysis.</p>
        </div>
      </div>
    );
  }

  const chartData = [
    { name: `@${data.profile.username}`, followers: data.profile.followers, fill: '#E1306C' },
    ...competitors.slice(0, 5).map((c: any, i: number) => ({
      name: `@${c.username ?? c.handle ?? `competitor${i + 1}`}`,
      followers: c.followers ?? c.followersCount ?? 0,
      fill: ['#833AB4', '#F77737', '#FCAF45', '#58C4E1', '#4ADE80'][i],
    })),
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">

      {/* Follower comparison chart */}
      <div className="card flex flex-col">
        <div className="card-header">
          <TrendingUp className="w-4 h-4 text-brand" />
          <h3 className="text-sm font-bold text-primary">Follower Comparison</h3>
        </div>
        <ResponsiveContainer width="100%" height={210}>
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <XAxis dataKey="name" tick={{ fontSize: 9, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} angle={-35} textAnchor="end" />
            <YAxis tick={{ fontSize: 9, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} tickFormatter={v => formatCount(v)} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="followers" name="Followers" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} opacity={i === 0 ? 1 : 0.7} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Competitor cards */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-primary">Competitor Profiles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {competitors.slice(0, 6).map((comp: any, i: number) => {
            const handle = comp.username ?? comp.handle ?? `competitor${i + 1}`;
            const followers = comp.followers ?? comp.followersCount ?? 0;
            const diff = followers - data.profile.followers;
            const pct = data.profile.followers > 0 ? Math.abs(Math.round((diff / data.profile.followers) * 100)) : 0;

            return (
              <div key={i} className="card flex flex-col gap-3 hover:border-default transition-all">
                {/* Header */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center text-white font-extrabold text-xs shrink-0 shadow-sm">
                    {handle[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-primary truncate">@{handle}</p>
                    {comp.niche && <p className="text-[10px] text-muted truncate">{comp.niche}</p>}
                  </div>
                  {diff > 0 ? (
                    <div className="flex items-center gap-0.5 text-red-400 text-[10px] font-bold shrink-0">
                      <TrendingUp className="w-3 h-3" />+{pct}%
                    </div>
                  ) : diff < 0 ? (
                    <div className="flex items-center gap-0.5 text-green-400 text-[10px] font-bold shrink-0">
                      <TrendingDown className="w-3 h-3" />-{pct}%
                    </div>
                  ) : (
                    <div className="flex items-center gap-0.5 text-muted text-[10px] font-bold shrink-0">
                      <Minus className="w-3 h-3" />Same
                    </div>
                  )}
                </div>

                {/* Stats */}
                {followers > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded-lg bg-elevated/40 border border-subtle">
                      <p className="text-[9px] text-muted">Followers</p>
                      <p className="text-xs font-bold text-primary">{formatCount(followers)}</p>
                    </div>
                    {comp.engagementRate != null && (
                      <div className="p-2 rounded-lg bg-elevated/40 border border-subtle">
                        <p className="text-[9px] text-muted">Eng. Rate</p>
                        <p className="text-xs font-bold text-primary">{comp.engagementRate}%</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Reason */}
                {comp.reason && (
                  <p className="text-[11px] text-muted leading-relaxed border-t border-subtle pt-2.5">{comp.reason}</p>
                )}

                {/* Strengths/weaknesses */}
                <div className="flex flex-col gap-1">
                  {comp.strengths?.slice(0, 2).map((s: string, j: number) => (
                    <div key={j} className="flex items-start gap-1.5 text-[11px] text-green-400">
                      <span className="mt-1 w-1 h-1 rounded-full bg-green-400 shrink-0" />{s}
                    </div>
                  ))}
                  {comp.weaknesses?.slice(0, 1).map((w: string, j: number) => (
                    <div key={j} className="flex items-start gap-1.5 text-[11px] text-amber-400">
                      <span className="mt-1 w-1 h-1 rounded-full bg-amber-400 shrink-0" />{w}
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
