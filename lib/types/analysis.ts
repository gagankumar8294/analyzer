export interface ScoreData {
  growth: number;
  competitor: number;
  contentQuality: number;
  branding: number;
  engagement: number;
  postingConsistency: number;
  seo: number;
  audienceTargeting: number;
}

export interface InsightData {
  niche: string;
  targetAudience: string;
  brandPositioning: string;
  contentPillars: string[];
  postingConsistency: string;
  engagementPatterns: string;
  toneOfVoice: string;
  writingStyle: string;
  visualBranding: string;
  hashtagStrategy: string;
  ctaStrategy: string;
  bestPerformingPatterns: string[];
  // SWOT
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  // Actions
  recommendations: string[];
  quickWins: string[];
  audiencePainPoints: string[];
  estimatedContentStrategy: string;
}

export interface ActionItem {
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  action: string;
  expectedImpact: string;
  timeframe: string;
}

export interface CalendarDay {
  date: string;
  week?: string;
  contentType: 'REEL' | 'CAROUSEL' | 'POST' | 'STORY';
  theme: string;
  idea: string;
  hook: string;
  caption: string;
  hashtags: string[];
  cta: string;
  script?: string;
  thumbnailText?: string;
}

export interface AnalysisResult {
  profile: import('./instagram').InstagramProfile;
  posts: import('./instagram').Post[];
  reels: import('./instagram').Reel[];
  insights: InsightData;
  scores: ScoreData;
  competitors: any[];          // flexible — Gemini returns varying shapes
  calendar: CalendarDay[];
  actionPlan: ActionItem[];
  aiSummary?: string;          // short AI-generated profile summary
  contentPillars?: string[];   // top-level content pillars shortcut
  generatedAt: string;
  isMock?: boolean;
}
