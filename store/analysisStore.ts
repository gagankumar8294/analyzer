import { create } from 'zustand';
import type { AnalysisResult } from '@/lib/types/analysis';
import type { CompetitorData } from '@/lib/types/competitor';
import type { CalendarDay } from '@/lib/types/analysis';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface AnalysisStore {
  status: Status;
  username: string;
  result: AnalysisResult | null;
  error: string | null;
  activeTab: string;

  // On-demand Competitor Intelligence state
  compIntelStatus: Status;
  compIntelError: string | null;
  compIntelData: CompetitorData[] | null;

  // On-demand Calendar state
  calendarStatus: Status;
  calendarError: string | null;
  calendarData: CalendarDay[] | null;

  setUsername: (u: string) => void;
  setStatus: (s: Status) => void;
  setResult: (r: AnalysisResult) => void;
  setError: (e: string | null) => void;
  setActiveTab: (t: string) => void;
  
  fetchCompIntel: () => Promise<void>;
  fetchCalendar: () => Promise<void>;
  updateCalendarItem: (index: number, updatedItem: any) => void;
  reset: () => void;
}

export const useAnalysisStore = create<AnalysisStore>((set, get) => ({
  status: 'idle',
  username: '',
  result: null,
  error: null,
  activeTab: 'overview',

  compIntelStatus: 'idle',
  compIntelError: null,
  compIntelData: null,

  calendarStatus: 'idle',
  calendarError: null,
  calendarData: null,

  setUsername: (username) => set({ username }),
  setStatus: (status) => set({ status }),
  setResult: (result) => set({ 
    result, 
    status: 'success',
    // Reset on-demand slices when a new analysis is loaded
    compIntelStatus: 'idle',
    compIntelError: null,
    compIntelData: null,
    calendarStatus: 'idle',
    calendarError: null,
    calendarData: null
  }),
  setError: (error) => set({ error, status: 'error' }),
  setActiveTab: (activeTab) => set({ activeTab }),

  fetchCompIntel: async () => {
    const { result, compIntelStatus } = get();
    if (!result || compIntelStatus === 'loading' || compIntelStatus === 'success') return;

    set({ compIntelStatus: 'loading', compIntelError: null });

    try {
      const response = await fetch('/api/competitors/deep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: result.profile,
          competitors: result.competitors
        })
      });

      if (!response.ok) {
        throw new Error('Failed to load enriched competitor intelligence.');
      }

      const data = await response.json();
      set({ 
        compIntelData: data.competitors, 
        compIntelStatus: 'success' 
      });
    } catch (err: any) {
      console.error('fetchCompIntel error:', err);
      set({ compIntelStatus: 'error', compIntelError: err.message });
    }
  },

  fetchCalendar: async () => {
    const { result, calendarStatus } = get();
    if (!result || calendarStatus === 'loading' || calendarStatus === 'success') return;

    set({ calendarStatus: 'loading', calendarError: null });

    try {
      const response = await fetch('/api/calendar/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: result.profile,
          insights: result.insights
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate your content calendar.');
      }

      const data = await response.json();
      set({ 
        calendarData: data.calendar, 
        calendarStatus: 'success' 
      });
    } catch (err: any) {
      console.error('fetchCalendar error:', err);
      set({ calendarStatus: 'error', calendarError: err.message });
    }
  },

  updateCalendarItem: (index, updatedItem) => set((state) => {
    const currentCalendar = state.calendarData;
    if (!currentCalendar) return state;
    const nextCalendar = [...currentCalendar];
    nextCalendar[index] = { ...nextCalendar[index], ...updatedItem };
    return { calendarData: nextCalendar };
  }),

  reset: () => set({ 
    status: 'idle', 
    result: null, 
    error: null, 
    username: '',
    compIntelStatus: 'idle',
    compIntelError: null,
    compIntelData: null,
    calendarStatus: 'idle',
    calendarError: null,
    calendarData: null
  }),
}));
