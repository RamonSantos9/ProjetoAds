/**
 * ElevenLabs AI Integration for PodcastAds
 * This library handles the communication with ElevenLabs API for Speech-to-Text.
 */

const ELEVENLABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || '';
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

export interface TranscriptionRequest {
  file: File;
  language?: string;
  model_id?: string;
}

export interface TranscriptionResponse {
  transcription_id: string;
  status: 'processing' | 'completed' | 'error';
  text?: string;
}

/**
 * Sends an audio file to ElevenLabs for transcription.
 * Note: ElevenLabs recently added Speech-to-Text/Dubbing capabilities.
 */
export async function createTranscription({
  file,
  language = 'pt-BR',
}: TranscriptionRequest): Promise<TranscriptionResponse> {
  if (!ELEVENLABS_API_KEY) {
    console.warn('ElevenLabs API Key not found. Transcription will be mocked.');
    return mockTranscription();
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('language', language);
  // Example model for speech-to-text if available on ElevenLabs,
  // otherwise this might use their Dubbing API or similar for extraction.
  formData.append('model_id', 'eleven_multilingual_v2');

  try {
    // This is a placeholder for the actual ElevenLabs Speech-to-Text endpoint
    // Adjust once the specific endpoint is confirmed (e.g., /v1/speech-to-text)
    const response = await fetch(`${ELEVENLABS_API_URL}/speech-to-text`, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Transcription failed:', error);
    throw error;
  }
}

/**
 * Mocks the transcription process for development.
 */
async function mockTranscription(): Promise<TranscriptionResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        transcription_id: `mock-${Math.random().toString(36).substring(7)}`,
        status: 'processing',
      });
    }, 1500);
  });
}

/**
 * Checks the status of a transcription.
 */
export async function getTranscriptionStatus(
  id: string,
): Promise<TranscriptionResponse> {
  if (id.startsWith('mock-')) {
    return {
      transcription_id: id,
      status: 'completed',
      text: 'Esta é uma transcrição gerada pelo simulador da ElevenLabs para o PodcastAds. O sistema está pronto para integração real.',
    };
  }

  const response = await fetch(`${ELEVENLABS_API_URL}/transcriptions/${id}`, {
    headers: {
      'xi-api-key': ELEVENLABS_API_KEY,
    },
  });

  return await response.json();
}
