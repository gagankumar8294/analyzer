import { NextRequest, NextResponse } from 'next/server';
import { runAICompetitorAnalysis } from '@/lib/analyzers/ai-analyzer';

export async function POST(req: NextRequest) {
  try {
    const { profile, competitors } = await req.json();
    if (!profile || !competitors) {
      return NextResponse.json({ error: 'Missing profile or competitors list.' }, { status: 400 });
    }

    const enriched = await runAICompetitorAnalysis(profile, competitors);
    return NextResponse.json({ competitors: enriched });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
