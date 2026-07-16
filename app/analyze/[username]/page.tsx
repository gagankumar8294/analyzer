'use client';

import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import DashboardShell from '@/components/layout/DashboardShell';
import { useAnalysisStore } from '@/store/analysisStore';
import { useAnalysis } from '@/hooks/useAnalysis';
import ErrorPanel from '@/components/ui/ErrorPanel';
import { OverviewSkeleton, ContentSkeleton, GeneralSkeleton } from '@/components/ui/Loader';
import ProgressOverlay from '@/components/ui/ProgressOverlay';

// Lazy-load all tabs
const OverviewTab    = dynamic(() => import('@/components/dashboard/OverviewTab'),    { loading: () => <OverviewSkeleton /> });
const ContentTab     = dynamic(() => import('@/components/dashboard/ContentTab'),     { loading: () => <ContentSkeleton /> });
const InsightsTab    = dynamic(() => import('@/components/dashboard/InsightsTab'),    { loading: () => <GeneralSkeleton /> });
// const CompetitorsTab = dynamic(() => import('@/components/dashboard/CompetitorsTab'), { loading: () => <GeneralSkeleton /> });
const CalendarTab    = dynamic(() => import('@/components/dashboard/CalendarTab'),    { loading: () => <GeneralSkeleton /> });
const ReportTab      = dynamic(() => import('@/components/dashboard/ReportTab'),      { loading: () => <GeneralSkeleton /> });
const ActionPlanTab  = dynamic(() => import('@/components/dashboard/ActionPlanTab'),  { loading: () => <GeneralSkeleton /> });
const GeneratorTab   = dynamic(() => import('@/components/dashboard/GeneratorTab'),   { loading: () => <GeneralSkeleton /> });
const TrendsTab      = dynamic(() => import('@/components/dashboard/TrendsTab'),      { loading: () => <GeneralSkeleton /> });

// Competitor Intel sub-tabs
const CompIntelOverviewTab = dynamic(() => import('@/components/dashboard/CompIntelOverviewTab'), { loading: () => <GeneralSkeleton /> });
const CompIntelContentTab  = dynamic(() => import('@/components/dashboard/CompIntelContentTab'),  { loading: () => <GeneralSkeleton /> });
const CompIntelGapsTab     = dynamic(() => import('@/components/dashboard/CompIntelGapsTab'),     { loading: () => <GeneralSkeleton /> });
const CompIntelStrategyTab = dynamic(() => import('@/components/dashboard/CompIntelStrategyTab'), { loading: () => <GeneralSkeleton /> });

interface Props { params: Promise<{ username: string }>; }

export default function AnalyzePage({ params }: Props) {
  const { username: rawUsername } = React.use(params);
  const username = decodeURIComponent(rawUsername);

  const { 
    status, 
    result, 
    error, 
    activeTab, 
    reset,
    compIntelStatus,
    fetchCompIntel,
    calendarStatus,
    fetchCalendar
  } = useAnalysisStore();

  const { analyze } = useAnalysis();
  const fetched = useRef(false);

  useEffect(() => {
    if (username && !result && status === 'idle' && !fetched.current) {
      fetched.current = true;
      analyze(username);
    }
  }, [username, result, status, analyze]);

  // Trigger on-demand fetching when tab swaps to competitor intel or calendar planner
  useEffect(() => {
    if (status === 'success') {
      if (['comp-overview', 'comp-content', 'comp-gaps', 'comp-strategy'].includes(activeTab)) {
        fetchCompIntel();
      } else if (activeTab === 'calendar') {
        fetchCalendar();
      }
    }
  }, [activeTab, status, fetchCompIntel, fetchCalendar]);

  const renderContent = () => {
    if (status === 'loading') {
      return activeTab === 'overview' ? <OverviewSkeleton /> : activeTab === 'content' ? <ContentSkeleton /> : <GeneralSkeleton />;
    }

    if (status === 'error' && error) {
      return (
        <div className="py-8">
          <ErrorPanel
            error={error}
            onRetry={() => { fetched.current = false; reset(); analyze(username); }}
            onReset={() => { reset(); window.location.href = '/'; }}
            onDemoMode={() => { fetched.current = false; reset(); analyze(username, { useMock: true }); }}
          />
        </div>
      );
    }

    if (status === 'success' && result) {
      // 1. Show skeleton for competitor intel tabs if fetching
      if (['comp-overview', 'comp-content', 'comp-gaps', 'comp-strategy'].includes(activeTab) && compIntelStatus === 'loading') {
        return <GeneralSkeleton />;
      }

      // 2. Show skeleton for calendar tab if generating
      if (activeTab === 'calendar' && calendarStatus === 'loading') {
        return <GeneralSkeleton />;
      }

      switch (activeTab) {
        case 'overview':       return <OverviewTab    data={result} />;
        case 'content':        return <ContentTab     data={result} />;
        case 'insights':       return <InsightsTab    data={result} />;
        // case 'competitors':    return <CompetitorsTab data={result} />;
        case 'calendar':       return <CalendarTab    data={result} />;
        case 'action':         return <ActionPlanTab  data={result} />;
        case 'generator':      return <GeneratorTab />;
        case 'trends':         return <TrendsTab      data={result} />;
        case 'report':         return <ReportTab      data={result} />;
        // Competitor Intel sub-tabs
        case 'comp-overview':  return <CompIntelOverviewTab data={result} />;
        case 'comp-content':   return <CompIntelContentTab  data={result} />;
        case 'comp-gaps':      return <CompIntelGapsTab     data={result} />;
        case 'comp-strategy':  return <CompIntelStrategyTab data={result} />;
        default:               return <OverviewTab    data={result} />;
      }
    }

    return <OverviewSkeleton />;
  };



  return (
    <>
      <DashboardShell>{renderContent()}</DashboardShell>
      <ProgressOverlay
        isVisible={status === 'loading'}
        username={username}
      />
    </>
  );
}
