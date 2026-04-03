import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { transcribeAudio } from '@/lib/deepgram';
import { addEpisode, Episode, Guest, EpisodeCategory, EpisodeStatus } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File | null;
    const externalUrl = formData.get('externalUrl') as string | null;
    const title = formData.get('title') as string;
    const summary = formData.get('summary') as string;
    const category = (formData.get('category') as string || 'Geral') as EpisodeCategory;
    const status = (formData.get('status') as string || 'Produção') as EpisodeStatus;
    
    // Parse JSON arrays/objects from formData
    const rawGuests = formData.get('guests') as string;
    const rawPlatforms = formData.get('platforms') as string;
    
    const guests: Guest[] = rawGuests ? JSON.parse(rawGuests) : [];
    const platforms: string[] = rawPlatforms ? JSON.parse(rawPlatforms) : [];

    let transcriptionResult = null;
    let duration = '00:00';
    let audioUrl = '';

    // Generation of slug
    const slug = title.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // If we have a file, transcribe it
    if (audioFile) {
      const buffer = Buffer.from(await audioFile.arrayBuffer());
      transcriptionResult = await transcribeAudio(buffer, title, summary);
      
      const durSecs = transcriptionResult.duration || 0;
      duration = durSecs > 0 
        ? `${Math.floor(durSecs / 60)}:${Math.floor(durSecs % 60).toString().padStart(2, '0')}`
        : '00:00';
        
      audioUrl = `/uploads/${audioFile.name}`;
    } else if (externalUrl) {
      duration = 'Link Externo';
    }

    const newEpisode: Episode = {
      id: crypto.randomUUID(),
      slug,
      title,
      summary,
      category,
      status,
      duration,
      guests,
      platforms,
      createdAt: new Date().toISOString(),
      audioUrl: audioUrl || undefined,
      externalUrl: externalUrl || undefined,
      transcriptionText: transcriptionResult?.text || '',
    };

    await addEpisode(newEpisode);

    return NextResponse.json({ 
      success: true, 
      record: newEpisode 
    });
  } catch (error: any) {
    console.error('Transcription API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
