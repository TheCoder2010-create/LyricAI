import { config } from 'dotenv';
config();

import '@/ai/flows/lyric-generation.ts';
import '@/ai/flows/tts-flow.ts';
import '@/ai/tools/spotify.ts';
import '@/ai/flows/album-art-generation.ts';
