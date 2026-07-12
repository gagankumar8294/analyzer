import { NextRequest, NextResponse } from 'next/server';
import { instagramApi } from '@/lib/api/instagram';
import { normalizeProfile, normalizePosts } from '@/lib/normalizers/instagram';
import { runAIProfileAnalysis } from '@/lib/analyzers/ai-analyzer';
import { generateMockInstagramData } from '@/lib/generators/mock-generator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, isZip, profile: zipProfile, posts: zipPosts, useMock } = body;

    let profile;
    let posts;
    let isMockData = false;

    if (isZip) {
      // ── Option B: ZIP Export already parsed client-side ──────────────────
      if (!zipProfile || !zipPosts) {
        return NextResponse.json({ error: 'Invalid ZIP parse payload received.' }, { status: 400 });
      }
      profile = normalizeProfile(zipProfile, 'zip');
      posts   = normalizePosts(zipPosts, 'zip');

    } else if (useMock) {
      // ── Option C: AI Mock / Fallback ──────────────────────────────────────
      if (!username) {
        return NextResponse.json({ error: 'Username is required for mock scan.' }, { status: 400 });
      }
      console.log(`[analyze] Generating AI mock data for @${username}`);
      const mockData = await generateMockInstagramData(username);
      profile    = mockData.profile;
      posts      = mockData.posts;
      isMockData = true;

    } else {
      // ── Option A: Live fetch via Apify ────────────────────────────────────
      if (!username) {
        return NextResponse.json({ error: 'Username is required for public scan.' }, { status: 400 });
      }

      const apifyToken = process.env.APIFY_TOKEN;
      if (!apifyToken || apifyToken === 'your_apify_token_here') {
        return NextResponse.json({
          error: 'Apify token is not configured. Add APIFY_TOKEN to your .env.local file.',
        }, { status: 501 });
      }

      // 1. Fetch profile
      console.log(`[analyze] Fetching Apify profile for @${username}`);
      const rawProfile = await instagramApi.getProfile(username);

      if (rawProfile.isPrivate) {
        return NextResponse.json({
          error: `@${username} is a private account. Only public profiles can be analyzed.`,
        }, { status: 403 });
      }

      // rawProfile already normalized inside instagramApi.getProfile()
      profile = normalizeProfile(rawProfile, 'api');

      // 2. Fetch posts
      let rawPostsList: any[] = [];
      try {
        rawPostsList = await instagramApi.getPosts(username, 30);
      } catch (postErr) {
        console.warn('[analyze] Could not fetch posts, continuing with profile only:', postErr);
      }

      posts = normalizePosts(rawPostsList, 'api');
    }

    // ── Run Gemini AI Analysis ────────────────────────────────────────────
    const analysisResult = await runAIProfileAnalysis(profile, posts);
    analysisResult.isMock = isMockData;
    return NextResponse.json(analysisResult);

  } catch (err: any) {
    console.error('[analyze] Orchestration error:', err);
    return NextResponse.json(
      { error: err.message || 'Analysis orchestration failed.' },
      { status: 500 }
    );
  }
}
