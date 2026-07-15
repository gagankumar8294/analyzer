import type { InstagramProfile, Post } from '../types/instagram';

/**
 * Builds the initial lightweight analysis prompt for Gemini.
 * Excludes heavy competitor templates and 30-day calendar arrays to save tokens.
 */
export function buildAnalysisPrompt(profile: InstagramProfile, posts: Post[]): string {
  const formattedPosts = posts.slice(0, 15).map((p, idx) => ({
    index: idx + 1,
    type: p.type,
    likes: p.likes,
    comments: p.comments,
    views: p.views || 'N/A',
    timestamp: p.timestamp,
    hashtags: p.hashtags,
    caption: p.caption.slice(0, 150) + (p.caption.length > 150 ? '...' : '')
  }));

  const inputData = {
    profile: {
      username: profile.username,
      fullName: profile.fullName,
      bio: profile.bio,
      followers: profile.followers,
      following: profile.following,
      totalPosts: profile.totalPosts,
      category: profile.category || 'N/A',
      website: profile.externalUrl || 'N/A'
    },
    recentPosts: formattedPosts
  };

  return `
You are an elite Instagram growth strategist and brand consultant. Analyze this account data and generate a detailed growth audit, SWOT profile, and strategic scorecards.

### INPUT DATA:
\`\`\`json
${JSON.stringify(inputData, null, 2)}
\`\`\`

### MANDATORY INSTRUCTIONS:
1. Respond with a single, valid JSON object matching the schema below. Start directly with the opening curly brace.
2. Analyze the profile metrics to generate growth, engagement, and SEO scores.
3. List 2 realistic competitor accounts in the same niche. Include only their basic metrics (username, followers, engagementRate, topHashtags, contentThemes, gapVsTarget, growthScore). Do NOT include sample hooks, caption templates, or calendar suggestions yet.
4. Generate a prioritized 5-item action plan.

### JSON OUTPUT SCHEMA TO EMULATE:
{
  "insights": {
    "niche": "string (niche)",
    "targetAudience": "string",
    "brandPositioning": "string",
    "contentPillars": ["string", "string", "string"],
    "postingConsistency": "string",
    "engagementPatterns": "string",
    "toneOfVoice": "string",
    "writingStyle": "string",
    "visualBranding": "string",
    "hashtagStrategy": "string",
    "ctaStrategy": "string",
    "bestPerformingPatterns": ["string", "string"],
    "strengths": ["string", "string"],
    "weaknesses": ["string", "string"],
    "opportunities": ["string", "string"],
    "audiencePainPoints": ["string", "string"],
    "estimatedContentStrategy": "string"
  },
  "scores": {
    "growth": number (0-100),
    "competitor": number (0-100),
    "contentQuality": number (0-100),
    "branding": number (0-100),
    "engagement": number (0-100),
    "postingConsistency": number (0-100),
    "seo": number (0-100),
    "audienceTargeting": number (0-100)
  },
  "competitors": [
    {
      "username": "string (realistic niche handle, e.g. plantsofinstagram)",
      "followers": number,
      "engagementRate": number (e.g. 3.5),
      "avgLikes": number,
      "avgComments": number,
      "avgReelViews": number,
      "postingFrequency": "string (e.g. '5x per week')",
      "topHashtags": ["string"],
      "contentThemes": ["string"],
      "captionStyle": "string",
      "ctaPatterns": ["string"],
      "gapVsTarget": ["string"],
      "growthScore": number
    }
  ],
  "actionPlan": [
    {
      "priority": "HIGH | MEDIUM | LOW",
      "category": "string",
      "action": "string",
      "expectedImpact": "string",
      "timeframe": "string"
    }
  ]
}
`;
}

/**
 * Builds the deep competitor analysis prompt.
 * Asks Gemini for original hook scripts, caption templates, and niche-specific growth recommendations for each competitor.
 */
export function buildCompetitorDeepPrompt(profile: InstagramProfile, competitors: any[]): string {
  const targetInfo = {
    username: profile.username,
    bio: profile.bio,
    category: profile.category || 'N/A',
    followers: profile.followers
  };

  return `
You are a competitor research analyst. Take the following Instagram profile and its identified competitors, and perform a deep-dive intelligence audit.

### TARGET PROFILE:
\`\`\`json
${JSON.stringify(targetInfo, null, 2)}
\`\`\`

### COMPETITORS TO ENRICH:
\`\`\`json
${JSON.stringify(competitors, null, 2)}
\`\`\`

### MANDATORY INSTRUCTIONS:
1. Respond with a single, valid JSON array containing enriched competitor objects. Start directly with the opening square bracket.
2. For each competitor, generate:
   - "niche" micro-niche detail.
   - "reason" why they succeed.
   - "contentFormats" percentages.
   - "avgSavesRate" percentage.
   - 3 "strengths" and 2 "weaknesses".
   - 3 "learningOpportunities" (ideas to adapt, not copy).
   - 3 "sampleHooks" (original scroll-stoppers in their style).
   - 2 "sampleCaptions" (full caption templates in their voice).
   - 5-8 "targetHashtags" to borrow.
   - "postingDays" list.
   - "growthTip" to beat them.
3. Make sure all hooks and captions are completely original and do not copy existing copyright materials.

### JSON OUTPUT SCHEMA TO EMULATE:
[
  {
    "username": "string (matching inputted competitor username)",
    "followers": number,
    "engagementRate": number,
    "avgLikes": number,
    "avgComments": number,
    "avgReelViews": number,
    "postingFrequency": "string",
    "topHashtags": ["string"],
    "contentThemes": ["string"],
    "captionStyle": "string",
    "ctaPatterns": ["string"],
    "gapVsTarget": ["string"],
    "growthScore": number,
    "niche": "string",
    "reason": "string",
    "contentFormats": ["string"],
    "avgSavesRate": number,
    "strengths": ["string"],
    "weaknesses": ["string"],
    "learningOpportunities": ["string"],
    "sampleHooks": ["string"],
    "sampleCaptions": ["string"],
    "targetHashtags": ["string"],
    "postingDays": ["string"],
    "growthTip": "string"
  }
]
`;
}

/**
 * Builds the 30-day content calendar prompt.
 * Generates daily topics, hooks, ideas, hashtags, captions, and script templates.
 */
export function buildCalendarDeepPrompt(profile: InstagramProfile, insights: any): string {
  const profileInfo = {
    username: profile.username,
    bio: profile.bio,
    category: profile.category || 'N/A',
    contentPillars: insights.contentPillars || [],
    niche: insights.niche || 'N/A'
  };

  return `
You are a social media copywriter. Generate a 30-day content calendar starting from today for this Instagram profile.

### PROFILE & INSIGHTS:
\`\`\`json
${JSON.stringify(profileInfo, null, 2)}
\`\`\`

### MANDATORY INSTRUCTIONS:
1. Respond with a single, valid JSON array containing exactly 30 calendar days. Start directly with the opening square bracket.
2. Mix content formats (REEL, CAROUSEL, POST, STORY).
3. Include specific Hooks, copy-paste Captions, Hashtags, CTAs, and Scripts (for Reels).
4. Do NOT use markdown code fences in your reply.

### JSON OUTPUT SCHEMA TO EMULATE:
[
  {
    "date": "string (YYYY-MM-DD)",
    "contentType": "REEL | CAROUSEL | POST | STORY",
    "theme": "string (pillar or theme)",
    "idea": "string (video concept)",
    "hook": "string (3-second hook)",
    "caption": "string (caption text)",
    "hashtags": ["string"],
    "cta": "string",
    "script": "string (Reel script, speaking lines)",
    "thumbnailText": "string"
  }
]
`;
}
