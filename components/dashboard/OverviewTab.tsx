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
  if (value >= 80) return '#22C55E';
  if (value >= 60) return '#84CC16';
  if (value >= 40) return '#F59E0B';
  return '#EF4444';
}

const ScoreRing = ({ value, label, subtitle }: { value: number; label: string; subtitle: string }) => {
  const r = 32;
  const c = 2 * Math.PI * r;
  const color = getScoreColor(value);
  return (
    <div className="flex flex-col items-center gap-2.5 p-4 rounded-xl bg-elevated/40 border border-subtle text-center transition-all hover:border-default">
      <div className="relative w-[72px] h-[72px] flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r={r} stroke="rgba(255,255,255,0.04)" fill="none" strokeWidth="5" />
          <circle cx="36" cy="36" r={r} fill="none" strokeWidth="5"
            stroke={color}
            strokeDasharray={c}
            strokeDashoffset={c - (value / 100) * c}
            strokeLinecap="round"
            className="transition-all duration-1000"
            style={{ filter: `drop-shadow(0 0 4px ${color}40)` }}
          />
        </svg>
        <span className="absolute text-sm font-extrabold" style={{ color }}>{value}%</span>
      </div>
      <div>
        <p className="text-[11px] font-bold text-primary">{label}</p>
        <p className="text-[9px] text-muted mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
};

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-elevated border border-default rounded-lg p-3 shadow-lg text-xs">
      <p className="font-bold text-primary mb-1">{label}</p>
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
    { label: 'Followers',     value: formatCount(profile.followers), icon: Users,     gradient: 'from-pink-500/15 to-rose-500/10', iconColor: 'text-pink-400' },
    { label: 'Following',     value: formatCount(profile.following), icon: UserCheck,  gradient: 'from-purple-500/15 to-violet-500/10', iconColor: 'text-purple-400' },
    { label: 'Total Posts',   value: formatCount(profile.totalPosts), icon: ImageIcon, gradient: 'from-blue-500/15 to-cyan-500/10', iconColor: 'text-blue-400' },
    { label: 'Avg Eng. Rate', value: `${er}%`,                        icon: TrendingUp, gradient: 'from-green-500/15 to-emerald-500/10', iconColor: 'text-green-400' },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">

      {/* Profile card */}
      <div className="card-static rounded-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand/5 via-transparent to-purple/5 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple via-brand to-orange opacity-60" />
        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="relative shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={profile.profilePicUrl || '/placeholder-avatar.png'} alt={profile.fullName}
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-brand/20 shadow-lg"
              onError={e => { (e.target as HTMLImageElement).src = '/placeholder-avatar.png'; }}
            />
            {profile.isVerified && (
              <div className="absolute -bottom-1.5 -right-1.5 p-1 bg-brand-gradient rounded-full border-2 border-surface shadow-md">
                <Award className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1 text-center sm:text-left flex flex-col gap-1.5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h1 className="text-xl font-extrabold text-primary">{profile.fullName}</h1>
              <span className="text-[10px] text-muted bg-elevated border border-subtle px-2 py-0.5 rounded-full self-center sm:self-start font-medium">@{profile.username}</span>
            </div>
            {profile.category && <span className="text-[10px] font-bold text-brand uppercase tracking-wider self-center sm:self-start">{profile.category}</span>}
            <p className="text-xs text-muted leading-relaxed max-w-2xl">{profile.bio || 'No bio provided.'}</p>
            {profile.externalUrl && (
              <a href={profile.externalUrl.startsWith('http') ? profile.externalUrl : `https://${profile.externalUrl}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline w-fit self-center sm:self-start">
                <ExternalLink className="w-3 h-3" />{profile.externalUrl}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="stat-card">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider">{s.label}</span>
                <div className={`p-1.5 rounded-lg bg-gradient-to-br ${s.gradient}`}>
                  <Icon className={`w-3.5 h-3.5 ${s.iconColor}`} />
                </div>
              </div>
              <span className="text-2xl font-extrabold text-primary tracking-tight">{s.value}</span>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Engagement over time */}
        <div className="card flex flex-col">
          <div className="card-header">
            <TrendingUp className="w-4 h-4 text-brand" />
            <h3 className="text-sm font-bold text-primary flex-1">Engagement Over Time</h3>
            <span className="text-[10px] text-muted">Last 20 posts</span>
          </div>
          {engSeries.length > 1 ? (
            <ResponsiveContainer width="100%" height={190}>
              <AreaChart data={engSeries} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradLikes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E1306C" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#E1306C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 9, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="likes" name="Likes" stroke="#E1306C" strokeWidth={2} fill="url(#gradLikes)" />
                <Area type="monotone" dataKey="comments" name="Comments" stroke="#833AB4" strokeWidth={1.5} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[190px] flex items-center justify-center text-xs text-muted">Not enough post data</div>
          )}
        </div>

        {/* Posts per month */}
        <div className="card flex flex-col">
          <div className="card-header">
            <Layers className="w-4 h-4 text-brand" />
            <h3 className="text-sm font-bold text-primary flex-1">Posting Frequency</h3>
            <span className="text-[10px] text-muted">Per month</span>
          </div>
          {freqSeries.length > 1 ? (
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={freqSeries} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="month" tick={{ fontSize: 9, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 9, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="count" name="Posts" fill="#E1306C" radius={[4, 4, 0, 0]} opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[190px] flex items-center justify-center text-xs text-muted">Not enough post data</div>
          )}
        </div>
      </div>

      {/* Score rings */}
      <div className="card flex flex-col">
        <div className="card-header">
          <Sparkles className="w-4 h-4 text-brand" />
          <h3 className="text-sm font-bold text-primary">Performance Scores</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
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
        <div className="card-brand rounded-2xl p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-brand/15">
              <Sparkles className="w-3.5 h-3.5 text-brand" />
            </div>
            <span className="text-[10px] font-bold text-brand uppercase tracking-wider">AI Profile Summary</span>
          </div>
          <p className="text-xs text-primary/90 leading-relaxed">{data.aiSummary}</p>
        </div>
      )}
    </div>
  );
}
