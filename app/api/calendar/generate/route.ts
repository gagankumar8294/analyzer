import { NextRequest, NextResponse } from 'next/server';
import { runAICalendarAnalysis } from '@/lib/analyzers/ai-analyzer';

export async function POST(req: NextRequest) {
  try {
    const { profile, insights } = await req.json();
    if (!profile || !insights) {
      return NextResponse.json({ error: 'Missing profile or insights.' }, { status: 400 });
    }

    const calendar = await runAICalendarAnalysis(profile, insights);
    return NextResponse.json({ calendar });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
