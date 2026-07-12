import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { niche, username } = await req.json();
    // TODO: AI-infer competitors and fetch their data
    return NextResponse.json({ message: 'Competitors route ready', niche, username });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
