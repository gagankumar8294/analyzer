'use client';

import React, { useState } from 'react';
import { FileDown, Loader2, CheckCircle2, Eye } from 'lucide-react';
import type { AnalysisResult } from '@/lib/types/analysis';
import { formatCount } from '@/lib/utils/engagement';

interface Props { data: AnalysisResult; }

export default function ReportTab({ data }: Props) {
  const [downloading, setDownloading] = useState(false);
  const [done, setDone] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const { pdf } = await import('@react-pdf/renderer');
      const { PdfReport } = await import('@/components/reports/PdfReport');
      const React = (await import('react')).default;

      const blob = await pdf(React.createElement(PdfReport, { data }) as any).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${data.profile.username}-analysis.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('PDF generation failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const { profile, scores, posts, insights } = data;
  const avgEng = posts.length
    ? posts.reduce((s, p) => s + p.likes + p.comments, 0) / posts.length
    : 0;
  const er = profile.followers > 0 ? ((avgEng / profile.followers) * 100).toFixed(2) : '0.00';
  const overallScore = Math.round(
    [scores.engagement, scores.branding, scores.seo, scores.postingConsistency]
      .reduce((a, b) => a + (b ?? 0), 0) / 4
  );

  return (
    <div className="flex flex-col gap-6 animate-fade-in">

      {/* Download CTA card */}
      <div className="card-brand rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-brand/8 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col gap-2 flex-1 relative">
          <h2 className="text-lg font-extrabold text-primary">Download Full PDF Report</h2>
          <p className="text-xs text-muted leading-relaxed max-w-lg">
            A complete branded report including profile overview, performance scores, AI insights, competitor analysis, and 90-day content plan.
          </p>
          <ul className="flex flex-wrap gap-1.5 mt-1">
            {['Profile Summary', 'Score Cards', 'SWOT Analysis', 'Competitors', '90-Day Plan', 'AI Recommendations'].map(item => (
              <li key={item} className="flex items-center gap-1 text-[10px] font-semibold text-primary/80 bg-elevated/50 border border-subtle px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-2.5 h-2.5 text-green-400" />{item}
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2 px-7 py-3.5 bg-brand-gradient text-white font-bold text-sm rounded-xl shadow-brand hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 relative"
        >
          {downloading ? (
            <><Loader2 className="w-4 h-4 animate-spin" />Generating...</>
          ) : done ? (
            <><CheckCircle2 className="w-4 h-4" />Downloaded!</>
          ) : (
            <><FileDown className="w-4 h-4" />Download PDF</>
          )}
        </button>
      </div>

      {/* Preview */}
      <div className="card flex flex-col">
        <div className="card-header">
          <Eye className="w-4 h-4 text-brand" />
          <h3 className="text-sm font-bold text-primary">Report Preview</h3>
        </div>

        {/* Page 1 */}
        <div className="flex flex-col gap-2.5 mb-5">
          <span className="text-[9px] font-bold text-muted uppercase tracking-wider">Page 1 — Profile Overview</span>
          <div className="p-4 rounded-xl bg-elevated/30 border border-subtle flex flex-col sm:flex-row gap-5">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={profile.profilePicUrl || '/placeholder-avatar.png'} alt={profile.username}
                className="w-14 h-14 rounded-xl object-cover ring-2 ring-brand/20"
                onError={e => { (e.target as HTMLImageElement).src = '/placeholder-avatar.png'; }}
              />
              <div>
                <p className="font-bold text-primary text-sm">{profile.fullName}</p>
                <p className="text-[10px] text-muted">@{profile.username}</p>
                {profile.category && <p className="text-[10px] text-brand font-semibold mt-0.5">{profile.category}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 flex-1">
              {[
                { l: 'Followers',  v: formatCount(profile.followers) },
                { l: 'Posts',      v: profile.totalPosts },
                { l: 'Eng. Rate',  v: `${er}%` },
                { l: 'Score',      v: `${overallScore}/100` },
              ].map(s => (
                <div key={s.l} className="p-2.5 rounded-lg bg-surface border border-subtle text-center">
                  <p className="text-sm font-extrabold text-primary">{s.v}</p>
                  <p className="text-[9px] text-muted">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Page 2 — AI Insights */}
        <div className="flex flex-col gap-2.5 mb-5">
          <span className="text-[9px] font-bold text-muted uppercase tracking-wider">Page 2 — AI Insights</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { label: 'Top Strength', value: insights?.strengths?.[0], color: 'text-green-400 border-green-500/15 bg-green-500/[0.04]' },
              { label: 'Key Opportunity', value: insights?.opportunities?.[0], color: 'text-blue-400 border-blue-500/15 bg-blue-500/[0.04]' },
            ].map(item => item.value && (
              <div key={item.label} className={`p-3 rounded-xl border ${item.color}`}>
                <p className={`text-[9px] font-bold uppercase tracking-wider mb-1 ${item.color.split(' ')[0]}`}>{item.label}</p>
                <p className="text-[11px] text-primary leading-relaxed">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Page 3 — Content Plan hint */}
        {data.calendar && data.calendar.length > 0 && (
          <div className="flex flex-col gap-2.5">
            <span className="text-[9px] font-bold text-muted uppercase tracking-wider">Page 3 — 90-Day Content Plan (sample)</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {data.calendar.slice(0, 3).map((entry, i) => (
                <div key={i} className="p-3 rounded-xl bg-elevated/30 border border-subtle">
                  <p className="text-[9px] font-bold text-brand mb-1">{entry.week ?? `Day ${i + 1}`}</p>
                  <p className="text-[11px] font-semibold text-primary">{entry.theme}</p>
                  <p className="text-[9px] text-muted mt-0.5">{entry.contentType}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
