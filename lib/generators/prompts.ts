import type { InstagramProfile, Post } from '../types/instagram';

/**
 * Builds a highly detailed analytical prompt for Gemini Flash.
 * Feeds in normalized profile data and post histories, and instructs
 * Gemini to perform full strategy audits, competitor gap analyses, 
 * scoring calculations, and construct a 30-day content calendar.
 */
export function buildAnalysisPrompt(profile: InstagramProfile, posts: Post[]): string {
  // Format posts list for the LLM to inspect
  const formattedPosts = posts.slice(0, 15).map((p, idx) => ({
    index: idx + 1,
    type: p.type,
    likes: p.likes,
    comments: p.comments,
    views: p.views || 'N/A',
    timestamp: p.timestamp,
    hashtags: p.hashtags,
    caption: p.caption.slice(0, 200) + (p.caption.length > 200 ? '...' : '')
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
You are an elite Instagram growth strategist, data analyst, and brand consultant. Your job is to analyze the provided Instagram account data and generate a detailed growth audit, competitor gap analysis, strategic scorecards, and a highly actionable 30-day content calendar.

### INPUT DATA:
\`\`\`json
${JSON.stringify(inputData, null, 2)}
\`\`\`

### MANDATORY INSTRUCTIONS:
1. You MUST respond with a single, valid JSON object that exactly matches the structure specified below. Do not wrap the JSON in Markdown fences like \`\`\`json ... \`\`\`. Start directly with the opening curly brace.
2. Analyze the bio, recent posts, and engagement ratios. High comment-to-like ratios indicate high community trust. High reels views relative to followers indicate high viral velocity.
3. Formulate custom content pillars (3-4 pillars) specific to this niche.
4. Calculate growth scores, SEO scores, and engagement scores based on the actual metrics provided in the dataset.
5. List 2 realistic competitor accounts (e.g. "@username_competitor") in the same niche. Outline their estimated metrics and the specific content/operational gaps the user must bridge to beat them.
6. Design a 30-day content calendar containing a mix of Content Types (REEL, CAROUSEL, POST, STORY). Focus on viral hooks, descriptive captions, relevant hashtags (3-5), and strategic CTAs (e.g. "Comment KEYWORD below").
7. Generate script outlines for REEL suggestions and thumbnail hook text overlays.
8. Create a prioritized 5-item action plan (HIGH/MEDIUM/LOW priority) with timeframes.

### JSON OUTPUT SCHEMA TO EMULATE:
{
  "insights": {
    "niche": "string (the exact creator niche)",
    "targetAudience": "string (description of ideal customer avatar)",
    "brandPositioning": "string (unique value proposition)",
    "contentPillars": ["string (pillar 1)", "string (pillar 2)", "string (pillar 3)"],
    "postingConsistency": "string (audit of their schedule and frequency)",
    "engagementPatterns": "string (analysis of high performing vs low performing formats)",
    "toneOfVoice": "string (e.g. authoritative, direct, empathetic)",
    "writingStyle": "string (e.g. short sentences, space-padded bullet lists, hooks first)",
    "visualBranding": "string (recommendations on color palette, typography, visual layouts)",
    "hashtagStrategy": "string (hashtag rules to follow)",
    "ctaStrategy": "string (how to trigger engagement or clicks)",
    "bestPerformingPatterns": ["string (successful pattern 1)", "string (successful pattern 2)"],
    "strengths": ["string", "string"],
    "weaknesses": ["string", "string"],
    "opportunities": ["string", "string"],
    "audiencePainPoints": ["string", "string"],
    "estimatedContentStrategy": "string (overall strategic growth path)"
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
      "engagementRate": number (percentage like 3.5),
      "avgLikes": number,
      "avgComments": number,
      "avgReelViews": number,
      "postingFrequency": "string (e.g. '5x per week')",
      "topHashtags": ["string (5 most used hashtags)"],
      "contentThemes": ["string (2-3 content themes)"],
      "captionStyle": "string",
      "ctaPatterns": ["string"],
      "gapVsTarget": ["string (what they do better)"],
      "growthScore": number (0-100),
      "niche": "string (micro-niche they dominate, e.g. 'Indoor tropical plants')",
      "reason": "string (1-2 sentences on why they are winning in this niche)",
      "contentFormats": ["string (e.g. 'Reels 70%', 'Carousels 20%', 'Stories 10%')"],
      "avgSavesRate": number (estimated saves as % of followers, e.g. 0.8),
      "strengths": ["string (2-3 strategic strengths)"],
      "weaknesses": ["string (1-2 weaknesses to exploit)"],
      "learningOpportunities": ["string (3 original content ideas to adapt — NOT copy — from their style)"],
      "sampleHooks": ["string (3 original viral hook lines written in their style but 100% new)"],
      "sampleCaptions": ["string (2 full caption templates in their voice — original, inspired by their approach)"],
      "targetHashtags": ["string (6-8 hashtags from their niche to adopt)"],
      "postingDays": ["string (best days they post, e.g. 'Monday', 'Thursday', 'Saturday')"],
      "growthTip": "string (1 precise actionable tip to outperform this specific competitor)"
    }
  ],
  "calendar": [
    {
      "date": "string (YYYY-MM-DD format starting from today, iterate for 30 consecutive days)",
      "contentType": "REEL | CAROUSEL | POST | STORY",
      "theme": "string (pillar or theme)",
      "idea": "string (the video/carousel concept)",
      "hook": "string (the vital 3-second visual or verbal hook)",
      "caption": "string (caption body to copy paste)",
      "hashtags": ["string"],
      "cta": "string (call to action)",
      "script": "string (optional: script lines for speaking or text on screen if Reel)",
      "thumbnailText": "string (optional: text overlay for the thumbnail/cover)"
    }
  ],
  "actionPlan": [
    {
      "priority": "HIGH | MEDIUM | LOW",
      "category": "string (e.g. Bio, Video Editing, Hashtags)",
      "action": "string (clear, direct instruction)",
      "expectedImpact": "string (expected result)",
      "timeframe": "string (e.g. 24 hours, 7 days)"
    }
  ]
}
`;
}
