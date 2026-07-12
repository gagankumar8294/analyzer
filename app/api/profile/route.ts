import { NextRequest, NextResponse } from 'next/server';
import { instagramApi } from '@/lib/api/instagram';

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get('username');

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
    const profile = await instagramApi.getProfile(username);

    if (!profile) {
      return NextResponse.json({ error: `Could not retrieve profile for @${username}.` }, { status: 404 });
    }

    if (profile.isPrivate) {
      return NextResponse.json({ error: `@${username} is a private account.` }, { status: 403 });
    }

    return NextResponse.json(profile);
  } catch (err: any) {
    console.error('[/api/profile] Error:', err);
    return NextResponse.json({
      error: err.message || 'Failed to fetch profile via Apify.',
    }, { status: 500 });
  }
}
