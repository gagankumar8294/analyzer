import type { InstagramProfile, Post, Reel } from '../types/instagram';

/**
 * Normalizes raw Instagram Profile data from either RapidAPI (JoTucker format) 
 * or local client-side ZIP parsing into a unified InstagramProfile interface.
 */
export function normalizeProfile(rawData: any, source: 'api' | 'zip'): InstagramProfile {
  if (source === 'zip') {
    // Already normalized by parser, but apply safety defaults
    return {
      id: rawData.id || 'zip_profile',
      username: rawData.username || 'me',
      fullName: rawData.fullName || 'My Account',
      bio: rawData.bio || '',
      profilePicUrl: rawData.profilePicUrl || '',
      followers: rawData.followers || 0,
      following: rawData.following || 0,
      totalPosts: rawData.totalPosts || 0,
      isVerified: rawData.isVerified || false,
      externalUrl: rawData.externalUrl || null,
      category: rawData.category || 'Creator',
      highlights: rawData.highlights || []
    };
  }

  // RapidAPI (JoTucker / Meta Graph response)
  const id = String(rawData.id || rawData.pk || '');
  const username = rawData.username || '';
  const fullName = rawData.full_name || rawData.fullName || username;
  
  // JoTucker places bio under biography or biography_with_entities.raw_text
  const bio = rawData.biography || rawData.biography_with_entities?.raw_text || '';
  
  // Extract cover image
  const profilePicUrl = rawData.profile_pic_url_hd || rawData.profile_pic_url || '';
  
  const followers = Number(rawData.follower_count ?? rawData.followers ?? 0);
  const following = Number(rawData.following_count ?? rawData.following ?? 0);
  const totalPosts = Number(rawData.media_count ?? rawData.posts_count ?? 0);
  const isVerified = Boolean(rawData.is_verified || false);
  const externalUrl = rawData.external_url || rawData.website || null;
  const category = rawData.category_name || rawData.category || null;

  return {
    id,
    username,
    fullName,
    bio,
    profilePicUrl,
    followers,
    following,
    totalPosts,
    isVerified,
    externalUrl,
    category,
    highlights: []
  };
}

/**
 * Normalizes raw Instagram Post / Media array from either RapidAPI (JoTucker format)
 * or local client-side ZIP parsing into a unified Post list.
 */
export function normalizePosts(rawItems: any[], source: 'api' | 'zip'): Post[] {
  if (source === 'zip') {
    return rawItems.map(post => ({
      id: post.id,
      shortCode: post.shortCode,
      type: post.type,
      thumbnailUrl: post.thumbnailUrl,
      caption: post.caption,
      likes: post.likes || 0,
      comments: post.comments || 0,
      hashtags: post.hashtags || [],
      mentions: post.mentions || [],
      timestamp: post.timestamp,
      isSponsored: post.isSponsored || false
    }));
  }

  return rawItems.map((item, idx) => {
    const id = String(item.id || item.pk || `api_post_${idx}`);

    // Apify uses `shortCode`; legacy used `code` / `shortcode`
    const shortCode = item.shortCode || item.code || item.shortcode || id;

    // ── Determine post type ───────────────────────────────────────────────
    // Apify returns a `type` string: 'Image', 'Video', 'Sidecar' (carousel)
    // Legacy (RapidAPI/JoTucker) uses media_type number: 1=Image, 2=Video, 8=Carousel
    let type: Post['type'] = 'IMAGE';
    const apifyType = (item.type || '').toLowerCase();
    const mediaType = item.media_type;

    if (apifyType === 'sidecar' || mediaType === 8) {
      type = 'CAROUSEL';
    } else if (apifyType === 'video' || mediaType === 2) {
      // Distinguish Reel vs Video: Apify sets `isIGTV` or `videoViewCount` > 0
      const isReel = item.productType === 'clips' || item.isReel || item.is_reel;
      type = isReel ? 'REEL' : 'VIDEO';
    }

    // ── Thumbnail URL ─────────────────────────────────────────────────────
    // Apify: displayUrl | legacy: image_versions2.candidates[0].url
    const thumbnailUrl =
      item.displayUrl ||
      item.display_url ||
      item.thumbnail_src ||
      item.image_versions2?.candidates?.[0]?.url ||
      '';

    // ── Caption ───────────────────────────────────────────────────────────
    const caption = item.caption?.text || item.caption || '';

    // ── Engagement ───────────────────────────────────────────────────────
    // Apify: likesCount / commentsCount; legacy: like_count / comment_count
    const likes    = Number(item.likesCount    ?? item.like_count    ?? item.likes?.count    ?? 0);
    const comments = Number(item.commentsCount ?? item.comment_count ?? item.comments?.count ?? 0);
    const views    = item.videoViewCount ?? item.view_count ?? item.video_view_count ?? undefined;

    // ── Hashtags + Mentions from caption ─────────────────────────────────
    const hashtags = (caption.match(/#\w+/g) ?? []).map((t: string) => t.toLowerCase());
    const mentions = (caption.match(/@\w+/g) ?? []).map((t: string) => t.toLowerCase());

    // ── Timestamp ─────────────────────────────────────────────────────────
    // Apify: timestamp ISO string; legacy: taken_at Unix seconds
    let timestamp: string;
    if (item.timestamp && isNaN(Number(item.timestamp))) {
      // ISO string from Apify
      timestamp = new Date(item.timestamp).toISOString();
    } else {
      const takenAt = item.taken_at || item.timestamp || item.creation_timestamp;
      timestamp = takenAt ? new Date(Number(takenAt) * 1000).toISOString() : new Date().toISOString();
    }

    const isSponsored = Boolean(
      item.is_paid_partnership ||
      (item.sponsor_tags && item.sponsor_tags.length > 0) ||
      false
    );

    return { id, shortCode, type, thumbnailUrl, caption, likes, comments, views, hashtags, mentions, timestamp, isSponsored };
  });
}

/**
 * Filter and convert normalized posts list into Reel-specific objects
 */
export function extractReels(posts: Post[]): Reel[] {
  return posts
    .filter(p => p.type === 'REEL')
    .map(p => ({
      id: p.id,
      shortCode: p.shortCode,
      thumbnailUrl: p.thumbnailUrl,
      caption: p.caption,
      likes: p.likes,
      comments: p.comments,
      views: p.views || 0,
      duration: 30, // Mock default duration
      timestamp: p.timestamp
    }));
}
