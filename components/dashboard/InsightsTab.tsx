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

  function getScoreGradient(score: number): string {
    if (score >= 80) return '#22C55E';
    if (score >= 60) return '#84CC16';
    if (score >= 40) return '#F59E0B';
    return '#EF4444';
  }

  const sections = [
    {
      title: 'Strengths',
      icon: TrendingUp,
      color: 'text-green-400',
      border: 'border-green-500/15',
      bg: 'bg-green-500/[0.04]',
      dot: 'bg-green-400',
      badge: 'bg-green-500/12 text-green-400 border-green-500/18',
      items: insights?.strengths ?? [],
    },
    {
      title: 'Weaknesses',
      icon: AlertTriangle,
      color: 'text-amber-400',
      border: 'border-amber-500/15',
      bg: 'bg-amber-500/[0.04]',
      dot: 'bg-amber-400',
      badge: 'bg-amber-500/12 text-amber-400 border-amber-500/18',
      items: insights?.weaknesses ?? [],
    },
    {
      title: 'Opportunities',
      icon: Lightbulb,
      color: 'text-blue-400',
      border: 'border-blue-500/15',
      bg: 'bg-blue-500/[0.04]',
      dot: 'bg-blue-400',
      badge: 'bg-blue-500/12 text-blue-400 border-blue-500/18',
      items: insights?.opportunities ?? [],
    },
    {
      title: 'Threats',
      icon: Shield,
      color: 'text-red-400',
      border: 'border-red-500/15',
      bg: 'bg-red-500/[0.04]',
      dot: 'bg-red-400',
      badge: 'bg-red-500/12 text-red-400 border-red-500/18',
      items: insights?.threats ?? [],
    },
  ];

  const recommendations = insights?.recommendations ?? [];
  const quickWins = insights?.quickWins ?? [];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">

      {/* Radar + overall score */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Radar chart */}
        <div className="card lg:col-span-3 flex flex-col">
          <div className="card-header">
            <Sparkles className="w-4 h-4 text-brand" />
            <h3 className="text-sm font-bold text-primary">Performance Radar</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius={85}>
              <PolarGrid stroke="rgba(255,255,255,0.05)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
              <Radar name="Score" dataKey="value" stroke="#E1306C" fill="#E1306C" fillOpacity={0.15} strokeWidth={2} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 10, fontSize: 12 }}
                formatter={(v: any) => [`${v}%`, 'Score']}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Overall score + niche */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="card flex flex-col items-center justify-center gap-3 py-8">
            <div className="relative w-28 h-28">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 112 112">
                <circle cx="56" cy="56" r="48" stroke="rgba(255,255,255,0.04)" fill="none" strokeWidth="7" />
                <circle cx="56" cy="56" r="48" fill="none" strokeWidth="7"
                  stroke={getScoreGradient(overallScore)}
                  strokeDasharray={2 * Math.PI * 48}
                  strokeDashoffset={2 * Math.PI * 48 * (1 - overallScore / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                  style={{ filter: `drop-shadow(0 0 6px ${getScoreGradient(overallScore)}40)` }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-primary">{overallScore}</span>
                <span className="text-[10px] text-muted">/ 100</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-primary">Overall Score</p>
              <p className="text-[10px] text-muted mt-0.5">AI Performance Index</p>
            </div>
          </div>

          {data.contentPillars && data.contentPillars.length > 0 && (
            <div className="card flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Target className="w-3.5 h-3.5 text-brand" />
                <h4 className="text-[11px] font-bold text-primary">Content Pillars</h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {data.contentPillars.map((p: string, i: number) => (
                  <span key={i} className="badge badge-brand">{p}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SWOT grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map((sec, si) => {
          const Icon = sec.icon;
          return (
            <div key={si} className={`card-static border ${sec.border} ${sec.bg} flex flex-col gap-3`}>
              <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                <Icon className={`w-4 h-4 ${sec.color}`} />
                <h4 className="text-xs font-bold text-primary flex-1">{sec.title}</h4>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${sec.badge}`}>
                  {sec.items.length}
                </span>
              </div>
              {sec.items.length > 0 ? (
                <ul className="flex flex-col gap-1.5">
                  {sec.items.slice(0, 4).map((item: string, i: number) => (
                    <li key={i} className="text-xs text-primary/90 leading-relaxed flex items-start gap-2">
                      <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${sec.dot}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted italic">No data available</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick wins */}
      {quickWins.length > 0 && (
        <div className="card flex flex-col">
          <div className="card-header">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-primary flex-1">Quick Wins</h3>
            <span className="text-[10px] text-muted">Actions this week</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {quickWins.slice(0, 6).map((win: string, i: number) => (
              <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/[0.04] border border-amber-500/10">
                <span className="w-5 h-5 rounded-full bg-amber-500/15 text-amber-400 text-[9px] font-extrabold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                <p className="text-xs text-primary/90 leading-relaxed">{win}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full recommendations */}
      {recommendations.length > 0 && (
        <div className="card flex flex-col">
          <div className="card-header">
            <Lightbulb className="w-4 h-4 text-brand" />
            <h3 className="text-sm font-bold text-primary">AI Recommendations</h3>
          </div>
          <div className="flex flex-col gap-2">
            {recommendations.slice(0, 8).map((rec: string, i: number) => (
              <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-elevated/30 border border-subtle">
                <span className="w-5 h-5 rounded-full bg-brand/12 text-brand text-[9px] font-extrabold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                <p className="text-xs text-primary/90 leading-relaxed">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
