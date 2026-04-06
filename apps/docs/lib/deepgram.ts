/**
 * Deepgram AI Integration for PodcastAds
 * High-performance transcription for PT-BR
 */

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;

export interface TranscriptionResult {
  text: string;
  language: string;
  duration: number;
  isMock?: boolean;
}

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

    return {
      text: formattedText,
      language: 'pt-BR',
      duration: Math.round(duration),
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

  return {
    text: lines.join('\n'),
    language: 'pt-BR',
    duration: 30,
    isMock: true,
  };
}
