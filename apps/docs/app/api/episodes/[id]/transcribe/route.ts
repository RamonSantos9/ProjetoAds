import { NextRequest, NextResponse } from 'next/server';
import { getEpisodeById, updateEpisode, TimelineTrack, TranscriptionSegment } from '@/lib/db';
import { transcribeAudio } from '@/lib/deepgram';
import { auth } from '@/lib/auth';
import fs from 'node:fs';
import path from 'node:path';

async function getAudioBuffer(url: string): Promise<Buffer> {
  if (url.startsWith('/uploads/')) {
    const fileName = url.replace('/uploads/', '');
    const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
    if (!fs.existsSync(filePath)) throw new Error(`Arquivo local não encontrado: ${url}`);
    return fs.readFileSync(filePath);
  } else if (url.startsWith('http')) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Falha ao baixar áudio: ${url}`);
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
  throw new Error(`URL de áudio inválida: ${url}`);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    const { id } = await params;
    
    // 1. Get episode
    const episode = await getEpisodeById(id);
    if (!episode) {
      return NextResponse.json({ error: 'Episódio não encontrado' }, { status: 404 });
    }

    // Determine sources for transcription
    // If tracks exist, use them. Otherwise use main audioUrl.
    const audioSources: { url: string; startTime: number; name: string }[] = [];
    
    if (episode.tracks && episode.tracks.length > 0) {
      episode.tracks.forEach((track: TimelineTrack) => {
        if (track.url) {
          audioSources.push({
            url: track.url,
            startTime: track.startTime || 0,
            name: track.name || 'Trilha'
          });
        }
      });
    } else if (episode.audioUrl) {
      audioSources.push({
        url: episode.audioUrl,
        startTime: 0,
        name: 'Áudio Principal'
      });
    }

    if (audioSources.length === 0) {
      return NextResponse.json({ error: 'Não há áudio ou trilhas para transcrever.' }, { status: 400 });
    }

    console.log(`[Transcription API] Processando ${audioSources.length} fontes para o episódio ${id}`);

    // 2. Process Transcription for each source
    let allSegments: TranscriptionSegment[] = [];

    for (const source of audioSources) {
      try {
        const audioBuffer = await getAudioBuffer(source.url);
        const result = await transcribeAudio(
          audioBuffer, 
          source.name, 
          episode.summary || 'Segmento de áudio da timeline'
        );

        // Shift timestamps by startTime for segments and internal words
        const shiftedSegments = result.segments.map(seg => ({
          ...seg,
          id: `scr-${source.url.slice(-5)}-${seg.id}`, // Unique ID
          start: seg.start + source.startTime,
          end: seg.end + source.startTime,
          words: seg.words?.map(w => ({
            ...w,
            start: w.start + source.startTime,
            end: w.end + source.startTime
          }))
        }));

        allSegments = [...allSegments, ...shiftedSegments];
      } catch (err) {
        console.error(`[Transcription API] Erro na trilha ${source.url}:`, err);
        // Continue with other tracks if one fails? For now, yes.
      }
    }

    // 3. Sort segments by start time
    allSegments.sort((a, b) => a.start - b.start);

    // 4. Create formatted text
    const formatTime = (s: number) =>
      `${Math.floor(s / 60).toString().padStart(2, '0')}:${Math.floor(s % 60).toString().padStart(2, '0')}`;

    const transcriptionText = allSegments
      .map(s => `[${formatTime(s.start)}] ${s.text}`)
      .join('\n');

    // 5. Update Episode in DB
    await updateEpisode(id, {
      transcriptionText,
      segments: allSegments,
    }, session.user.id);

    return NextResponse.json({
      success: true,
      segments: allSegments,
      transcriptionText
    });

  } catch (error: any) {
    console.error('Transcription Multi-track API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
