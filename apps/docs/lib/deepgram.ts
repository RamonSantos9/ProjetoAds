/**
 * Deepgram AI Integration for PodcastAds
 * High-performance transcription for PT-BR
 */

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;

export interface TranscriptionResult {
  text: string;
  language: string;
  duration: number;
  segments: TranscriptionSegment[];
  words?: WordItem[];
  isMock?: boolean;
}

import { TranscriptionSegment, WordItem } from './db';

/**
 * Transcribes audio using Deepgram (v1/listen).
 */
export async function transcribeAudio(
  audioBuffer: Buffer,
  title: string,
  summary: string,
): Promise<TranscriptionResult> {
  if (!DEEPGRAM_API_KEY) {
    console.warn('[Deepgram] Chave não encontrada. Usando modo de simulação.');
    return generateMockTranscription(title, summary, 'Chave de API ausente');
  }

  try {
    const queryParams = new URLSearchParams({
      model: 'nova-2',
      language: 'pt-BR',
      smart_format: 'true',
      paragraphs: 'true',
      utterances: 'true',
      diarize: 'true',
    });

    const response = await fetch(
      `https://api.deepgram.com/v1/listen?${queryParams.toString()}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Token ${DEEPGRAM_API_KEY}`,
          'Content-Type': 'audio/mpeg', // Deepgram detects type automatically, but this is a safe hint
        },
        body: audioBuffer as any,
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[Deepgram] Erro na API:', errorData);

      if (
        response.status === 401 ||
        response.status === 402 ||
        response.status === 429
      ) {
        return generateMockTranscription(
          title,
          summary,
          `Deepgram ${response.status}`,
        );
      }
      throw new Error(`Deepgram API Error: ${response.statusText}`);
    }

    const data = await response.json();

    // Deepgram returns results in various ways. Utterances are good for timestamps.
    const utterances = data.results?.utterances || [];
    const transcript =
      data.results?.channels[0]?.alternatives[0]?.transcript || '';

    // Format into [00:00] Text
    let formattedText = '';

    if (utterances.length > 0) {
      formattedText = utterances
        .map((u: any) => {
          const minutes = Math.floor(u.start / 60)
            .toString()
            .padStart(2, '0');
          const seconds = Math.floor(u.start % 60)
            .toString()
            .padStart(2, '0');
          return `[${minutes}:${seconds}] ${u.transcript.trim()}`;
        })
        .join('\n');
    } else {
      // Fallback if utterances are missing but transcript exists
      formattedText = `[00:00] ${transcript}`;
    }

    const duration = data.metadata?.duration || 0;
    const allWords: WordItem[] = data.results?.channels[0]?.alternatives[0]?.words || [];

    // Convert Utterances to TranscriptionSegments and assign words to them
    const segments: TranscriptionSegment[] = utterances.map((u: any, index: number) => {
      // Find words that belong to this utterance based on timing
      const utteranceWords = allWords.filter(w => w.start >= u.start && w.end <= u.end);
      
      return {
        id: `seg-${index}-${Date.now()}`,
        start: u.start,
        end: u.end,
        speaker: `Speaker ${u.speaker || 0}`,
        text: u.transcript.trim(),
        words: utteranceWords.map(w => ({
          word: w.word,
          start: w.start,
          end: w.end,
          confidence: w.confidence,
          punctuated_word: w.punctuated_word,
          speaker: u.speaker
        }))
      };
    });

    return {
      text: formattedText,
      language: 'pt-BR',
      duration: Math.round(duration),
      segments,
      words: allWords
    };
  } catch (error) {
    console.error('[Deepgram] Falha na transcrição:', error);
    return generateMockTranscription(title, summary, 'Erro na Conexão');
  }
}

/**
 * Fallback simulation
 */
async function generateMockTranscription(
  title: string,
  summary: string,
  reason: string,
): Promise<TranscriptionResult> {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const lines = [
    `[00:00] (Simulação por motivo: ${reason})`,
    `[00:02] Iniciando o processamento do episódio: ${title}.`,
    `[00:08] Contexto detectado: ${summary.substring(0, 50)}...`,
    `[00:15] O sistema Deepgram está pronto para integrar sua chave real.`,
    `[00:22] A transcrição automática em Português-BR aparecerá aqui.`,
  ];

  const segments: TranscriptionSegment[] = lines.map((line, idx) => {
    const timeMatch = line.match(/\[(\d+):(\d+)\]/);
    const start = timeMatch ? parseInt(timeMatch[1]) * 60 + parseInt(timeMatch[2]) : idx * 5;
    return {
      id: `mock-seg-${idx}`,
      start,
      end: start + 4,
      speaker: idx % 2 === 0 ? 'Mia' : 'Whiskers',
      text: line.replace(/\[\d+:\d+\]\s*/, ''),
    };
  });

  return {
    text: lines.join('\n'),
    language: 'pt-BR',
    duration: 30,
    segments,
    isMock: true,
  };
}
