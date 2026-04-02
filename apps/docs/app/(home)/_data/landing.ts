'use client';

export interface Voice {
  id: string;
  name: string;
  description: string;
  image: string;
  previewUrl?: string;
  tags?: string[];
}

export interface Language {
  code: string;
  name: string;
  flagUrl: string;
  defaultText: string;
}

const voiceImage =
  'https://eleven-public-cdn.elevenlabs.io/marketing_website/_next/static/media/Voice%20BG%2004.0d9fd817.png';

export const categories = [
  'Texto para Fala',
  'Fala para Texto',
  'Dublagem',
];

export const languages: Language[] = [
  {
    code: 'pt',
    name: 'Português',
    flagUrl: 'https://flagcdn.com/w40/br.png',
    defaultText:
      'Transforme este texto em uma narração natural com a qualidade do PodcastADS.',
  },
  {
    code: 'en',
    name: 'English',
    flagUrl: 'https://flagcdn.com/w40/us.png',
    defaultText:
      'Turn this text into natural narration with PodcastADS quality voice synthesis.',
  },
  {
    code: 'es',
    name: 'Español',
    flagUrl: 'https://flagcdn.com/w40/es.png',
    defaultText:
      'Convierte este texto en una narração natural con la voz de PodcastADS.',
  },
];

export const voices: Voice[] = [
  {
    id: 'pNInz6obpgDQGcFmaJgB',
    name: 'Adam',
    description: 'Voz profunda, estilo narrador',
    image: voiceImage,
    previewUrl:
      'https://storage.googleapis.com/eleven-public-prod/premade/voices/CwhRBWXzGAHq8TQ4Fs17/58ee3ff5-f6f2-4628-93b8-e38eb31806b0.mp3',
  },
  {
    id: 'EXAVITQu4vr4xnSDxMaL',
    name: 'Bella',
    description: 'Profissional, calma',
    image: voiceImage,
    previewUrl:
      'https://storage.googleapis.com/eleven-public-prod/premade/voices/EXAVITQu4vr4xnSDxMaL/01a3e33c-6e99-4ee7-8543-ff2216a32186.mp3',
  },
  {
    id: '21m00Tcm4lJC7at66GYH',
    name: 'Rachel',
    description: 'Carismática, conversacional',
    image: voiceImage,
    previewUrl:
      'https://storage.googleapis.com/eleven-public-prod/premade/voices/FGY2WhTYpPnrIDTdsKH5/67341759-ad08-41a5-be6e-de12fe448618.mp3',
  },
  {
    id: 'ErXw9S1Qo7fPue0vof8q',
    name: 'Antoni',
    description: 'Versátil, enérgico',
    image: voiceImage,
    previewUrl:
      'https://storage.googleapis.com/eleven-public-prod/premade/voices/IKne3meq5aSn9XLyUdCD/102de6f2-22ed-43e0-a1f1-111fa75c5481.mp3',
  },
  {
    id: 'MF3mGyEYCl7XYW7LtpSj',
    name: 'Josh',
    description: 'Gentil, brilhante',
    image: voiceImage,
    previewUrl:
      'https://storage.googleapis.com/eleven-public-prod/premade/voices/JBFqnCBsd6RMkjVDRZzb/e6206d1a-0721-4787-aafb-06a6e705cac5.mp3',
  },
];
