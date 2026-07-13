'use client';

import React from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Hash, Image as ImageIcon, Film, Layers, MessageSquare, BarChart3 } from 'lucide-react';
import type { AnalysisResult } from '@/lib/types/analysis';
import { formatCount } from '@/lib/utils/engagement';

interface Props { data: AnalysisResult; }

const PIE_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#818cf8'];

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="p-3 rounded-xl text-xs shadow-lg" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}>
      <p className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{label ?? payload[0]?.name}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color ?? p.fill }}>
          {p.name}: {typeof p.value === 'number' && p.value > 100 ? formatCount(p.value) : p.value}
        </p>
      ))}
    </div>
  );
};

export default function ContentTab({ data }: Props) {
  const { posts } = data;

  const typeCounts: Record<string, number> = { IMAGE: 0, REEL: 0, CAROUSEL: 0, VIDEO: 0 };
  posts.forEach(p => { typeCounts[p.type] = (typeCounts[p.type] ?? 0) + 1; });
  const pieData = Object.entries(typeCounts)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));

  const hashtagFreq: Record<string, number> = {};
  posts.forEach(p => p.hashtags.forEach(h => { hashtagFreq[h] = (hashtagFreq[h] ?? 0) + 1; }));
  const topHashtags = Object.entries(hashtagFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([tag, count]) => ({ tag: tag.replace('#', ''), count }));

  const avgCaptionLen = posts.length
    ? Math.round(posts.reduce((s, p) => s + (p.caption?.length ?? 0), 0) / posts.length)
    : 0;
  const postsWithHashtags = posts.filter(p => p.hashtags.length > 0).length;
  const avgHashtagsPerPost = posts.length
    ? Math.round(posts.reduce((s, p) => s + p.hashtags.length, 0) / posts.length)
    : 0;

  const topPosts = [...posts]
    .sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments))
    .slice(0, 6);

  return (
    <div className="flex flex-col gap-8 animate-fade-in">

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Posts Analysed', value: posts.length, icon: ImageIcon },
          { label: 'Avg Caption', value: `${avgCaptionLen} chars`, icon: MessageSquare },
          { label: 'With Hashtags', value: `${postsWithHashtags}`, icon: Hash },
          { label: 'Avg Tags/Post', value: avgHashtagsPerPost, icon: BarChart3 },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="stat-card">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{s.label}</span>
                <div className="p-2 rounded-lg" style={{ background: 'var(--gradient-brand-soft)' }}>
                  <Icon className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />
                </div>
              </div>
              <span className="text-xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>{s.value}</span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="card flex flex-col">
          <div className="card-header">
            <Layers className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />
            <h3 className="text-sm font-bold flex-1" style={{ color: 'var(--text-primary)' }}>Content Type Mix</h3>
          </div>
          {pieData.length > 0 ? (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="55%" height={190}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75}
                    dataKey="value" paddingAngle={3} strokeWidth={0}>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-3 flex-1">
                {pieData.map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.name}</span>
                    <span className="ml-auto text-sm font-bold" style={{ color: 'var(--text-muted)' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[190px] flex items-center justify-center text-sm" style={{ color: 'var(--text-muted)' }}>No post data</div>
          )}
        </div>

        <div className="card flex flex-col">
          <div className="card-header">
            <Hash className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />
            <h3 className="text-sm font-bold flex-1" style={{ color: 'var(--text-primary)' }}>Top Hashtags Used</h3>
          </div>
          {topHashtags.length > 0 ? (
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={topHashtags} layout="vertical" margin={{ top: 0, right: 10, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="tag" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} width={110} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="count" name="Uses" fill="#8b5cf6" radius={[0, 4, 4, 0]} opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[190px] flex items-center justify-center text-sm" style={{ color: 'var(--text-muted)' }}>No hashtag data</div>
          )}
        </div>
      </div>

      {topPosts.length > 0 && (
        <div className="card flex flex-col">
          <div className="card-header">
            <Film className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />
            <h3 className="text-sm font-bold flex-1" style={{ color: 'var(--text-primary)' }}>Top Performing Posts</h3>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>By engagement</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topPosts.map((post, i) => (
              <div key={post.id} className="p-4 rounded-xl flex flex-col gap-2.5 transition-all" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{post.type}</span>
                  <span className="w-6 h-6 rounded-full text-xs font-extrabold flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--brand-primary)' }}>#{i + 1}</span>
                </div>
                <p className="text-sm line-clamp-2 leading-relaxed min-h-[32px]" style={{ color: 'var(--text-primary)' }}>
                  {post.caption || '(no caption)'}
                </p>
                <div className="flex items-center gap-4 mt-auto pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <span className="text-xs font-bold flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
                    {formatCount(post.likes)} likes
                  </span>
                  <span className="text-xs font-bold flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
                    {formatCount(post.comments)} comments
                  </span>
                  <span className="ml-auto text-xs" style={{ color: 'var(--text-muted)' }}>
                    {new Date(post.timestamp).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
