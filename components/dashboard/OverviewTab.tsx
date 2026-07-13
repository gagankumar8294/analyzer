'use client';

import React from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Users, UserCheck, Image as ImageIcon, TrendingUp, Award, ExternalLink, Layers, Sparkles } from 'lucide-react';
import type { AnalysisResult } from '@/lib/types/analysis';
import { formatCount } from '@/lib/utils/engagement';

interface Props { data: AnalysisResult; }

function buildEngagementSeries(posts: AnalysisResult['posts']) {
  if (!posts.length) return [];
  const sorted = [...posts].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  return sorted.slice(-20).map(p => ({
    date: new Date(p.timestamp).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    likes: p.likes,
    comments: p.comments,
    total: p.likes + p.comments,
  }));
}

function buildFrequencySeries(posts: AnalysisResult['posts']) {
  const counts: Record<string, number> = {};
  posts.forEach(p => {
    const key = new Date(p.timestamp).toLocaleDateString('en', { month: 'short', year: '2-digit' });
    counts[key] = (counts[key] ?? 0) + 1;
  });
  return Object.entries(counts).slice(-8).map(([month, count]) => ({ month, count }));
}

function getScoreColor(value: number): string {
  if (value >= 80) return '#22c55e';
  if (value >= 60) return '#84cc16';
  if (value >= 40) return '#eab308';
  return '#ef4444';
}

const ScoreRing = ({ value, label, subtitle }: { value: number; label: string; subtitle: string }) => {
  const r = 32;
  const c = 2 * Math.PI * r;
  const color = getScoreColor(value);
  return (
    <div className="flex flex-col items-center gap-3 p-5 rounded-xl text-center transition-all" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
      <div className="relative w-[76px] h-[76px] flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r={r} stroke="rgba(255,255,255,0.04)" fill="none" strokeWidth="5" />
          <circle cx="36" cy="36" r={r} fill="none" strokeWidth="5"
            stroke={color}
            strokeDasharray={c}
            strokeDashoffset={c - (value / 100) * c}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <span className="absolute text-sm font-extrabold" style={{ color }}>{value}%</span>
      </div>
      <div>
        <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{label}</p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>{subtitle}</p>
      </div>
    </div>
  );
};

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="p-3 rounded-xl text-xs shadow-lg" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}>
      <p className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {formatCount(p.value)}</p>
      ))}
    </div>
  );
};

export default function OverviewTab({ data }: Props) {
  const { profile, scores, posts } = data;
  const engSeries = buildEngagementSeries(posts);
  const freqSeries = buildFrequencySeries(posts);

  const totalEng = posts.reduce((s, p) => s + p.likes + p.comments, 0);
  const avgEng   = posts.length ? totalEng / posts.length : 0;
  const er       = profile.followers > 0 ? ((avgEng / profile.followers) * 100).toFixed(2) : '0.00';

  const stats = [
    { label: 'Followers',     value: formatCount(profile.followers), icon: Users },
    { label: 'Following',     value: formatCount(profile.following), icon: UserCheck },
    { label: 'Total Posts',   value: formatCount(profile.totalPosts), icon: ImageIcon },
    { label: 'Avg Eng. Rate', value: `${er}%`, icon: TrendingUp },
  ];

  return (
    <div className="flex flex-col gap-8 animate-fade-in">

      {/* Profile card */}
      <div className="card-static rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'var(--gradient-brand)', opacity: 0.6 }} />
        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={profile.profilePicUrl || '/placeholder-avatar.png'} alt={profile.fullName}
              className="w-20 h-20 rounded-2xl object-cover"
              style={{ border: '2px solid var(--border-default)', boxShadow: 'var(--shadow-md)' }}
              onError={e => { (e.target as HTMLImageElement).src = '/placeholder-avatar.png'; }}
            />
            {profile.isVerified && (
              <div className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-full" style={{ background: 'var(--gradient-brand)', border: '2px solid var(--bg-surface)' }}>
                <Award className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1 text-center sm:text-left flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
              <h1 className="text-xl font-extrabold" style={{ color: 'var(--text-primary)' }}>{profile.fullName}</h1>
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full self-center sm:self-start" style={{ color: 'var(--text-muted)', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>@{profile.username}</span>
            </div>
            {profile.category && <span className="text-xs font-bold uppercase tracking-wider self-center sm:self-start" style={{ color: 'var(--brand-primary)' }}>{profile.category}</span>}
            <p className="text-sm leading-relaxed max-w-2xl" style={{ color: 'var(--text-secondary)' }}>{profile.bio || 'No bio provided.'}</p>
            {profile.externalUrl && (
              <a href={profile.externalUrl.startsWith('http') ? profile.externalUrl : `https://${profile.externalUrl}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold w-fit self-center sm:self-start" style={{ color: 'var(--brand-primary)' }}>
                <ExternalLink className="w-3.5 h-3.5" />{profile.externalUrl}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="stat-card">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{s.label}</span>
                <div className="p-2 rounded-lg" style={{ background: 'var(--gradient-brand-soft)' }}>
                  <Icon className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />
                </div>
              </div>
              <span className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>{s.value}</span>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="card flex flex-col">
          <div className="card-header">
            <TrendingUp className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />
            <h3 className="text-sm font-bold flex-1" style={{ color: 'var(--text-primary)' }}>Engagement Over Time</h3>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Last 20 posts</span>
          </div>
          {engSeries.length > 1 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={engSeries} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradLikes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} width={35} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="likes" name="Likes" stroke="#6366f1" strokeWidth={2} fill="url(#gradLikes)" />
                <Area type="monotone" dataKey="comments" name="Comments" stroke="#8b5cf6" strokeWidth={1.5} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-sm" style={{ color: 'var(--text-muted)' }}>Not enough post data</div>
          )}
        </div>

        <div className="card flex flex-col">
          <div className="card-header">
            <Layers className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />
            <h3 className="text-sm font-bold flex-1" style={{ color: 'var(--text-primary)' }}>Posting Frequency</h3>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Per month</span>
          </div>
          {freqSeries.length > 1 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={freqSeries} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} width={35} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="count" name="Posts" fill="#6366f1" radius={[4, 4, 0, 0]} opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-sm" style={{ color: 'var(--text-muted)' }}>Not enough post data</div>
          )}
        </div>
      </div>

      {/* Score rings */}
      <div className="card flex flex-col">
        <div className="card-header">
          <Sparkles className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />
          <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Performance Scores</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          <ScoreRing value={scores.engagement}         label="Engagement"  subtitle="Interaction rate" />
          <ScoreRing value={scores.postingConsistency} label="Consistency" subtitle="Upload rhythm" />
          <ScoreRing value={scores.branding}           label="Branding"    subtitle="Profile setup" />
          <ScoreRing value={scores.seo}                label="SEO & Tags"  subtitle="Discovery" />
          <ScoreRing value={scores.growth ?? Math.round((scores.engagement + scores.postingConsistency) / 2)} label="Growth" subtitle="Growth signal" />
          <ScoreRing value={scores.competitor ?? Math.round((scores.engagement + scores.branding + scores.seo) / 3)} label="Competitive Edge" subtitle="Market position" />
        </div>
      </div>

      {/* AI quick summary */}
      {data.aiSummary && (
        <div className="card-brand rounded-2xl p-6 flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg" style={{ background: 'rgba(99,102,241,0.1)' }}>
              <Sparkles className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--brand-primary)' }}>AI Profile Summary</span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{data.aiSummary}</p>
        </div>
      )}
    </div>
  );
}
