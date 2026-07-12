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
    { id: 'competitors', label: 'Competitors', icon: Users2 },
    { id: 'action', label: 'Action Plan', icon: ListTodo },
    { id: 'calendar', label: 'Content Calendar', icon: CalendarDays },
    { id: 'generator', label: 'AI Generator', icon: PenTool },
    { id: 'trends', label: 'Trend Intelligence', icon: TrendingUp },
  ];

  const profile = result?.profile;

  return (
    <aside className="hidden lg:flex w-[var(--sidebar-width)] border-r border-default bg-surface flex-col justify-between h-screen sticky top-0 shrink-0">
      {/* Top Section */}
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="h-[var(--header-height)] flex items-center gap-2 px-6 border-b border-subtle">
          <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center shadow-brand">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-body-sm tracking-tight bg-brand-gradient-animated bg-clip-text text-transparent">
            InstaAnalyzer
          </span>
        </div>

        {/* Profile Card Summary */}
        <div className="p-4 border-b border-subtle">
          {profile ? (
            <div className="flex items-center gap-3 p-2 rounded-lg bg-elevated/40 border border-subtle">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.profilePicUrl || '/placeholder-avatar.png'}
                alt={profile.fullName || profile.username}
                className="w-10 h-10 rounded-full object-cover border border-brand/30"
              />
              <div className="min-w-0">
                <p className="text-body-sm font-bold text-primary truncate">
                  {profile.fullName || profile.username}
                </p>
                <p className="text-caption text-muted truncate">
                  @{profile.username}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-2 rounded-lg bg-elevated/40 border border-subtle animate-pulse">
              <div className="w-10 h-10 rounded-full bg-hover" />
              <div className="flex-1 flex flex-col gap-1.5">
                <div className="h-3 w-20 bg-hover rounded" />
                <div className="h-2 w-12 bg-hover rounded" />
              </div>
            </div>
          )}
        </div>

        {/* Menu Navigation */}
        <nav className="p-3 flex flex-col gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-sm font-semibold transition-all duration-200
                  ${isActive 
                    ? 'bg-brand-gradient/10 border border-brand/20 text-brand' 
                    : 'text-muted hover:text-primary hover:bg-elevated/50 border border-transparent'}
                `}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-brand' : 'text-muted'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Back Button */}
      <div className="p-4 border-t border-subtle">
        <button
          onClick={onBack}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-body-sm font-semibold text-muted hover:text-primary hover:bg-elevated/50 transition-all border border-subtle"
        >
          <LogOut className="w-4 h-4 rotate-180" />
          Exit Analysis
        </button>
      </div>
    </aside>
  );
}
