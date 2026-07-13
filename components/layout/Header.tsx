'use client';

import React from 'react';
import { FileDown, Calendar, Sparkles } from 'lucide-react';
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
    <header
      className="flex items-center justify-between px-8"
      style={{
        height: 'var(--header-height)',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(24,24,27,0.6)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
          {getTitle()}
        </h2>
        {result && (
          <span
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase"
            style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', color: 'var(--brand-primary)', letterSpacing: '0.05em' }}
          >
            <Sparkles className="w-3 h-3" /> Live Analysis
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        {result && (
          <div
            className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Updated: {new Date(result.generatedAt).toLocaleDateString()}</span>
          </div>
        )}

        <button
          onClick={onExportPdf}
          disabled={!result || isExporting}
          className="btn btn-primary btn-sm flex items-center gap-2 h-10 px-5 font-bold"
        >
          {isExporting ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
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
