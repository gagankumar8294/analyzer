'use client';

import React from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Hash, Image as ImageIcon, Film, Layers, MessageSquare, BarChart3, Heart } from 'lucide-react';
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
            {topPosts.map((post, i) => {
              const isMock = post.id.startsWith('mock_');
              const postUrl = !isMock && post.shortCode ? `https://www.instagram.com/p/${post.shortCode}/` : null;

              return (
                <div key={post.id} className="card-static p-4 sm:p-5 rounded-2xl flex flex-col gap-3 transition-all hover:scale-[1.01] duration-200" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                  <div className="flex items-center justify-between">
                    <span className="badge badge-brand text-[9px] tracking-widest font-bold uppercase">{post.type}</span>
                    <span className="w-6 h-6 rounded-full text-xs font-extrabold flex items-center justify-center" style={{ background: 'var(--gradient-brand-soft)', border: '1px solid var(--border-brand)', color: 'var(--brand-primary)' }}>#{i + 1}</span>
                  </div>
                  
                  {/* Scrollable caption container */}
                  <div className="max-h-[120px] overflow-y-auto pr-1 flex-1 custom-scrollbar">
                    <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
                      {post.caption || <span className="italic opacity-50">(no caption)</span>}
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-3 mt-auto pt-3.5" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                          <Heart className="w-3.5 h-3.5" style={{ color: 'var(--brand-primary)' }} />
                          <span>{formatCount(post.likes)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                          <MessageSquare className="w-3.5 h-3.5" style={{ color: 'var(--brand-secondary)' }} />
                          <span>{formatCount(post.comments)}</span>
                        </div>
                      </div>
                      
                      <span className="text-[10px] sm:text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                        {new Date(post.timestamp).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    {/* Link to Instagram post if live API data */}
                    {postUrl && (
                      <a 
                        href={postUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold self-start mt-0.5 transition-all hover:opacity-80"
                        style={{ color: 'var(--brand-primary)' }}
                      >
                        <span>View on Instagram</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
