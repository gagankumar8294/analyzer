'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, BarChart3, Brain,
  Users2, CalendarDays, FileDown,
  ArrowLeft, Sparkles, Download, Loader2,
  CheckSquare, PenTool, TrendingUp
} from 'lucide-react';
import { useAnalysisStore } from '@/store/analysisStore';
import { OverviewSkeleton, ContentSkeleton, GeneralSkeleton } from '../ui/Loader';

interface DashboardShellProps {
  children?: React.ReactNode;
}

const NAV_SECTIONS = [
  {
    label: 'Analytics',
    items: [
      { id: 'overview',     label: 'Overview',     icon: LayoutDashboard },
      { id: 'content',      label: 'Content',      icon: BarChart3       },
      { id: 'insights',     label: 'AI Insights',  icon: Brain           },
      { id: 'competitors',  label: 'Competitors',  icon: Users2          },
    ],
  },
  {
    label: 'Strategy',
    items: [
      { id: 'calendar',     label: 'Planner',      icon: CalendarDays    },
      { id: 'action',       label: 'Action Plan',  icon: CheckSquare     },
      { id: 'generator',    label: 'Generator',    icon: PenTool         },
      { id: 'trends',       label: 'Trends',       icon: TrendingUp      },
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
    <div className="min-h-screen bg-background text-primary flex">

      {/* ── Sidebar (desktop) ─────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-[260px] border-r border-subtle shrink-0 sticky top-0 h-screen overflow-y-auto"
        style={{ background: 'var(--gradient-sidebar)' }}>

        {/* Logo */}
        <div className="px-5 py-4 border-b border-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center shadow-brand">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm gradient-text leading-none">InstaAnalyzer</span>
              <span className="text-[9px] text-muted font-medium mt-0.5">Instagram Growth Suite</span>
            </div>
          </div>
        </div>

        {/* Profile card */}
        {result?.profile && (
          <div className="px-4 pt-4 pb-2">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-elevated/60 border border-subtle relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-brand/5 to-transparent pointer-events-none" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.profile.profilePicUrl || '/placeholder-avatar.png'}
                alt={result.profile.username}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-brand/20 relative z-10"
                onError={e => { (e.target as HTMLImageElement).src = '/placeholder-avatar.png'; }}
              />
              <div className="min-w-0 relative z-10">
                <p className="text-xs font-bold text-primary truncate">{result.profile.fullName || result.profile.username}</p>
                <p className="text-[10px] text-muted truncate">@{result.profile.username}</p>
              </div>
            </div>
          </div>
        )}

        {/* Nav sections */}
        <nav className="flex-1 px-3 py-2">
          {NAV_SECTIONS.map((section, si) => (
            <div key={si}>
              <p className="sidebar-section-label">{section.label}</p>
              <div className="flex flex-col gap-0.5">
                {section.items.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="p-4 border-t border-subtle flex flex-col gap-2">
          <button
            onClick={handleExportPdf}
            disabled={exporting || !result}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-brand-gradient text-white text-xs font-bold shadow-brand hover:opacity-90 transition-all disabled:opacity-30"
          >
            {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            Export PDF
          </button>
          <button
            onClick={handleBack}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-muted hover:text-primary hover:bg-elevated/50 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            New Analysis
          </button>
        </div>
      </aside>

      {/* ── Main content ──────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top header bar */}
        <header className="sticky top-0 z-30 h-14 border-b border-subtle bg-background/80 backdrop-blur-xl flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-gradient flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            {result?.profile && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-primary hidden sm:block">
                  {result.profile.fullName || result.profile.username}
                </span>
                <span className="text-xs text-muted hidden sm:block">@{result.profile.username}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPdf}
              disabled={exporting || !result}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand-gradient text-white text-xs font-bold shadow-brand hover:opacity-90 transition-all disabled:opacity-30"
            >
              {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              <span className="hidden sm:block">Export PDF</span>
            </button>
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-subtle text-xs font-medium text-muted hover:text-primary hover:bg-elevated/50 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:block">Back</span>
            </button>
          </div>
        </header>

        {/* Mock data warning */}
        {result?.isMock && (
          <div className="bg-amber-500/8 border-b border-amber-500/15 px-6 py-2 text-center text-xs font-semibold text-amber-400 no-print">
            Showing simulated data — Apify token not configured. Add APIFY_TOKEN to .env.local for live data.
          </div>
        )}

        {/* Tab content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            {children ?? renderFallback()}
          </div>
        </main>

        {/* Mobile bottom nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-14 border-t border-subtle bg-surface/95 backdrop-blur-xl flex items-center justify-around z-40 no-print px-1">
          {ALL_NAV.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center gap-0.5 px-1.5 py-1 rounded-lg transition-all ${isActive ? 'text-brand' : 'text-muted'}`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand" />
                  )}
                </div>
                <span className="text-[8px] font-bold leading-none mt-0.5">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
