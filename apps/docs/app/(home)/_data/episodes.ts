export type PodcastEpisode = {
  slug: string;
  title: string;
  category: string;
  duration: string;
  status: 'Publicado' | 'Em gravação' | 'Em pauta';
  summary: string;
  guests: string[];
  platforms: string[];
};

export const featuredEpisodes: PodcastEpisode[] = [
  {
    slug: 'piloto-ads-serra-dourada',
    title: 'Episódio Piloto: O que é o PodcastAds?',
    category: 'Institucional',
    duration: '18 min',
    status: 'Publicado',
    summary:
      'Apresentação oficial do projeto, da proposta de extensão e da conexão entre o curso de ADS, a faculdade e a comunidade.',
    guests: ['Equipe PodcastAds'],
    platforms: ['Spotify', 'YouTube'],
  },
  {
    slug: 'mercado-tech-regional',
    title: 'Mercado Tech Regional e Oportunidades em ADS',
    category: 'Carreira',
    duration: '26 min',
    status: 'Em gravação',
    summary:
      'Conversa com empreendedores e profissionais da região sobre empregabilidade, portfólio e primeiros passos na tecnologia.',
    guests: ['Empreendedor local', 'Professor convidado'],
    platforms: ['Spotify', 'Instagram'],
  },
  {
    slug: 'soft-skills-para-desenvolvedores',
    title: 'Soft Skills para Desenvolvedores',
    category: 'Formação',
    duration: '22 min',
    status: 'Em pauta',
    summary:
      'Debate sobre comunicação, trabalho em equipe e postura profissional para estudantes e futuros desenvolvedores.',
    guests: ['Docente ADS', 'Aluno líder'],
    platforms: ['Spotify', 'YouTube', 'Instagram'],
  },
];

export const publicStats = [
  { label: 'Episódios planejados', value: '12+' },
  { label: 'Frentes do projeto', value: '3' },
  { label: 'Plataformas de distribuição', value: '3' },
  { label: 'Acesso', value: 'Público' },
];
