'use client';

import React from 'react';
import { FileDown, Calendar, Sparkles, AlertCircle } from 'lucide-react';
import { useAnalysisStore } from '@/store/analysisStore';

interface HeaderProps {
  onExportPdf: () => void;
  isExporting: boolean;
}

export default function Header({ onExportPdf, isExporting }: HeaderProps) {
  const { activeTab, result } = useAnalysisStore();

  const getTitle = () => {
    switch (activeTab) {
      case 'overview': return 'Profile Overview';
      case 'content': return 'Content Performance';
      case 'insights': return 'AI Niche & Insights';
      case 'competitors': return 'Competitive Intelligence';
      case 'calendar': return 'Content Calendar';
      case 'generator': return 'AI Content Script Generator';
      case 'trends': return 'Trend Analysis';
      default: return 'Dashboard';
    }
  };

  return (
    <header className="h-[var(--header-height)] border-b border-subtle bg-surface/30 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-8">
      {/* Tab Title */}
      <div className="flex items-center gap-2">
        <h2 className="text-heading-3 font-extrabold tracking-tight text-primary">
          {getTitle()}
        </h2>
        {result && (
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-gradient/10 border border-brand/20 text-[10px] font-bold text-brand uppercase tracking-wider">
            <Sparkles className="w-3 h-3" /> Live Analysis
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {result && (
          <div className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-elevated/40 border border-subtle text-caption text-muted">
            <Calendar className="w-3.5 h-3.5" />
            <span>Updated: {new Date(result.generatedAt).toLocaleDateString()}</span>
          </div>
        )}

        <button
          onClick={onExportPdf}
          disabled={!result || isExporting}
          className="btn btn-primary btn-sm flex items-center gap-1.5 h-9 px-4 font-bold"
        >
          {isExporting ? (
            <>
              <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Exporting</span>
            </>
          ) : (
            <>
              <FileDown className="w-4 h-4" />
              <span>Export PDF</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
