import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { insights, days } = await req.json();
    // TODO: call OpenAI to generate content calendar
    return NextResponse.json({ message: 'Calendar route ready', days });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
