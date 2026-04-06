/**
 * Landing Page Data
 */

export interface Language {
  code: string;
  name: string;
  flagUrl: string;
}

export interface Voice {
  id: string;
  name: string;
  description: string;
  image: string;
  previewUrl: string;
}

export const categories = [
  'Institucional',
  'Carreira',
  'Formação',
  'Tecnologia',
  'Inovação',
  'Mercado',
];

export const languages: Language[] = [
  {
    code: 'pt-BR',
    name: 'Português',
    flagUrl: 'https://flagcdn.com/w40/br.png',
  },
  {
    code: 'en-US',
    name: 'English',
    flagUrl: 'https://flagcdn.com/w40/us.png',
  },
  {
    code: 'es-ES',
    name: 'Español',
    flagUrl: 'https://flagcdn.com/w40/es.png',
  },
];

export const voices: Voice[] = [
  {
    id: 'v1',
    name: 'Ramon',
    description: 'Narrativo e profissional',
    image: '/images/home/orb-1.png',
    previewUrl: '#',
  },
  {
    id: 'v2',
    name: 'Marta',
    description: 'Calma e educativa',
    image: '/images/home/orb-4.png',
    previewUrl: '#',
  },
  {
    id: 'v3',
    name: 'Tech Bot',
    description: 'Futurista e robótico',
    image: '/images/home/orb-5.png',
    previewUrl: '#',
  },
];
