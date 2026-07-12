import { NextRequest, NextResponse } from 'next/server';
import { generateJSON } from '@/lib/api/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { contentType, topic, tone } = body;

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required.' }, { status: 400 });
    }

    const prompt = `
      You are an expert Instagram copywriter, content strategist, and growth hacker.
      Your task is to write a highly engaging Instagram post outline based on the user's requirements:
      - Content Format: ${contentType ?? 'REEL'}
      - Topic/Keywords: ${topic}
      - Tone of Voice: ${tone ?? 'Inspirational & Professional'}

      You must return ONLY a JSON object matching this structure:
      {
        "contentType": "${contentType ?? 'REEL'}",
        "theme": "A short, punchy category or theme title",
        "idea": "The core concept or visual outline of the post",
        "hook": "An attention-grabbing text overlay hook (under 15 words) that stops the scroll",
        "caption": "The complete post caption. Structure it with hooks-first, space-padded bullet lists, value tips, and high engagement spacing",
        "script": "If content format is REEL, provide a word-for-word voiceover script with visual cues. If not a Reel, make this an empty string",
        "cta": "A call-to-action that encourages comments, saves, or shares",
        "hashtags": ["list", "of", "5", "to", "7", "relevant", "niche", "hashtags"]
      }

      Do not include any markdown fences or explanation before/after the JSON. Just return the raw JSON string.
    `;

    const result = await generateJSON<any>(prompt);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Error generating custom post strategy:', err);
    
    // Safety Fallback for local demo if API key isn't loaded
    const fallback = {
      contentType: 'REEL',
      theme: 'Growth Strategy',
      idea: 'Show visual checklist on screen while voiceover explains key insights.',
      hook: 'The 3 mistakes you are making on Instagram right now.',
      caption: 'Are you still doing these? Let me show you how to improve your engagement in 3 simple steps.\n\n👉 Focus on hook text overlay\n👉 Interact in comments\n👉 Post high quality Reels',
      script: 'Hook: The 3 mistakes you... [Show screen recording of hooks]... [Narrator explains key takeaways]...',
      cta: 'Comment "GROWTH" and I will send you the template links!',
      hashtags: ['#instagramtips', '#contentcreator', '#socialmediastrategy']
    };
    
    return NextResponse.json(fallback);
  }
}
