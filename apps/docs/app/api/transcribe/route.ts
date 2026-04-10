import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { transcribeAudio } from '@/lib/deepgram';
import {
  addEpisode,
  getEpisodeById,
  updateEpisode,
  Episode,
  Guest,
  EpisodeCategory,
  EpisodeStatus,
} from '@/lib/db';
import { auth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File | null;
    const imageFile = formData.get('image') as File | null;
    const externalUrl = formData.get('externalUrl') as string | null;
    const title = formData.get('title') as string;
    const summary = formData.get('summary') as string;
    const category = ((formData.get('category') as string) ||
      'Geral') as EpisodeCategory;
    const status = ((formData.get('status') as string) ||
      'Produção') as EpisodeStatus;

    const sourceType = formData.get('sourceType') as string | null;

    // Parse JSON arrays/objects from formData
    const rawGuests = formData.get('guests') as string;
    const rawPlatforms = formData.get('platforms') as string;

    const guests: Guest[] = rawGuests ? JSON.parse(rawGuests) : [];
    const platforms: string[] = rawPlatforms ? JSON.parse(rawPlatforms) : [];

    let transcriptionResult = null;
    let duration = '00:00';
    let audioUrl = '';
    let imageUrl = '';

    // Generation of slug
    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Ensure upload directory exists - Use a path relative to this file to be safer in monorepos
    const fs = require('fs');
    const path = require('path');
    // In Next.js App Router, process.cwd() is usually the project root (apps/docs)
    // but we can make it more explicit if needed.
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
    } catch (dirErr) {
      console.error('[API Transcribe] Error creating upload directory:', dirErr);
    }

    // Handle Image upload if present
    if (imageFile && imageFile.name) {
      try {
        const imgBuffer = Buffer.from(await imageFile.arrayBuffer());
        const imgPath = path.join(uploadDir, imageFile.name);
        fs.writeFileSync(imgPath, imgBuffer);
        imageUrl = `/uploads/${imageFile.name}`;
        console.log(`[API Transcribe] Image saved to ${imageUrl}`);
      } catch (imgErr) {
        console.error('[API Transcribe] Error saving image:', imgErr);
      }
    }

    // Process Audio (File OR External Link)
    let audioBuffer: Buffer | null = null;
    let audioFileName = '';

    if (audioFile && audioFile.name) {
      audioBuffer = Buffer.from(await audioFile.arrayBuffer());
      audioFileName = audioFile.name;
    } else if (externalUrl && externalUrl.startsWith('http')) {
      try {
        console.log(`[API Transcribe] Downloading external audio from: ${externalUrl}`);
        
        if (externalUrl.includes('youtube.com') || externalUrl.includes('youtu.be')) {
          console.error('[API Transcribe] YouTube downloading requires dedicated infrastructure.');
          return NextResponse.json(
            { error: 'Links do YouTube não podem ser baixados sem infraestrutura dedicada. Baixe o MP3 manualmente e envie como Arquivo.' },
            { status: 400 }
          );
        } else {
          // Normal HTTP File Check
          const response = await fetch(externalUrl);
          
          const contentType = response.headers.get('content-type') || '';
          if (contentType.includes('text/html')) {
            console.log('[API Transcribe] URL is a webpage, skipping direct audio download.');
          } else {
            if (!response.ok) throw new Error(`Falha ao baixar áudio: ${response.statusText}`);
            
            const arrayBuffer = await response.arrayBuffer();
            audioBuffer = Buffer.from(arrayBuffer);
            
            const extension = externalUrl.split('.').pop()?.split('?')[0] || 'mp3';
            audioFileName = `external-${slug}-${crypto.randomUUID().slice(0, 8)}.${extension}`;
          }
        }
      } catch (fetchErr) {
        console.error('[API Transcribe] Error fetching external audio/video:', fetchErr);
      }
    }

    // If we have an audio buffer (from file or download), transcribe and save it
    if (audioBuffer && audioFileName) {
      try {
        // Save file to public/uploads
        const audioPath = path.join(uploadDir, audioFileName);
        fs.writeFileSync(audioPath, audioBuffer);
        console.log(`[API Transcribe] Audio saved to /uploads/${audioFileName}`);

        transcriptionResult = await transcribeAudio(audioBuffer, title, summary);

        const durSecs = transcriptionResult.duration || 0;
        duration =
          durSecs > 0
            ? `${Math.floor(durSecs / 60)}:${Math.floor(durSecs % 60)
                .toString()
                .padStart(2, '0')}`
            : '00:00';

        audioUrl = `/uploads/${audioFileName}`;
      } catch (audioErr) {
        console.error('[API Transcribe] Error saving/transcribing audio:', audioErr);
      }
    } else if (externalUrl) {
      // Fallback if download skipped (like Spotify)
      duration = 'Link Spotify/Externo';
      audioUrl = ''; // Clear to force UI to use externalUrl
    }

    console.log('[API Transcribe] FormData Keys:', Array.from(formData.keys()));
    const id = formData.get('id') as string | null;
    console.log('[API Transcribe] Target ID:', id);

    let finalEpisode: Episode;

    if (id) {
      console.log('[API Transcribe] Mode: UPDATE');
      // Fetch existing data to avoid wiping out fields not present in FormData
      const existing = await getEpisodeById(id);
      if (!existing) throw new Error('Episódio não encontrado para atualização');

      finalEpisode = {
        ...existing,
        title: title || existing.title,
        summary: summary || existing.summary,
        category: category || existing.category,
        status: status || existing.status,
        guests: guests.length > 0 ? guests : existing.guests,
        platforms: platforms.length > 0 ? platforms : existing.platforms,
      };

      // If new image was uploaded
      if (imageUrl) {
        finalEpisode.image = imageUrl;
      }

      // Explicit logic for source replacement
      if (sourceType === 'link') {
        finalEpisode.externalUrl = externalUrl || undefined;
        finalEpisode.audioUrl = audioUrl || undefined; // Clear if Spotify, set if downloaded MP3
        if (!audioUrl) finalEpisode.duration = duration;
        else finalEpisode.duration = duration;
      } else if (sourceType === 'file' && formData.get('removeAudio') === 'true') {
        finalEpisode.audioUrl = undefined;
        finalEpisode.externalUrl = undefined;
        finalEpisode.duration = '00:00';
      } else if (audioUrl && audioFile) {
        // Direct file upload Overrides any old link
        finalEpisode.audioUrl = audioUrl;
        finalEpisode.externalUrl = undefined;
        finalEpisode.duration = duration;
        finalEpisode.transcriptionText = transcriptionResult?.text || '';
        finalEpisode.segments = transcriptionResult?.segments || [];
      }
    } else {
      console.log('[API Transcribe] Mode: CREATE');
      finalEpisode = {
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
        image: imageUrl || undefined,
        audioUrl: audioUrl || undefined,
        externalUrl: externalUrl || undefined,
        transcriptionText: transcriptionResult?.text || '',
        segments: transcriptionResult?.segments || [],
      };
    }

    try {
      if (id) {
        await updateEpisode(id, finalEpisode, session.user.id);
      } else {
        await addEpisode(finalEpisode, session.user.id);
      }
    } catch (dbErr: any) {
      console.error('[API Transcribe] Database Error:', dbErr);
      throw new Error(`DB Error: ${dbErr.message}`);
    }

    console.log('[API Transcribe] Operation successful');
    return NextResponse.json({
      success: true,
      record: finalEpisode,
    });
  } catch (error: any) {
    console.error('Transcription API Final Error:', error);
    try {
      const fs = require('fs');
      fs.appendFileSync('api-errors.log', `${new Date().toISOString()} - ${error.message}\n${error.stack}\n\n`);
    } catch (e) {}
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Erro interno na transcrição',
        details: error.stack?.split('\n')[0],
        timestamp: new Date().toISOString()
      },
      { status: 500 },
    );
  }
}
