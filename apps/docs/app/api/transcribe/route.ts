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
import { getActiveWorkspaceId } from '@/lib/workspace';

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
    const scheduledAt = formData.get('scheduledAt') as string | null;

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

    // Process Audio File
    let audioBuffer: Buffer | null = null;
    let audioFileName = '';

    if (audioFile && audioFile.name) {
      audioBuffer = Buffer.from(await audioFile.arrayBuffer());
      audioFileName = audioFile.name;
    }

    // If we have an audio buffer, transcribe and save it
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
        scheduledAt: scheduledAt !== null ? scheduledAt : existing.scheduledAt,
        guests: guests.length > 0 ? guests : existing.guests,
        platforms: platforms.length > 0 ? platforms : existing.platforms,
      };

      // If new image was uploaded
      if (imageUrl) {
        finalEpisode.image = imageUrl;
      }

      if (audioUrl && audioFile) {
        // Direct file upload
        finalEpisode.audioUrl = audioUrl;
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
        status: status || 'Produção', // Default to 'Produção'
        scheduledAt: scheduledAt || null,
        duration,
        guests,
        platforms,
        createdAt: new Date().toISOString(),
        image: imageUrl || undefined,
        audioUrl: audioUrl || undefined,
        transcriptionText: transcriptionResult?.text || '',
        segments: transcriptionResult?.segments || [],
      };
    }

    const workspaceId = await getActiveWorkspaceId();

    try {
      if (id) {
        await updateEpisode(id, finalEpisode, session.user.id!, (session.user as any).role, workspaceId);
      } else {
        await addEpisode(finalEpisode, session.user.id!, workspaceId);
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
