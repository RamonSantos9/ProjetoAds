import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text: rawText, voiceId, languageCode } = await req.json();

    if (!rawText || !voiceId) {
      return NextResponse.json({ error: 'Faltando texto ou voiceId' }, { status: 400 });
    }

    // Strip [emotion_tags] from text — the turbo model reads them as literal words
    const text = rawText.replace(/\[.*?\]/g, '').replace(/\s{2,}/g, ' ').trim();

    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
      console.error('API KEY do PodcastAds não configurada');
      return NextResponse.json({ error: 'Erro de configuração no servidor' }, { status: 500 });
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_turbo_v2_5',
        language_code: languageCode,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro na API de Voz do PodcastAds:', errorText);
      try {
        if (response.status === 402) {
          return NextResponse.json({ error: 'Limite de créditos da API atingido.' }, { status: 402 });
        }
        const errorData = JSON.parse(errorText);
        return NextResponse.json({ error: errorData.detail?.status || errorData.detail || 'Erro ao gerar áudio' }, { status: response.status });
      } catch {
        return NextResponse.json({ error: 'Erro ao gerar áudio (Resposta inválida)' }, { status: response.status });
      }
    }

    // /with-timestamps returns JSON: { audio_base64, alignment: { characters, character_start_times_seconds, character_end_times_seconds } }
    const data = await response.json();

    return NextResponse.json({
      audioBase64: data.audio_base64,
      alignment: data.alignment,
    });

  } catch (error) {
    console.error('Erro na rota TTS:', error);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}
