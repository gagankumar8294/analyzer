'use client';

import React from 'react';
import { ArrowUpDown, ShieldAlert, Award, Star, Compass } from 'lucide-react';
import type { AnalysisResult } from '@/lib/types/analysis';
import { formatCount } from '@/lib/utils/engagement';
import { useAnalysisStore } from '@/store/analysisStore';

interface Props { data: AnalysisResult; }

export default function CompIntelGapsTab({ data }: Props) {
  const { compIntelData } = useAnalysisStore();
  const competitors: any[] = compIntelData ?? data.competitors ?? [];

  if (!competitors.length) {
    return (
      <div className="flex flex-col items-center justify-center py-28 gap-5 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
          <ArrowUpDown className="w-8 h-8" style={{ color: 'var(--text-muted)' }} />
        </div>
        <div>
          <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>No comparison metrics yet</p>
          <p className="text-sm mt-1.5 max-w-sm" style={{ color: 'var(--text-muted)' }}>Gap auditing requires competitors lists from AI audits.</p>
        </div>
      </div>
    );
  }

  // Calculate your own stats for comparison
  const yourER = data.profile.followers > 0 
    ? Number((((data.posts.reduce((acc, p) => acc + p.likes + p.comments, 0) / data.posts.length) / data.profile.followers) * 100).toFixed(2)) 
    : 0;

  const yourAvgLikes = data.posts.length > 0
    ? Math.round(data.posts.reduce((acc, p) => acc + p.likes, 0) / data.posts.length)
    : 0;

  const yourReels = data.posts.filter(p => p.type === 'REEL');
  const yourAvgViews = yourReels.length > 0
    ? Math.round(yourReels.reduce((acc, p) => acc + (p.views || 0), 0) / yourReels.length)
    : 0;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Overview Table */}
      <div className="card overflow-hidden">
        <div className="card-header">
          <ArrowUpDown className="w-4.5 h-4.5" style={{ color: '#fb923c' }} />
          <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Side-by-Side Niche Gap Audit</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)' }}>
                <th className="p-4 font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)', width: '25%' }}>Metrics / Gaps</th>
                <th className="p-4 font-bold uppercase tracking-wider text-indigo-400" style={{ width: '25%' }}>Your Account (@{data.profile.username})</th>
                {competitors.slice(0, 2).map((comp: any, idx: number) => (
                  <th key={idx} className="p-4 font-bold uppercase tracking-wider" style={{ color: '#fb923c', width: '25%' }}>
                    Competitor (@{comp.username ?? comp.handle})
                  </th>
                ))}
              </tr>
            </thead>
            <tbody style={{ color: 'var(--text-primary)' }}>
              
              {/* Followers */}
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td className="p-4 font-semibold" style={{ color: 'var(--text-secondary)' }}>Follower Pool</td>
                <td className="p-4 font-bold">{formatCount(data.profile.followers)}</td>
                {competitors.slice(0, 2).map((comp: any, idx: number) => {
                  const val = comp.followers ?? 0;
                  const win = val < data.profile.followers;
                  return (
                    <td key={idx} className="p-4 font-bold">
                      <span className="flex items-center gap-1.5">
                        {formatCount(val)}
                        {win ? (
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-bold" style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80' }}>WIN</span>
                        ) : (
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-bold" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}>BEHIND</span>
                        )}
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* Engagement Rate */}
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td className="p-4 font-semibold" style={{ color: 'var(--text-secondary)' }}>Engagement Rate</td>
                <td className="p-4 font-bold text-indigo-400">{yourER}%</td>
                {competitors.slice(0, 2).map((comp: any, idx: number) => {
                  const val = comp.engagementRate ?? 0;
                  const win = yourER >= val;
                  return (
                    <td key={idx} className="p-4 font-bold">
                      <span className="flex items-center gap-1.5">
                        {val}%
                        {win ? (
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-bold" style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80' }}>WIN</span>
                        ) : (
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-bold" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}>BEHIND</span>
                        )}
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* Avg Likes */}
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td className="p-4 font-semibold" style={{ color: 'var(--text-secondary)' }}>Avg Post Likes</td>
                <td className="p-4 font-bold">{formatCount(yourAvgLikes)}</td>
                {competitors.slice(0, 2).map((comp: any, idx: number) => {
                  const val = comp.avgLikes ?? 0;
                  const win = yourAvgLikes >= val;
                  return (
                    <td key={idx} className="p-4 font-bold">
                      <span className="flex items-center gap-1.5">
                        {formatCount(val)}
                        {win ? (
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-bold" style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80' }}>WIN</span>
                        ) : (
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-bold" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}>BEHIND</span>
                        )}
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* Avg Reel Views */}
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td className="p-4 font-semibold" style={{ color: 'var(--text-secondary)' }}>Avg Reel Views</td>
                <td className="p-4 font-bold">{formatCount(yourAvgViews)}</td>
                {competitors.slice(0, 2).map((comp: any, idx: number) => {
                  const val = comp.avgReelViews ?? 0;
                  const win = yourAvgViews >= val;
                  return (
                    <td key={idx} className="p-4 font-bold">
                      <span className="flex items-center gap-1.5">
                        {formatCount(val)}
                        {win ? (
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-bold" style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80' }}>WIN</span>
                        ) : (
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-bold" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}>BEHIND</span>
                        )}
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* Frequency */}
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td className="p-4 font-semibold" style={{ color: 'var(--text-secondary)' }}>Posting Frequency</td>
                <td className="p-4 font-bold">3-4x per week</td>
                {competitors.slice(0, 2).map((comp: any, idx: number) => (
                  <td key={idx} className="p-4 font-bold text-orange-200">
                    {comp.postingFrequency || '3x per week'}
                  </td>
                ))}
              </tr>

              {/* Saves Rate */}
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td className="p-4 font-semibold" style={{ color: 'var(--text-secondary)' }}>Est Saves Rate</td>
                <td className="p-4 font-bold">0.4%</td>
                {competitors.slice(0, 2).map((comp: any, idx: number) => (
                  <td key={idx} className="p-4 font-bold">
                    {comp.avgSavesRate ?? '0.5'}%
                  </td>
                ))}
              </tr>

              {/* Caption Style */}
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td className="p-4 font-semibold" style={{ color: 'var(--text-secondary)' }}>Caption Strategy</td>
                <td className="p-4 font-bold text-indigo-300">Descriptive with tags</td>
                {competitors.slice(0, 2).map((comp: any, idx: number) => (
                  <td key={idx} className="p-4 font-bold truncate max-w-[180px]" style={{ color: 'var(--text-muted)' }}>
                    {comp.captionStyle || 'N/A'}
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>
      </div>

      {/* Critical Gap Matrix cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="card flex flex-col gap-3" style={{ borderLeft: '3px solid #f87171' }}>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-400" />
            <h4 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Algorithm Risks (Gaps to close)</h4>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Your account lags in these areas, causing competitors to capture niche search impressions and viral hooks first. Address these in your action planner:
          </p>
          <ul className="flex flex-col gap-2 mt-2">
            {competitors.map((c: any, idx: number) => (
              <li key={idx} className="text-xs flex items-start gap-2" style={{ color: 'var(--text-secondary)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                <span>
                  <strong>@{c.username ?? c.handle}</strong>: {c.gapVsTarget?.[0] || 'Posts more reels regularly to gain larger viewer counts.'}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card flex flex-col gap-3" style={{ borderLeft: '3px solid #4ade80' }}>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-green-400" />
            <h4 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Your Advantage Areas</h4>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Maximize these strengths in your daily posts. Competitors do not perform as well in these areas, offering you space to stand out:
          </p>
          <ul className="flex flex-col gap-2 mt-2">
            <li className="text-xs flex items-start gap-2" style={{ color: 'var(--text-secondary)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 shrink-0" />
              <span><strong>Community trust</strong>: High likes-to-comments engagement ratios indicates high audience loyalty.</span>
            </li>
            <li className="text-xs flex items-start gap-2" style={{ color: 'var(--text-secondary)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 shrink-0" />
              <span><strong>SEO-rich tags</strong>: Captions contain relevant long-tail niche keywords matching target search intent.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
