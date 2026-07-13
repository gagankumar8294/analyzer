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
    <div className="flex flex-col gap-8 animate-fade-in">

      <div className="card-brand rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden">
        <div className="flex flex-col gap-3 flex-1 relative">
          <h2 className="text-xl font-extrabold" style={{ color: 'var(--text-primary)' }}>Download Full PDF Report</h2>
          <p className="text-sm leading-relaxed max-w-lg" style={{ color: 'var(--text-secondary)' }}>
            A complete branded report including profile overview, performance scores, AI insights, competitor analysis, and 90-day content plan.
          </p>
          <ul className="flex flex-wrap gap-2 mt-1">
            {['Profile Summary', 'Score Cards', 'SWOT Analysis', 'Competitors', '90-Day Plan', 'AI Recommendations'].map(item => (
              <li key={item} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}>
                <CheckCircle2 className="w-3 h-3" style={{ color: '#4ade80' }} />{item}
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2.5 px-8 py-4 font-bold text-sm rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 relative"
          style={{ background: 'var(--gradient-brand)', color: '#fff', boxShadow: 'var(--shadow-brand)' }}
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

      <div className="card flex flex-col">
        <div className="card-header">
          <Eye className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />
          <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Report Preview</h3>
        </div>

        <div className="flex flex-col gap-3 mb-6">
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>Page 1 — Profile Overview</span>
          <div className="p-5 rounded-xl flex flex-col sm:flex-row gap-6" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={profile.profilePicUrl || '/placeholder-avatar.png'} alt={profile.username}
                className="w-14 h-14 rounded-xl object-cover"
                style={{ border: '2px solid var(--border-default)' }}
                onError={e => { (e.target as HTMLImageElement).src = '/placeholder-avatar.png'; }}
              />
              <div>
                <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{profile.fullName}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>@{profile.username}</p>
                {profile.category && <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--brand-primary)' }}>{profile.category}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1">
              {[
                { l: 'Followers',  v: formatCount(profile.followers) },
                { l: 'Posts',      v: profile.totalPosts },
                { l: 'Eng. Rate',  v: `${er}%` },
                { l: 'Score',      v: `${overallScore}/100` },
              ].map(s => (
                <div key={s.l} className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                  <p className="text-sm font-extrabold" style={{ color: 'var(--text-primary)' }}>{s.v}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 mb-6">
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>Page 2 — AI Insights</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: 'Top Strength', value: insights?.strengths?.[0], color: '#22c55e' },
              { label: 'Key Opportunity', value: insights?.opportunities?.[0], color: '#3b82f6' },
            ].map(item => item.value && (
              <div key={item.label} className="p-4 rounded-xl" style={{ border: `1px solid ${item.color}25`, background: `${item.color}05` }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: item.color, fontSize: '0.65rem' }}>{item.label}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-primary)' }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {data.calendar && data.calendar.length > 0 && (
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>Page 3 — 90-Day Content Plan (sample)</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {data.calendar.slice(0, 3).map((entry, i) => (
                <div key={i} className="p-4 rounded-xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                  <p className="text-xs font-bold mb-1" style={{ color: 'var(--brand-primary)', fontSize: '0.65rem' }}>{entry.week ?? `Day ${i + 1}`}</p>
                  <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{entry.theme}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{entry.contentType}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
