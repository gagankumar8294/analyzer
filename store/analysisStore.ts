import { create } from 'zustand';
import type { AnalysisResult } from '@/lib/types/analysis';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface AnalysisStore {
  status: Status;
  username: string;
  result: AnalysisResult | null;
  error: string | null;
  activeTab: string;
  setUsername: (u: string) => void;
  setStatus: (s: Status) => void;
  setResult: (r: AnalysisResult) => void;
  setError: (e: string | null) => void;
  setActiveTab: (t: string) => void;
  updateCalendarItem: (index: number, updatedItem: any) => void;
  reset: () => void;
}

export const useAnalysisStore = create<AnalysisStore>((set) => ({
  status: 'idle',
  username: '',
  result: null,
  error: null,
  activeTab: 'overview',
  setUsername: (username) => set({ username }),
  setStatus: (status) => set({ status }),
  setResult: (result) => set({ result, status: 'success' }),
  setError: (error) => set({ error, status: 'error' }),
  setActiveTab: (activeTab) => set({ activeTab }),
  updateCalendarItem: (index, updatedItem) => set((state) => {
    if (!state.result) return state;
    const nextCalendar = [...state.result.calendar];
    nextCalendar[index] = { ...nextCalendar[index], ...updatedItem };
    return {
      result: {
        ...state.result,
        calendar: nextCalendar
      }
    };
  }),
  reset: () => set({ status: 'idle', result: null, error: null, username: '' }),
}));
