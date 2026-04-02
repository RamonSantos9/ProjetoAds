import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'Chave de API do PodcastADS não configurada' }, { status: 500 });
    }

    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'xi-api-key': apiKey,
      },
      next: { revalidate: 3600 } // Cache por 1 hora
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Erro ao buscar vozes' }, { status: response.status });
    }

    const data = await response.json();
    
    const targetNames = ["Adam", "Bella", "Rachel", "Antoni", "Josh"];
    const validImage = "https://eleven-public-cdn.elevenlabs.io/marketing_website/_next/static/media/Voice%20BG%2004.0d9fd817.png";
    const images = [validImage, validImage, validImage, validImage, validImage];
    
    const descriptions = [
      "Deep, Narrator type",
      "Professional, Calm",
      "Personable, Conversational",
      "Well-rounded, Energetic",
      "Kind, Bright"
    ];

    const defaultIds = [
      "pNInz6obpgDQGcFmaJgB",
      "EXAVITQu4vr4xnSDxMaL",
      "21m00Tcm4lJC7at66GYH",
      "ErXw9S1Qo7fPue0vof8q",
      "MF3mGyEYCl7XYW7LtpSj"
    ];

    // Áudio oficial dos defaults para preview instantâneo na web
    const defaultPreviewUrls = [
      "https://storage.googleapis.com/eleven-public-prod/premade/voices/CwhRBWXzGAHq8TQ4Fs17/58ee3ff5-f6f2-4628-93b8-e38eb31806b0.mp3",
      "https://storage.googleapis.com/eleven-public-prod/premade/voices/EXAVITQu4vr4xnSDxMaL/01a3e33c-6e99-4ee7-8543-ff2216a32186.mp3",
      "https://storage.googleapis.com/eleven-public-prod/premade/voices/FGY2WhTYpPnrIDTdsKH5/67341759-ad08-41a5-be6e-de12fe448618.mp3",
      "https://storage.googleapis.com/eleven-public-prod/premade/voices/IKne3meq5aSn9XLyUdCD/102de6f2-22ed-43e0-a1f1-111fa75c5481.mp3",
      "https://storage.googleapis.com/eleven-public-prod/premade/voices/JBFqnCBsd6RMkjVDRZzb/e6206d1a-0721-4787-aafb-06a6e705cac5.mp3"
    ];

    const finalVoices = targetNames.map((name, index) => {
      const realVoice = data.voices?.find((v: any) => v.name === name);
      return {
        id: realVoice ? realVoice.voice_id : defaultIds[index],
        name: name,
        description: realVoice ? (realVoice.description || realVoice.labels?.accent || descriptions[index]) : descriptions[index],
        image: images[index],
        previewUrl: realVoice ? (realVoice.preview_url || defaultPreviewUrls[index]) : defaultPreviewUrls[index],
        tags: realVoice?.labels ? Object.values(realVoice.labels) : []
      };
    });

    return NextResponse.json({ voices: finalVoices });
  } catch (error) {
    console.error('Erro na rota voices:', error);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}
