export type PodcastEpisode = {
  slug: string;
  title: string;
  category: string;
  duration: string;
  status: 'Publicado' | 'Em gravacao' | 'Em pauta';
  summary: string;
  guests: string[];
  platforms: string[];
};

export const featuredEpisodes: PodcastEpisode[] = [
  {
    slug: 'piloto-ads-serra-dourada',
    title: 'Episodio Piloto: O que e o PodcastADS?',
    category: 'Institucional',
    duration: '18 min',
    status: 'Publicado',
    summary:
      'Apresentacao oficial do projeto, da proposta de extensao e da conexao entre o curso de ADS, a faculdade e a comunidade.',
    guests: ['Equipe PodcastADS'],
    platforms: ['Spotify', 'YouTube'],
  },
  {
    slug: 'mercado-tech-regional',
    title: 'Mercado Tech Regional e Oportunidades em ADS',
    category: 'Carreira',
    duration: '26 min',
    status: 'Em gravacao',
    summary:
      'Conversa com empreendedores e profissionais da regiao sobre empregabilidade, portfolio e primeiros passos na tecnologia.',
    guests: ['Empreendedor local', 'Professor convidado'],
    platforms: ['Spotify', 'Instagram'],
  },
  {
    slug: 'soft-skills-para-desenvolvedores',
    title: 'Soft Skills para Desenvolvedores',
    category: 'Formacao',
    duration: '22 min',
    status: 'Em pauta',
    summary:
      'Debate sobre comunicacao, trabalho em equipe e postura profissional para estudantes e futuros desenvolvedores.',
    guests: ['Docente ADS', 'Aluno lider'],
    platforms: ['Spotify', 'YouTube', 'Instagram'],
  },
];

export const publicStats = [
  { label: 'Episodios planejados', value: '12+' },
  { label: 'Frentes do projeto', value: '3' },
  { label: 'Plataformas de distribuicao', value: '3' },
  { label: 'Acesso', value: 'Publico' },
];
