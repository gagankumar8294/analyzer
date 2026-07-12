import JSZip from 'jszip';
import type { InstagramProfile, Post } from '../types/instagram';

interface ParsedExportResult {
  profile: InstagramProfile;
  posts: Post[];
}

/**
 * Searches for a JSON file in the ZIP that matches a regex pattern, 
 * parses it, and returns the parsed object.
 */
async function findAndParseJson<T>(zip: JSZip, pattern: RegExp): Promise<T | null> {
  const matchingFile = Object.keys(zip.files).find(path => pattern.test(path));
  if (!matchingFile) return null;
  
  const text = await zip.files[matchingFile].async('text');
  try {
    return JSON.parse(text) as T;
  } catch (err) {
    console.error(`Error parsing JSON from ${matchingFile}:`, err);
    return null;
  }
}

/**
 * Finds all JSON files matching a regex pattern, parses them, and combines them.
 * If the parsed JSON is an array, it flattens them.
 */
async function findAndParseAllJson<T>(zip: JSZip, pattern: RegExp): Promise<T[]> {
  const matchingFiles = Object.keys(zip.files).filter(path => pattern.test(path));
  const results: any[] = [];

  for (const filePath of matchingFiles) {
    const text = await zip.files[filePath].async('text');
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        results.push(...parsed);
      } else {
        results.push(parsed);
      }
    } catch (err) {
      console.error(`Error parsing JSON from ${filePath}:`, err);
    }
  }
  return results;
}

/**
 * Parses the raw Instagram ZIP file upload fully client-side.
 * Matches files like:
 * - profile_information.json (bio, username, name)
 * - posts_1.json / your_posts_1.json (posts list, captions, dates)
 * - followers_1.json / following.json (connection stats)
 */
export async function parseInstagramZip(zipFile: File | ArrayBuffer): Promise<ParsedExportResult> {
  const zip = new JSZip();
  const loadedZip = await zip.loadAsync(zipFile);

  // 1. Locate and parse Profile Information
  const profileRaw = await findAndParseJson<any>(loadedZip, /(profile_information|personal_information|profile)\.json$/i);

  // 2. Locate and parse Followers and Following data
  // Followers can be an array of objects directly, or structured inside a parent property
  const followersList = await findAndParseAllJson<any>(loadedZip, /followers_?\d*\.json$/i);
  const followingList = await findAndParseAllJson<any>(loadedZip, /following_?\d*\.json$/i);

  // 3. Locate and parse Post Media content (could be split across posts_1.json, posts_2.json, your_posts_1.json, etc.)
  const postsRaw = await findAndParseAllJson<any>(loadedZip, /(posts|your_posts)_?\d*\.json$/i);

  // --- Extract Profile Details ---
  let username = 'me';
  let fullName = 'My Profile';
  let bio = '';
  let profilePicUrl = '';
  let externalUrl: string | null = null;

  if (profileRaw) {
    const p = profileRaw.profile_user_profile || profileRaw.profile_metadata || profileRaw;
    if (p) {
      username = p.username || username;
      fullName = p.name || p.full_name || fullName;
      bio = p.biography || p.bio || '';
      profilePicUrl = p.profile_photo?.href || '';
      externalUrl = p.external_url || p.website || null;
    }
  }

  // --- Calculate follower/following tallies ---
  let followersCount = 0;
  let followingCount = 0;

  // Handle followers list formats (sometimes it's [{string_list_data: {...}}, ...] or a wrapper object)
  if (followersList.length > 0) {
    // If the list has a nested array, check for it
    const firstItem = followersList[0];
    if (firstItem && firstItem.relationships_followers) {
      followersCount = firstItem.relationships_followers.length;
    } else {
      followersCount = followersList.length;
    }
  }

  if (followingList.length > 0) {
    const firstItem = followingList[0];
    if (firstItem && firstItem.relationships_following) {
      followingCount = firstItem.relationships_following.length;
    } else {
      followingCount = followingList.length;
    }
  }

  // --- Parse posts ---
  const posts: Post[] = [];
  postsRaw.forEach((rawPost: any, index: number) => {
    try {
      // Meta posts structure: media items under "media" array inside each post item
      const mediaItem = rawPost.media?.[0];
      if (!mediaItem) return;

      const caption = mediaItem.title || mediaItem.caption || '';
      const timestampVal = mediaItem.creation_timestamp || rawPost.creation_timestamp;
      const dateStr = timestampVal 
        ? new Date(timestampVal * 1000).toISOString() 
        : new Date().toISOString();

      // Extract hashtags and mentions
      const hashtags = (caption.match(/#\w+/g) ?? []).map((t: string) => t.toLowerCase());
      const mentions = (caption.match(/@\w+/g) ?? []).map((t: string) => t.toLowerCase());

      // Determine content type
      let type: Post['type'] = 'IMAGE';
      if (mediaItem.uri?.includes('.mp4') || mediaItem.uri?.includes('.mov')) {
        type = 'REEL';
      } else if (rawPost.media && rawPost.media.length > 1) {
        type = 'CAROUSEL';
      }

      posts.push({
        id: `zip_post_${index}`,
        shortCode: mediaItem.uri ? mediaItem.uri.split('/').pop() || String(index) : String(index),
        type,
        thumbnailUrl: mediaItem.uri || '',
        caption,
        likes: 0, // Exported data doesn't include live metrics
        comments: 0,
        hashtags,
        mentions,
        timestamp: dateStr,
        isSponsored: false
      });
    } catch (e) {
      console.error('Error parsing post item:', e);
    }
  });

  const profile: InstagramProfile = {
    id: `zip_profile_${username}`,
    username,
    fullName,
    bio,
    profilePicUrl,
    followers: followersCount || 120, // Default fallback if json missing
    following: followingCount || 150,
    totalPosts: posts.length,
    isVerified: false,
    externalUrl,
    category: 'Creator',
    highlights: []
  };

  return {
    profile,
    posts
  };
}
