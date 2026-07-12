/** Calculate engagement rate as a percentage */
export function calcEngagementRate(likes: number, comments: number, followers: number): number {
  if (followers === 0) return 0;
  return parseFloat(((likes + comments) / followers * 100).toFixed(2));
}

/** Extract hashtags from a caption string */
export function extractHashtags(caption: string): string[] {
  return (caption.match(/#\w+/g) ?? []).map(t => t.toLowerCase());
}

/** Extract @mentions from a caption string */
export function extractMentions(caption: string): string[] {
  return (caption.match(/@\w+/g) ?? []).map(t => t.toLowerCase());
}

/** Format large numbers (e.g. 1200000 → 1.2M) */
export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}
