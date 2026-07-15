export interface CompetitorData {
  username: string;
  followers: number;
  engagementRate: number;
  avgLikes: number;
  avgComments: number;
  avgReelViews: number;
  postingFrequency: string;
  topHashtags: string[];
  contentThemes: string[];
  captionStyle: string;
  ctaPatterns: string[];
  gapVsTarget: string[];
  growthScore: number;

  // --- Competitor Intelligence extended fields ---
  niche?: string;                      // micro-niche the competitor targets
  reason?: string;                     // why they are strong in this space
  contentFormats?: string[];           // dominant post types (e.g. "Reels 70%", "Carousels 20%")
  avgSavesRate?: number;               // estimated saves rate as % of followers
  strengths?: string[];                // strategic strengths
  weaknesses?: string[];               // what they lack
  learningOpportunities?: string[];    // content ideas to adapt (original, not copied)
  sampleHooks?: string[];              // 3 original viral hooks in their style
  sampleCaptions?: string[];           // 2 caption templates inspired by their voice
  targetHashtags?: string[];           // 5-8 hashtags to adopt from their strategy
  postingDays?: string[];              // best days they post
  growthTip?: string;                  // 1 actionable tip to beat them
}

