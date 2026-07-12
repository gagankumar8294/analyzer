import { useAnalysisStore } from '@/store/analysisStore';
import { parseInstagramZip } from '@/lib/parsers/instagram-export';

export function useAnalysis() {
  const store = useAnalysisStore();

  async function analyze(username: string, options?: { useMock?: boolean }) {
    store.setUsername(username);
    store.setStatus('loading');
    store.setError(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, useMock: options?.useMock }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Analysis failed');
      }

      const result = await res.json();
      store.setResult(result);
      return result;
    } catch (err: any) {
      console.error('Analysis API fetch error:', err);
      store.setError(err.message ?? 'Something went wrong');
      throw err;
    }
  }

  async function analyzeZip(file: File) {
    store.setUsername('Uploaded Archive');
    store.setStatus('loading');
    store.setError(null);

    // Yield execution to allow React to render the loading ProgressOverlay before blocking CPU tasks
    await new Promise((resolve) => setTimeout(resolve, 400));

    try {
      // 1. Parse ZIP client-side
      const parsedData = await parseInstagramZip(file);

      // 2. Post parsed payload to orchestrator for AI strategy creation
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isZip: true,
          profile: parsedData.profile,
          posts: parsedData.posts
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'AI Analysis orchestration failed');
      }

      const result = await res.json();
      store.setResult(result);
      return result;
    } catch (err: any) {
      console.error('ZIP Analysis error:', err);
      store.setError(err.message ?? 'Failed to process ZIP archive');
      throw err;
    }
  }

  return { 
    ...store, 
    analyze,
    analyzeZip
  };
}
