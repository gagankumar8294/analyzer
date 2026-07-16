'use client';

import React from 'react';
import { 
  Sparkles,
  LayoutDashboard,
  BarChart3,
  Brain,
  Users2,
  ListTodo,
  CalendarDays,
  PenTool,
  TrendingUp,
  LogOut
} from 'lucide-react';
import { useAnalysisStore } from '@/store/analysisStore';

interface SidebarProps {
  onBack: () => void;
}

export default function Sidebar({ onBack }: SidebarProps) {
  const { activeTab, setActiveTab, result } = useAnalysisStore();

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'content', label: 'Content Analysis', icon: BarChart3 },
    { id: 'insights', label: 'AI Insights', icon: Brain },
    // { id: 'competitors', label: 'Competitors', icon: Users2 },
    { id: 'action', label: 'Action Plan', icon: ListTodo },
    { id: 'calendar', label: 'Content Calendar', icon: CalendarDays },
    { id: 'generator', label: 'AI Generator', icon: PenTool },
    { id: 'trends', label: 'Trend Intelligence', icon: TrendingUp },
  ];

  const profile = result?.profile;

  return (
    <aside
      className="hidden lg:flex flex-col justify-between h-screen sticky top-0 shrink-0"
      style={{
        width: 'var(--sidebar-width)',
        borderRight: '1px solid var(--border-default)',
        background: 'var(--bg-surface)',
      }}
    >
      <div className="flex flex-col">
        <div
          className="flex items-center gap-3 px-6"
          style={{ height: 'var(--header-height)', borderBottom: '1px solid var(--border-subtle)' }}
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-brand)', boxShadow: 'var(--shadow-brand)' }}>
            <Sparkles className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-bold text-sm gradient-text">InstaAnalyzer</span>
        </div>

        <div className="p-5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          {profile ? (
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.profilePicUrl || '/placeholder-avatar.png'}
                alt={profile.fullName || profile.username}
                className="w-10 h-10 rounded-full object-cover"
                style={{ border: '2px solid var(--border-default)' }}
              />
              <div className="min-w-0">
                <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                  {profile.fullName || profile.username}
                </p>
                <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                  @{profile.username}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3 rounded-xl animate-pulse" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
              <div className="w-10 h-10 rounded-full" style={{ background: 'var(--bg-hover)' }} />
              <div className="flex-1 flex flex-col gap-2">
                <div className="h-3 w-20 rounded" style={{ background: 'var(--bg-hover)' }} />
                <div className="h-2 w-12 rounded" style={{ background: 'var(--bg-hover)' }} />
              </div>
            </div>
          )}
        </div>

        <nav className="p-4 flex flex-col gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{
                  background: isActive ? 'rgba(99,102,241,0.1)' : 'transparent',
                  border: isActive ? '1px solid rgba(99,102,241,0.2)' : '1px solid transparent',
                  color: isActive ? 'var(--brand-primary)' : 'var(--text-secondary)',
                }}
              >
                <Icon className="w-4.5 h-4.5" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-5" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <button
          onClick={onBack}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
          style={{ color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-elevated)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
        >
          <LogOut className="w-4 h-4 rotate-180" />
          Exit Analysis
        </button>
      </div>
    </aside>
  );
}
