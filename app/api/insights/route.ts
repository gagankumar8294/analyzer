import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // TODO: call OpenAI with profile + posts data
    return NextResponse.json({ message: 'Insights route ready', received: !!body });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
