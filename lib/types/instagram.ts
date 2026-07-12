export interface InstagramProfile {
  id: string;
  username: string;
  fullName: string;
  bio: string;
  profilePicUrl: string;
  followers: number;
  following: number;
  totalPosts: number;
  isVerified: boolean;
  externalUrl: string | null;
  category: string | null;
  highlights: Highlight[];
}

export interface Highlight {
  id: string;
  title: string;
  coverUrl: string;
}

export interface Post {
  id: string;
  shortCode: string;
  type: 'IMAGE' | 'VIDEO' | 'CAROUSEL' | 'REEL';
  thumbnailUrl: string;
  caption: string;
  likes: number;
  comments: number;
  views?: number;
  hashtags: string[];
  mentions: string[];
  timestamp: string;
  isSponsored: boolean;
}

export interface Reel {
  id: string;
  shortCode: string;
  thumbnailUrl: string;
  caption: string;
  likes: number;
  comments: number;
  views: number;
  duration: number;
  timestamp: string;
}
