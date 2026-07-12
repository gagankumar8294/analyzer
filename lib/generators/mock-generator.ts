import { generateJSON } from '../api/gemini';
import type { InstagramProfile, Post } from '../types/instagram';

/**
 * Generates high-fidelity mock Instagram profile and posts using Gemini.
 * Falls back to a highly realistic local static mock generator if Gemini fails.
 */
export async function generateMockInstagramData(username: string): Promise<{ profile: InstagramProfile; posts: Post[] }> {
  const prompt = `
You are a mock Instagram data simulator. Your job is to generate extremely realistic and high-fidelity mock profile metadata and recent posts for the Instagram username "${username}".

Step 1: Analyze the username "${username}" and determine the most likely niche (e.g. if the name contains "plant", "garden", "flower", "leaf" -> plants/gardening; if "tech", "code", "dev" -> technology; if "fit", "gym", "health" -> fitness; otherwise choose a highly creative niche like travel photography, lifestyle vlogging, fashion, digital art, or culinary arts).

Step 2: Generate a JSON object containing two fields: "profile" and "posts".

The "profile" object must have these exact fields:
- "id": "mock_user_${username}"
- "username": "${username}"
- "fullName": A realistic display name for this profile (e.g., "Lotus World | Aquatic Plants" or similar for plants)
- "bio": A realistic, professional bio including emojis and a call-to-action (e.g., "🪷 Specialist in indoor lotus & aquatic plants\\n🌱 Tips for plant lovers\\n👇 shop our collections!")
- "profilePicUrl": A valid Unsplash URL for the profile picture (e.g. a beautiful plant/creator portrait). Use: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop" for human, or a relevant plant one like "https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?w=200&h=200&fit=crop"
- "followers": A number between 5000 and 45000
- "following": A number between 150 and 800
- "totalPosts": A number between 80 and 320
- "isVerified": false
- "externalUrl": "https://linktr.ee/${username}"
- "category": A relevant category like "Home Garden", "Content Creator", "Entrepreneur", "Photographer", "Fitness Model", "Brand"

The "posts" array must contain exactly 12 post objects. Each post object must have these exact fields:
- "id": a unique string like "mock_post_1", "mock_post_2", etc.
- "shortCode": a string like "Cx123abcXYZ"
- "type": one of: "IMAGE", "VIDEO", "CAROUSEL", "REEL" (provide a good mix: 4 images, 3 reels, 3 carousels, 2 videos)
- "thumbnailUrl": A valid, high-resolution Unsplash photo URL relevant to the niche. For example:
  - If plants/gardening: use photos like:
    - "https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&q=80"
    - "https://images.unsplash.com/photo-1520412099521-6afe73787a41?w=600&q=80"
    - "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=600&q=80"
    - "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&q=80"
    - "https://images.unsplash.com/photo-1470058869855-412f56c3bb33?w=600&q=80"
    - "https://images.unsplash.com/photo-1530092285049-1c42085fd695?w=600&q=80"
  - Otherwise, use high-quality Unsplash photos matching the chosen niche (e.g. workspace photos for tech, athletic photos for fitness, etc.)
- "caption": A realistic Instagram caption matching the niche. Write authentic-sounding copy with paragraphs, emojis, 3-5 relevant hashtags, and occasional mentions.
- "likes": A realistic like count. Crucially, calculate likes to match a realistic engagement rate (typically 2% to 8% of the follower count).
- "comments": A realistic comment count (typically 1/15th to 1/30th of the likes count).
- "views": Provide this field ONLY if the type is "VIDEO" or "REEL". It should be a number (typically 3 to 10 times the like count).
- "hashtags": An array of hashtag strings parsed from the caption (without the '#').
- "mentions": An array of username strings parsed from the caption (without the '@').
- "timestamp": A valid ISO string representing a post date within the last 45 days. The timestamps should be spread out logically (e.g., posting every 2-3 days).
- "isSponsored": false

Return ONLY the raw JSON object matching this specification. Do not include markdown tags like \`\`\`json.
`;

  try {
    const data = await generateJSON<{ profile: InstagramProfile; posts: Post[] }>(prompt);
    if (!data.profile || !data.posts || data.posts.length === 0) {
      throw new Error('Invalid JSON payload structure returned from Gemini.');
    }
    return data;
  } catch (error) {
    console.warn('Failed to generate mock Instagram data via Gemini, using static fallback:', error);
    return getStaticMockData(username);
  }
}

/**
 * Returns a high-fidelity static mock profile and posts data matching the username's inferred niche.
 */
function getStaticMockData(username: string): { profile: InstagramProfile; posts: Post[] } {
  const isPlantNiche = /plant|garden|flower|leaf|green|grow|flora|lotus|tree|bloom/i.test(username);
  
  const category = isPlantNiche ? 'Home Garden' : 'Content Creator';
  const fullName = isPlantNiche
    ? `${username.replace(/[0-9_]/g, ' ').trim().replace(/^\w/, (c) => c.toUpperCase())} | Aquatic Plants`
    : `${username.replace(/[0-9_]/g, ' ').trim().replace(/^\w/, (c) => c.toUpperCase())}`;

  const bio = isPlantNiche
    ? '🪷 Specialist in indoor lotus & aquatic plant care\n🌱 Daily gardening tips & design inspiration\n📍 Based in Bengaluru, India\n👇 Shop our monsoon collection!'
    : '✨ Content Creator & Visual Storyteller\n📸 Sharing daily moments & creative insights\n💼 Collaborations: DM or link below\n👇 Explore my work & updates!';

  const profilePicUrl = isPlantNiche
    ? 'https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?w=200&h=200&fit=crop'
    : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop';

  const followers = 18420;
  const following = 432;
  const totalPosts = 142;

  const profile: InstagramProfile = {
    id: `mock_user_${username}`,
    username,
    fullName,
    bio,
    profilePicUrl,
    followers,
    following,
    totalPosts,
    isVerified: false,
    externalUrl: `https://linktr.ee/${username}`,
    category,
    highlights: [
      { id: 'hl_1', title: 'Care Guide', coverUrl: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=100&h=100&fit=crop' },
      { id: 'hl_2', title: 'Nursery', coverUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=100&h=100&fit=crop' },
      { id: 'hl_3', title: 'FAQ', coverUrl: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=100&h=100&fit=crop' }
    ]
  };

  const imagePool = isPlantNiche
    ? [
        'https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&q=80',
        'https://images.unsplash.com/photo-1520412099521-6afe73787a41?w=600&q=80',
        'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=600&q=80',
        'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&q=80',
        'https://images.unsplash.com/photo-1470058869855-412f56c3bb33?w=600&q=80',
        'https://images.unsplash.com/photo-1530092285049-1c42085fd695?w=600&q=80',
        'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&q=80',
        'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&q=80'
      ]
    : [
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80',
        'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600&q=80',
        'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=600&q=80',
        'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=600&q=80',
        'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=600&q=80',
        'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&q=80',
        'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&q=80',
        'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&q=80'
      ];

  const posts: Post[] = Array.from({ length: 12 }).map((_, idx) => {
    const postDate = new Date();
    postDate.setDate(postDate.getDate() - idx * 3);

    const type: Post['type'] = idx % 4 === 0 ? 'REEL' : idx % 4 === 1 ? 'CAROUSEL' : 'IMAGE';
    
    let caption = '';
    let hashtags: string[] = [];
    if (isPlantNiche) {
      const plantCaptions = [
        'My aquatic lotus pond is looking absolutely stunning after the rains! 🪷 Rainwater does wonders for these plants. Do you collect rainwater for your garden? #lotuspond #aquaticplants #indiagardening #rainwater',
        'Quick tip for repotting indoor palms: Always use a well-draining pot and add some perlite to your soil mix. Soil compaction is the #1 root killer! 🌿 #plantcare #indoorplants #gardeningtips',
        'A sneak peek into our nursery this monsoon morning. 💚 Everything is growing so fast, we can barely keep up. Drop by this weekend! #monsoongarden #nurserylife #plantshop',
        'How to propagate water lilies: Divide the tubers in spring or early monsoon, trim dead roots, and pot in heavy garden loam. Slide to see step-by-step! 👉 #waterlily #propagation #gardening101 #slide',
        'Why are your monstera leaves turning yellow? Usually, it is either overwatering or direct sun scorch. Check the top 2 inches of soil first! 🍂 #monsteracare #houseplants #plantparenting #greenthumb',
        'Watering morning routine. 🚿 Keeping these little ones happy is my favorite therapy session. Happy gardening friends! #wateringplants #mindfulgardening #plantloversofinstagram'
      ];
      caption = plantCaptions[idx % plantCaptions.length];
      hashtags = ['plantcare', 'indoorplants', 'gardeningtips', 'monsoongarden', 'greenthumb'];
    } else {
      const lifestyleCaptions = [
        'Getting some morning focus in before the rush. ☕💻 What is one goal you are hitting today? Let me know below! #workspace #productivity #codinglife #desksetup',
        'Exploring the quiet corners of the city. There is so much beauty in the things we walk past every day. 🏛️✨ #streetphotography #visualstorytelling #urbanexplore',
        'Creating consistent habits is far more important than intensity. 15 minutes of learning a day beats a weekly crash course. 📈 #growthmindset #personaldevelopment #learning',
        'New vlog is live! Sharing my weekly review process and how I stay organized using simple note apps. Link in bio! 👉 #vlog #productivityhacks #notetaking',
        'A quick aesthetic check-in from today\'s setup. Keeping it clean, simple, and light-filled. ☀️ #minimalist #desksetup #creativespace #wfh',
        'Behind the scenes of the latest shoot. It took about 30 takes just to get that 5-second transition right! 🎬 #bts #creatorlife #videoproduction'
      ];
      caption = lifestyleCaptions[idx % lifestyleCaptions.length];
      hashtags = ['productivity', 'desksetup', 'growthmindset', 'creatorlife', 'minimalist'];
    }

    const likes = Math.round(followers * (0.03 + Math.random() * 0.04));
    const comments = Math.round(likes * (0.03 + Math.random() * 0.05));
    const views = type === 'REEL' ? likes * 8 : undefined;

    return {
      id: `mock_post_${idx + 1}`,
      shortCode: `Code${idx + 100}`,
      type,
      thumbnailUrl: imagePool[idx % imagePool.length],
      caption,
      likes,
      comments,
      views,
      hashtags,
      mentions: ['instagram'],
      timestamp: postDate.toISOString(),
      isSponsored: false
    };
  });

  return { profile, posts };
}
