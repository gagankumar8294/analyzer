'use client';

import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import DashboardShell from '@/components/layout/DashboardShell';
import { useAnalysisStore } from '@/store/analysisStore';
import { useAnalysis } from '@/hooks/useAnalysis';
import ErrorPanel from '@/components/ui/ErrorPanel';
import { OverviewSkeleton, ContentSkeleton, GeneralSkeleton } from '@/components/ui/Loader';

// Lazy-load all tabs
const OverviewTab    = dynamic(() => import('@/components/dashboard/OverviewTab'),    { loading: () => <OverviewSkeleton /> });
const ContentTab     = dynamic(() => import('@/components/dashboard/ContentTab'),     { loading: () => <ContentSkeleton /> });
const InsightsTab    = dynamic(() => import('@/components/dashboard/InsightsTab'),    { loading: () => <GeneralSkeleton /> });
const CompetitorsTab = dynamic(() => import('@/components/dashboard/CompetitorsTab'), { loading: () => <GeneralSkeleton /> });
const CalendarTab    = dynamic(() => import('@/components/dashboard/CalendarTab'),    { loading: () => <GeneralSkeleton /> });
const ReportTab      = dynamic(() => import('@/components/dashboard/ReportTab'),      { loading: () => <GeneralSkeleton /> });
const ActionPlanTab  = dynamic(() => import('@/components/dashboard/ActionPlanTab'),  { loading: () => <GeneralSkeleton /> });
const GeneratorTab   = dynamic(() => import('@/components/dashboard/GeneratorTab'),   { loading: () => <GeneralSkeleton /> });
const TrendsTab      = dynamic(() => import('@/components/dashboard/TrendsTab'),      { loading: () => <GeneralSkeleton /> });

interface Props { params: Promise<{ username: string }>; }

export default function AnalyzePage({ params }: Props) {
  const { username: rawUsername } = React.use(params);
  const username = decodeURIComponent(rawUsername);

  const { status, result, error, activeTab, reset } = useAnalysisStore();
  const { analyze } = useAnalysis();
  const fetched = useRef(false);

  useEffect(() => {
    if (username && !result && status === 'idle' && !fetched.current) {
      fetched.current = true;
      analyze(username);
    }
  }, [username, result, status, analyze]);

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
      switch (activeTab) {
        case 'overview':    return <OverviewTab    data={result} />;
        case 'content':     return <ContentTab     data={result} />;
        case 'insights':    return <InsightsTab    data={result} />;
        case 'competitors': return <CompetitorsTab data={result} />;
        case 'calendar':    return <CalendarTab    data={result} />;
        case 'action':      return <ActionPlanTab  data={result} />;
        case 'generator':   return <GeneratorTab />;
        case 'trends':      return <TrendsTab      data={result} />;
        case 'report':      return <ReportTab      data={result} />;
        default:            return <OverviewTab    data={result} />;
      }
    }

    return <OverviewSkeleton />;
  };

  return <DashboardShell>{renderContent()}</DashboardShell>;
}
