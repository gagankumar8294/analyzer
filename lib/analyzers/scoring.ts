import type { InstagramProfile, Post } from '../types/instagram';
import type { ScoreData } from '../types/analysis';

/**
 * Dynamically computes all 8 growth metrics from real profile and post data.
 */
export function calculateAccountScores(profile: InstagramProfile, posts: Post[]): ScoreData {
  if (posts.length === 0) {
    // Return baseline scores if no post history is available
    return {
      growth: 50,
      competitor: 50,
      contentQuality: 50,
      branding: 40,
      engagement: 50,
      postingConsistency: 30,
      seo: 45,
      audienceTargeting: 50
    };
  }

  // 1. Engagement Rate (ER) Calculation
  const totalEngagement = posts.reduce((sum, p) => sum + p.likes + p.comments, 0);
  const avgEngagementPerPost = totalEngagement / posts.length;
  const er = profile.followers > 0 
    ? (avgEngagementPerPost / profile.followers) * 100 
    : 0;

  // Map ER to a 0-100 score (Industry average is around 2.5% for good accounts)
  let engagementScore = 30;
  if (er > 6) engagementScore = 95;
  else if (er > 4) engagementScore = 85 + ((er - 4) / 2) * 10;
  else if (er > 2.5) engagementScore = 75 + ((er - 2.5) / 1.5) * 10;
  else if (er > 1) engagementScore = 50 + ((er - 1) / 1.5) * 25;
  else engagementScore = Math.max(10, Math.round(er * 40));

  // 2. Posting Consistency Score
  // Calculate average gap (in days) between posts
  let consistencyScore = 50;
  const timestamps = posts
    .map(p => new Date(p.timestamp).getTime())
    .sort((a, b) => b - a); // newest to oldest

  if (timestamps.length > 1) {
    const gaps: number[] = [];
    for (let i = 0; i < timestamps.length - 1; i++) {
      const gapMs = timestamps[i] - timestamps[i + 1];
      const gapDays = gapMs / (1000 * 60 * 60 * 24);
      gaps.push(gapDays);
    }
    const avgGapDays = gaps.reduce((sum, g) => sum + g, 0) / gaps.length;

    // Map avg gap to score (Daily = 95, 3 days = 85, 7 days = 70, >14 days = 40)
    if (avgGapDays <= 1.5) consistencyScore = 95;
    else if (avgGapDays <= 3) consistencyScore = 85 + (3 - avgGapDays) * 5;
    else if (avgGapDays <= 7) consistencyScore = 70 + (7 - avgGapDays) * 3.75;
    else if (avgGapDays <= 14) consistencyScore = 50 + (14 - avgGapDays) * 2.85;
    else consistencyScore = Math.max(10, 90 - Math.round(avgGapDays * 3));
  }

  // 3. Branding Score
  // Assess Bio completeness, avatar presence, external website link
  let brandingScore = 40;
  if (profile.bio) brandingScore += 20;
  if (profile.bio.length > 80) brandingScore += 10; // detailed bio
  if (profile.profilePicUrl) brandingScore += 15;
  if (profile.externalUrl) brandingScore += 15;
  if (profile.fullName && profile.fullName !== profile.username) brandingScore += 10;
  brandingScore = Math.min(100, brandingScore);

  // 4. SEO Score
  // Based on hashtag counts, keyword richness in bio, name differentiation
  let seoScore = 40;
  const postsWithHashtags = posts.filter(p => p.hashtags && p.hashtags.length > 0);
  const avgHashtags = postsWithHashtags.length > 0
    ? posts.reduce((sum, p) => sum + (p.hashtags?.length || 0), 0) / posts.length
    : 0;

  // Optimal hashtag range is 3 to 10 for modern algorithm SEO
  if (avgHashtags >= 3 && avgHashtags <= 10) seoScore += 30;
  else if (avgHashtags > 10 && avgHashtags <= 20) seoScore += 15;
  else if (avgHashtags > 0) seoScore += 10;

  // Bio keyword check (profile name includes spaces or niche descriptors)
  if (profile.fullName.includes(' ') || profile.fullName.toLowerCase().includes('design') || profile.fullName.toLowerCase().includes('fit') || profile.fullName.toLowerCase().includes('coach') || profile.fullName.toLowerCase().includes('plant')) {
    seoScore += 15;
  }
  if (profile.bio.toLowerCase().includes('dm') || profile.bio.toLowerCase().includes('click') || profile.bio.toLowerCase().includes('link')) {
    seoScore += 15; // presence of Call-To-Action terms
  }
  seoScore = Math.min(100, seoScore);

  // 5. Content Quality Score
  // Based on post format diversity (using REEL, CAROUSEL, IMAGE, etc.)
  const postTypes = new Set(posts.map(p => p.type));
  let qualityScore = 50;
  if (postTypes.has('REEL')) qualityScore += 15;
  if (postTypes.has('CAROUSEL')) qualityScore += 15;
  if (postTypes.has('IMAGE')) qualityScore += 10;

  // High performing post multiplier (posts getting higher than average likes)
  const highPerfPosts = posts.filter(p => p.likes > avgEngagementPerPost).length;
  const highPerfRatio = posts.length > 0 ? highPerfPosts / posts.length : 0;
  qualityScore += Math.round(highPerfRatio * 20);
  qualityScore = Math.min(100, qualityScore);

  // 6. Audience Targeting
  // Inferred from category mapping, niche clarity, external url context
  let audienceScore = 60;
  if (profile.category) audienceScore += 15;
  if (profile.bio.includes('@') || profile.bio.includes('#')) audienceScore += 10; // links to sub-pages or custom tags
  if (profile.externalUrl && (profile.externalUrl.includes('linktr.ee') || profile.externalUrl.includes('l.instagram') || profile.externalUrl.includes('bio.link'))) {
    audienceScore += 15; // using professional link aggregators
  }
  audienceScore = Math.min(100, audienceScore);

  // 7. Growth Velocity Score
  // Composite score using posting frequency and engagement
  const growthScore = Math.round((consistencyScore * 0.6) + (engagementScore * 0.4));

  // 8. Competitor Score (how well are they insulated vs general space)
  // Higher engagement rate + consistency = higher insulation
  const competitorScore = Math.round((qualityScore * 0.4) + (brandingScore * 0.3) + (seoScore * 0.3));

  return {
    growth: growthScore,
    competitor: competitorScore,
    contentQuality: qualityScore,
    branding: brandingScore,
    engagement: engagementScore,
    postingConsistency: consistencyScore,
    seo: seoScore,
    audienceTargeting: audienceScore
  };
}
