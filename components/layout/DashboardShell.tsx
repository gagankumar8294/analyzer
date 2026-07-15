'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, BarChart3, Brain,
  Users2, CalendarDays,
  ArrowLeft, Sparkles, Download, Loader2,
  CheckSquare, PenTool, TrendingUp,
  Crosshair, Lightbulb, ArrowUpDown, Target
} from 'lucide-react';
import { useAnalysisStore } from '@/store/analysisStore';
import { OverviewSkeleton, ContentSkeleton, GeneralSkeleton } from '../ui/Loader';

interface DashboardShellProps {
  children?: React.ReactNode;
}

const NAV_SECTIONS = [
  {
    label: 'Analytics',
    accent: false,
    items: [
      { id: 'overview',     label: 'Overview',     icon: LayoutDashboard },
      { id: 'content',      label: 'Content',      icon: BarChart3       },
      { id: 'insights',     label: 'AI Insights',  icon: Brain           },
      { id: 'competitors',  label: 'Competitors',  icon: Users2          },
    ],
  },
  {
    label: 'Strategy',
    accent: false,
    items: [
      { id: 'calendar',     label: 'Planner',      icon: CalendarDays    },
      { id: 'action',       label: 'Action Plan',  icon: CheckSquare     },
      { id: 'generator',    label: 'Generator',    icon: PenTool         },
      { id: 'trends',       label: 'Trends',       icon: TrendingUp      },
    ],
  },
  {
    label: '✦ Competitor Intel',
    accent: true,
    items: [
      { id: 'comp-overview', label: 'Profiles',      icon: Crosshair    },
      { id: 'comp-content',  label: 'Content Ideas', icon: Lightbulb    },
      { id: 'comp-gaps',     label: 'Gap Analysis',  icon: ArrowUpDown  },
      { id: 'comp-strategy', label: 'Beat Them',     icon: Target       },
    ],
  },
];


const ALL_NAV = NAV_SECTIONS.flatMap(s => s.items);

export default function DashboardShell({ children }: DashboardShellProps) {
  const router = useRouter();
  const { activeTab, setActiveTab, result, reset } = useAnalysisStore();
  const [exporting, setExporting] = useState(false);

  const handleBack = () => { reset(); router.push('/'); };

  const handleExportPdf = async () => {
    setExporting(true);
    try {
      setActiveTab('report');
    } finally {
      setExporting(false);
    }
  };

  const renderFallback = () => {
    switch (activeTab) {
      case 'overview': return <OverviewSkeleton />;
      case 'content':  return <ContentSkeleton />;
      default:         return <GeneralSkeleton />;
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>

      {/* ── Sidebar (desktop) ─────────────────────────────── */}
      <aside
        className="hidden lg:flex flex-col shrink-0 sticky top-0 h-screen overflow-y-auto"
        style={{
          width: 'var(--sidebar-width)',
          borderRight: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface)',
        }}
      >
        {/* Logo */}
        <div className="px-6 py-5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-brand)', boxShadow: 'var(--shadow-brand)' }}>
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm gradient-text leading-none">InstaAnalyzer</span>
              <span className="text-xs mt-1" style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>Instagram Growth Suite</span>
            </div>
          </div>
        </div>

        {/* Profile card */}
        {result?.profile && (
          <div className="px-5 pt-5 pb-3">
            <div className="flex items-center gap-3 p-3.5 rounded-xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.profile.profilePicUrl || '/placeholder-avatar.png'}
                alt={result.profile.username}
                className="w-10 h-10 rounded-full object-cover shrink-0"
                style={{ border: '2px solid var(--border-default)' }}
                onError={e => { (e.target as HTMLImageElement).src = '/placeholder-avatar.png'; }}
              />
              <div className="min-w-0">
                <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>{result.profile.fullName || result.profile.username}</p>
                <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>@{result.profile.username}</p>
              </div>
            </div>
          </div>
        )}

        {/* Nav sections */}
        <nav className="px-4 py-3 overflow-y-auto flex-1">
          {NAV_SECTIONS.map((section, si) => (
            <div key={si} style={section.accent ? { marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' } : {}}>
              <p
                className="sidebar-section-label"
                style={section.accent ? {
                  background: 'linear-gradient(90deg, #f97316, #fb923c)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                } : {}}
              >
                {section.label}
              </p>
              <div className="flex flex-col gap-1">
                {section.items.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                      style={isActive && section.accent ? {
                        background: 'rgba(249,115,22,0.12)',
                        color: '#f97316',
                        borderColor: 'rgba(249,115,22,0.25)',
                      } : {}}
                    >
                      <Icon className="w-4.5 h-4.5 shrink-0" style={isActive && section.accent ? { color: '#f97316' } : {}} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

          ))}
        </nav>

        {/* Bottom actions */}
        <div className="p-5 mt-auto" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <button
            onClick={handleBack}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-elevated)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
          >
            <ArrowLeft className="w-4 h-4" />
            New Analysis
          </button>
        </div>
      </aside>

      {/* ── Main content ──────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top header bar */}
        <header
          className="sticky top-0 z-30 flex items-center justify-between px-8 shrink-0"
          style={{
            height: 'var(--header-height)',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'rgba(9,9,11,0.85)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div className="flex items-center gap-4">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-brand)' }}>
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            {result?.profile && (
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold hidden sm:block" style={{ color: 'var(--text-primary)' }}>
                  {result.profile.fullName || result.profile.username}
                </span>
                <span className="text-xs hidden sm:block" style={{ color: 'var(--text-muted)' }}>@{result.profile.username}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportPdf}
              disabled={exporting || !result}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all disabled:opacity-30"
              style={{ background: 'var(--gradient-brand)', boxShadow: 'var(--shadow-brand)' }}
            >
              {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span className="hidden sm:block">Export PDF</span>
            </button>
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all"
              style={{ color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-elevated)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:block">Back</span>
            </button>
          </div>
        </header>

        {/* Mock data warning */}
        {result?.isMock && (
          <div className="px-8 py-2.5 text-center text-xs font-semibold no-print" style={{ background: 'rgba(234,179,8,0.06)', borderBottom: '1px solid rgba(234,179,8,0.15)', color: '#facc15' }}>
            Showing simulated data — Apify token not configured. Add APIFY_TOKEN to .env.local for live data.
          </div>
        )}

        {/* Tab content */}
        <main className="flex-1 p-8 md:p-10 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            {children ?? renderFallback()}
          </div>
        </main>

        {/* Mobile bottom nav */}
        <nav
          className="lg:hidden fixed bottom-0 left-0 right-0 flex items-center justify-around z-40 no-print px-2"
          style={{
            height: '64px',
            borderTop: '1px solid var(--border-subtle)',
            background: 'rgba(24,24,27,0.95)',
            backdropFilter: 'blur(16px)',
          }}
        >
          {ALL_NAV.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="flex flex-col items-center justify-center gap-1 px-2 py-1.5 rounded-xl transition-all"
                style={{ color: isActive ? 'var(--brand-primary)' : 'var(--text-muted)' }}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {isActive && (
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ background: 'var(--brand-primary)' }} />
                  )}
                </div>
                <span className="text-xs font-semibold leading-none" style={{ fontSize: '0.6rem' }}>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
