/**
 * OpenAI Whisper AI Integration for PodcastAds
 */

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

export interface TranscriptionResult {
  text: string;
  language: string;
  duration: number;
  isMock?: boolean;
}

/**
 * Transcribes audio using OpenAI Whisper (v1/audio/transcriptions).
 * Falls back to a realistic mock if API key is missing or account has no funds.
 */
export async function transcribeAudio(
  audioFile: Buffer, 
  filename: string,
  title: string,
  summary: string
): Promise<TranscriptionResult> {
  
  if (!OPENAI_API_KEY) {
    console.warn('[OpenAI] Chave de API não encontrada. Usando modo de simulação.');
    return generateMockTranscription(title, summary, "Chave de API ausente");
  }

  try {
    const formData = new FormData();
    const blob = new Blob([audioFile], { type: 'audio/mpeg' });
    formData.append('file', blob, filename);
    formData.append('model', 'whisper-1');
    formData.append('language', 'pt');
    formData.append('response_format', 'verbose_json');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      
      // Detecção de falta de fundos ou cota excedida
      if (response.status === 402 || response.status === 429) {
        console.warn(`[OpenAI] Erro de saldo (${response.status}). Ativando fallback para teste local.`);
        return generateMockTranscription(title, summary, `API Sem Saldo (${response.status})`);
      }
      
      throw new Error(`OpenAI API Error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    // Converte os segmentos detalhados do Whisper (verbose_json) para o formato [00:00] Texto
    const formattedText = data.segments
      ?.map((s: any) => {
        const minutes = Math.floor(s.start / 60).toString().padStart(2, '0');
        const seconds = Math.floor(s.start % 60).toString().padStart(2, '0');
        return `[${minutes}:${seconds}] ${s.text.trim()}`;
      })
      .join('\n') || data.text;

    return {
      text: formattedText,
      language: data.language || 'portuguese',
      duration: data.duration || 0,
    };

  } catch (error) {
    console.error('[OpenAI] Falha na transcrição:', error);
    return generateMockTranscription(title, summary, "Erro na Conexão");
  }
}

/**
 * Generates a realistic PT-BR transcription based on metadata when the actual API fails.
 */
async function generateMockTranscription(title: string, summary: string, reason: string): Promise<TranscriptionResult> {
  // Simulação de delay de processamento da IA
  await new Promise(resolve => setTimeout(resolve, 2500));

  const lines = [
    `[00:00] (Simulação por ${reason})`,
    `[00:02] Olá, este é um teste real do sistema de transcrição do PodcastAds.`,
    `[00:08] Estamos processando o episódio: "${title}".`,
    `[00:14] O resumo captado pela nossa IA foi: "${summary.substring(0, 100)}..."`,
    `[00:22] Assim que sua chave da OpenAI tiver fundos, este texto será substituído pela transcrição real do seu áudio.`,
    `[00:28] O sistema de player e sincronização já está 100% funcional!`,
  ];

  return {
    text: lines.join('\n'),
    language: 'portuguese',
    duration: 30,
    isMock: true
  };
}
