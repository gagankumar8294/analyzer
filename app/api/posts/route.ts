import { NextRequest, NextResponse } from 'next/server';
import { instagramApi } from '@/lib/api/instagram';

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get('username');
  const limit    = parseInt(req.nextUrl.searchParams.get('limit') ?? '30');

  if (!username) {
    return NextResponse.json({ error: 'Username parameter is required.' }, { status: 400 });
  }

  const apifyToken = process.env.APIFY_TOKEN;
  if (!apifyToken || apifyToken === 'your_apify_token_here') {
    return NextResponse.json({
      error: 'Apify token is not configured. Add APIFY_TOKEN to .env.local.',
    }, { status: 501 });
  }

  try {
    const items = await instagramApi.getPosts(username, limit);

    return NextResponse.json({ items, nextCursor: null });
  } catch (err: any) {
    console.error('[/api/posts] Error:', err);
    return NextResponse.json({
      error: err.message || 'Failed to fetch posts via Apify.',
    }, { status: 500 });
  }
}
