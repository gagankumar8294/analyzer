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

const PIE_COLORS = ['#E1306C', '#833AB4', '#F77737', '#FCAF45', '#58C4E1'];

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-elevated border border-default rounded-lg p-3 shadow-lg text-xs">
      <p className="font-bold text-primary mb-1">{label ?? payload[0]?.name}</p>
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
    <div className="flex flex-col gap-6 animate-fade-in">

      {/* Content stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Posts Analysed', value: posts.length, icon: ImageIcon, gradient: 'from-pink-500/15 to-rose-500/10', iconColor: 'text-pink-400' },
          { label: 'Avg Caption', value: `${avgCaptionLen} chars`, icon: MessageSquare, gradient: 'from-blue-500/15 to-cyan-500/10', iconColor: 'text-blue-400' },
          { label: 'With Hashtags', value: `${postsWithHashtags}`, icon: Hash, gradient: 'from-purple-500/15 to-violet-500/10', iconColor: 'text-purple-400' },
          { label: 'Avg Tags/Post', value: avgHashtagsPerPost, icon: BarChart3, gradient: 'from-orange-500/15 to-amber-500/10', iconColor: 'text-orange-400' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="stat-card">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider">{s.label}</span>
                <div className={`p-1.5 rounded-lg bg-gradient-to-br ${s.gradient}`}>
                  <Icon className={`w-3.5 h-3.5 ${s.iconColor}`} />
                </div>
              </div>
              <span className="text-xl font-extrabold text-primary tracking-tight">{s.value}</span>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Post type pie */}
        <div className="card flex flex-col">
          <div className="card-header">
            <Layers className="w-4 h-4 text-brand" />
            <h3 className="text-sm font-bold text-primary flex-1">Content Type Mix</h3>
          </div>
          {pieData.length > 0 ? (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="55%" height={180}>
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
              <div className="flex flex-col gap-2.5 flex-1">
                {pieData.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="text-xs text-primary font-medium">{item.name}</span>
                    <span className="ml-auto text-xs font-bold text-muted">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[180px] flex items-center justify-center text-xs text-muted">No post data</div>
          )}
        </div>

        {/* Top hashtags */}
        <div className="card flex flex-col">
          <div className="card-header">
            <Hash className="w-4 h-4 text-brand" />
            <h3 className="text-sm font-bold text-primary flex-1">Top Hashtags Used</h3>
          </div>
          {topHashtags.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={topHashtags} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 9, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="tag" tick={{ fontSize: 9, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} width={75} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="count" name="Uses" fill="#833AB4" radius={[0, 4, 4, 0]} opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[180px] flex items-center justify-center text-xs text-muted">No hashtag data</div>
          )}
        </div>
      </div>

      {/* Top performing posts */}
      {topPosts.length > 0 && (
        <div className="card flex flex-col">
          <div className="card-header">
            <Film className="w-4 h-4 text-brand" />
            <h3 className="text-sm font-bold text-primary flex-1">Top Performing Posts</h3>
            <span className="text-[10px] text-muted">By engagement</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {topPosts.map((post, i) => (
              <div key={post.id} className="p-3.5 rounded-xl bg-elevated/40 border border-subtle flex flex-col gap-2 hover:border-default transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider">{post.type}</span>
                  <span className="w-5 h-5 rounded-full bg-brand/10 text-brand text-[9px] font-extrabold flex items-center justify-center">#{i + 1}</span>
                </div>
                <p className="text-xs text-primary line-clamp-2 leading-relaxed min-h-[28px]">
                  {post.caption || '(no caption)'}
                </p>
                <div className="flex items-center gap-3 mt-auto pt-2 border-t border-subtle">
                  <span className="text-[11px] font-bold text-primary flex items-center gap-1">
                    {formatCount(post.likes)} likes
                  </span>
                  <span className="text-[11px] font-bold text-primary flex items-center gap-1">
                    {formatCount(post.comments)} comments
                  </span>
                  <span className="ml-auto text-[10px] text-muted">
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
