/**
 * Instagram Data Client — Powered by Apify
 *
 * Replaces RapidAPI (10 req/day limit) with Apify's Instagram scrapers.
 * Free tier: $5/month credits → ~1,900 profile + post fetches/month (no daily cap).
 *
 * Actors used:
 *   Profile:  apify/instagram-profile-scraper
 *   Posts:    apify/instagram-scraper  (configured for posts only)
 */

import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN! });

const TIMEOUT_MS = parseInt(process.env.API_TIMEOUT_MS ?? '60000');

/** Run an Apify actor synchronously and return the dataset items */
async function runActor<T>(actorId: string, input: Record<string, unknown>): Promise<T[]> {
  const run = await Promise.race([
    client.actor(actorId).call(input, { waitSecs: Math.floor(TIMEOUT_MS / 1000) }),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Apify actor ${actorId} timed out`)), TIMEOUT_MS)
    ),
  ]);

  const { items } = await client.dataset((run as any).defaultDatasetId).listItems();
  return items as T[];
}

export const instagramApi = {
  /**
   * Fetch a public Instagram profile by username.
   * Uses: apify/instagram-profile-scraper
   * Returns normalized profile object.
   */
  async getProfile(username: string): Promise<any> {
    const items = await runActor<any>('apify/instagram-profile-scraper', {
      usernames: [username],
    });

    if (!items || items.length === 0) {
      throw new Error(`Profile @${username} not found or is private.`);
    }

    const raw = items[0];

    // Normalize Apify response → our InstagramProfile shape
    return {
      id: raw.id ?? raw.userId ?? `apify_${username}`,
      username: raw.username ?? username,
      fullName: raw.fullName ?? raw.name ?? username,
      bio: raw.biography ?? raw.bio ?? '',
      profilePicUrl: raw.profilePicUrl ?? raw.profilePicUrlHD ?? '',
      followers: raw.followersCount ?? raw.followers ?? 0,
      following: raw.followingCount ?? raw.following ?? 0,
      totalPosts: raw.postsCount ?? raw.mediaCount ?? 0,
      isVerified: raw.verified ?? raw.isVerified ?? false,
      externalUrl: raw.externalUrl ?? raw.website ?? null,
      category: raw.businessCategoryName ?? raw.category ?? null,
      isPrivate: raw.isPrivate ?? false,
      highlights: [],
    };
  },

  /**
   * Fetch recent public posts for a profile.
   * Uses: apify/instagram-scraper  (configured to fetch posts by username URL)
   * Returns up to `limit` posts.
   */
  async getPosts(username: string, limit = 30): Promise<any[]> {
    const items = await runActor<any>('apify/instagram-scraper', {
      directUrls: [`https://www.instagram.com/${username}/`],
      resultsType: 'posts',
      resultsLimit: limit,
    });

    return items ?? [];
  },

  /**
   * Fetch recent public Reels for a profile.
   * Uses: apify/instagram-scraper  (configured for reels)
   */
  async getReels(username: string, limit = 20): Promise<any[]> {
    const items = await runActor<any>('apify/instagram-scraper', {
      directUrls: [`https://www.instagram.com/${username}/reels/`],
      resultsType: 'posts',
      resultsLimit: limit,
    });

    return items ?? [];
  },
};
