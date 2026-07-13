'use client';

import React from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip
} from 'recharts';
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, Shield, Target, Zap } from 'lucide-react';
import type { AnalysisResult } from '@/lib/types/analysis';

interface Props { data: AnalysisResult; }

export default function InsightsTab({ data }: Props) {
  const { scores, insights } = data;

  const radarData = [
    { subject: 'Engagement',   value: scores.engagement         ?? 0 },
    { subject: 'Branding',     value: scores.branding           ?? 0 },
    { subject: 'SEO & Tags',   value: scores.seo                ?? 0 },
    { subject: 'Consistency',  value: scores.postingConsistency ?? 0 },
    { subject: 'Growth',       value: scores.growth             ?? Math.round(((scores.engagement ?? 0) + (scores.postingConsistency ?? 0)) / 2) },
    { subject: 'Audience',     value: scores.audienceTargeting   ?? Math.round(((scores.engagement ?? 0) + (scores.seo ?? 0)) / 2) },
  ];

  const overallScore = Math.round(radarData.reduce((s, d) => s + d.value, 0) / radarData.length);

  function getScoreColor(score: number): string {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#84cc16';
    if (score >= 40) return '#eab308';
    return '#ef4444';
  }

  const sections = [
    {
      title: 'Strengths',
      icon: TrendingUp,
      color: '#22c55e',
      items: insights?.strengths ?? [],
    },
    {
      title: 'Weaknesses',
      icon: AlertTriangle,
      color: '#eab308',
      items: insights?.weaknesses ?? [],
    },
    {
      title: 'Opportunities',
      icon: Lightbulb,
      color: '#3b82f6',
      items: insights?.opportunities ?? [],
    },
    {
      title: 'Threats',
      icon: Shield,
      color: '#ef4444',
      items: insights?.threats ?? [],
    },
  ];

  const recommendations = insights?.recommendations ?? [];
  const quickWins = insights?.quickWins ?? [];

  return (
    <div className="flex flex-col gap-8 animate-fade-in">

      {/* Radar + overall score */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        <div className="card lg:col-span-3 flex flex-col">
          <div className="card-header">
            <Sparkles className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />
            <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Performance Radar</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius={85}>
              <PolarGrid stroke="rgba(255,255,255,0.05)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
              <Radar name="Score" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={2} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 12, fontSize: 12 }}
                formatter={(v: any) => [`${v}%`, 'Score']}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="card flex flex-col items-center justify-center gap-4 py-8">
            <div className="relative w-28 h-28">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 112 112">
                <circle cx="56" cy="56" r="48" stroke="rgba(255,255,255,0.04)" fill="none" strokeWidth="7" />
                <circle cx="56" cy="56" r="48" fill="none" strokeWidth="7"
                  stroke={getScoreColor(overallScore)}
                  strokeDasharray={2 * Math.PI * 48}
                  strokeDashoffset={2 * Math.PI * 48 * (1 - overallScore / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold" style={{ color: 'var(--text-primary)' }}>{overallScore}</span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>/ 100</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Overall Score</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>AI Performance Index</p>
            </div>
          </div>

          {data.contentPillars && data.contentPillars.length > 0 && (
            <div className="card flex flex-col gap-3.5">
              <div className="flex items-center gap-2.5">
                <Target className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />
                <h4 className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Content Pillars</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.contentPillars.map((p: string, i: number) => (
                  <span key={i} className="badge badge-brand">{p}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SWOT grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {sections.map((sec, si) => {
          const Icon = sec.icon;
          return (
            <div key={si} className="card-static flex flex-col gap-3.5" style={{ borderColor: `${sec.color}20` }}>
              <div className="flex items-center gap-2.5 pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <Icon className="w-4 h-4" style={{ color: sec.color }} />
                <h4 className="text-sm font-bold flex-1" style={{ color: 'var(--text-primary)' }}>{sec.title}</h4>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full" style={{ background: `${sec.color}12`, color: sec.color, border: `1px solid ${sec.color}25` }}>
                  {sec.items.length}
                </span>
              </div>
              {sec.items.length > 0 ? (
                <ul className="flex flex-col gap-2">
                  {sec.items.slice(0, 4).map((item: string, i: number) => (
                    <li key={i} className="text-sm leading-relaxed flex items-start gap-2.5" style={{ color: 'var(--text-secondary)' }}>
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: sec.color }} />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm italic" style={{ color: 'var(--text-muted)' }}>No data available</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick wins */}
      {quickWins.length > 0 && (
        <div className="card flex flex-col">
          <div className="card-header">
            <Zap className="w-4 h-4" style={{ color: '#eab308' }} />
            <h3 className="text-sm font-bold flex-1" style={{ color: 'var(--text-primary)' }}>Quick Wins</h3>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Actions this week</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickWins.slice(0, 6).map((win: string, i: number) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl" style={{ background: 'rgba(234,179,8,0.03)', border: '1px solid rgba(234,179,8,0.1)' }}>
                <span className="w-6 h-6 rounded-full text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'rgba(234,179,8,0.1)', color: '#eab308' }}>{i + 1}</span>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{win}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full recommendations */}
      {recommendations.length > 0 && (
        <div className="card flex flex-col">
          <div className="card-header">
            <Lightbulb className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />
            <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>AI Recommendations</h3>
          </div>
          <div className="flex flex-col gap-3">
            {recommendations.slice(0, 8).map((rec: string, i: number) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                <span className="w-6 h-6 rounded-full text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--brand-primary)' }}>{i + 1}</span>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
