import fs from 'node:fs/promises';
import path from 'node:path';

const getDbPath = () => {
  const cwd = process.cwd();
  // Detect if we're in the monorepo root or already in the app docs folder
  if (cwd.endsWith('apps/docs') || cwd.includes('apps\\docs') || cwd.includes('apps/docs')) {
    return path.resolve(cwd, 'lib', 'db.json');
  }
  // Assume monorepo root
  return path.resolve(cwd, 'apps/docs/lib/db.json');
};
const DB_PATH = getDbPath();

export type EpisodeStatus = 'Publicado' | 'Em gravação' | 'Em pauta' | 'Processando' | 'Concluído' | 'Erro' | 'Produção' | 'Rascunho' | 'Agendado';
export type EpisodeCategory = 'Institucional' | 'Carreira' | 'Formação' | 'Entrevista' | 'Geral';

export interface Guest {
  name: string;
  bio?: string;
  social?: string;
  avatar?: string;
}

export interface Episode {
  id: string;             // unique identifier
  slug: string;
  title: string;          // Maps from "episodeTitle" and "title"
  summary: string;
  category: EpisodeCategory;
  status: EpisodeStatus;
  duration: string;
  guests: Guest[];
  platforms: string[];
  createdAt: string;

  // Transcription-specific fields (optional)
  audioUrl?: string;
  externalUrl?: string; // YouTube, Spotify, etc.
  transcriptionText?: string;
  language?: string;
  confidence?: number;
  image?: string;       // URL for persisted image
  imageFile?: any;      // Local File object for optimistic UI
}

export interface Feedback {
  avatar: string;
  user: string;
  role: string;
  message: string;
}

export interface DbSchema {
  episodes: Episode[];
  feedbacks: Feedback[];
}

const initialFeedbacks: Feedback[] = [
  {
    avatar: 'https://avatars.githubusercontent.com/u/1',
    user: 'Prof. Anderson',
    role: 'Coordenador de ADS',
    message: `O PodcastAds é uma ferramenta fundamental para levar o conhecimento teórico da sala de aula para o mundo real, conectando nossos alunos com profissionais do mercado.`,
  },
  {
    avatar: 'https://avatars.githubusercontent.com/u/35677084',
    user: 'Júlia Santos',
    role: 'Aluna do 4º Período',
    message: `Adoro ouvir os episódios no caminho para a faculdade. As dicas sobre carreira e tecnologia me ajudam muito a decidir em qual área me especializar.`,
  },
  {
    avatar: 'https://avatars.githubusercontent.com/u/3',
    user: 'Tech Inovação',
    role: 'Empresa Parceira',
    message: 'Uma iniciativa incrível da Serra Dourada. Talentos são formados quando há essa troca de experiências que o podcast proporciona.',
  },
  {
    avatar: 'https://avatars.githubusercontent.com/u/10645823',
    user: 'Ricardo Lima',
    role: 'Desenvolvedor Fullstack',
    message: `Eu não teria a chance de aprender tanto sobre o mercado de trabalho sem as conversas incríveis deste podcast! 💚`,
  },
];

const initialEpisodes: Episode[] = [
  {
    id: 'ep-1',
    slug: 'piloto-ads-serra-dourada',
    title: 'Episódio Piloto: O que é o PodcastAds?',
    category: 'Institucional',
    duration: '18 min',
    status: 'Publicado',
    summary: 'Apresentação oficial do projeto, da proposta de extensão e da conexão entre o curso de ADS, a faculdade e a comunidade.',
    guests: [{ name: 'Equipe PodcastAds' }],
    platforms: ['Spotify', 'YouTube'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ep-2',
    slug: 'mercado-tech-regional',
    title: 'Mercado Tech Regional e Oportunidades em ADS',
    category: 'Carreira',
    duration: '26 min',
    status: 'Em gravação',
    summary: 'Conversa com empreendedores e profissionais da região sobre empregabilidade, portfólio e primeiros passos na tecnologia.',
    guests: [{ name: 'Empreendedor local' }, { name: 'Professor convidado' }],
    platforms: ['Spotify', 'Instagram'],
    createdAt: new Date(Date.now() - 86400 * 1000).toISOString(),
  },
  {
    id: 'ep-3',
    slug: 'soft-skills-para-desenvolvedores',
    title: 'Soft Skills para Desenvolvedores',
    category: 'Formação',
    duration: '22 min',
    status: 'Em pauta',
    summary: 'Debate sobre comunicação, trabalho em equipe e postura profissional para estudantes e futuros desenvolvedores.',
    guests: [{ name: 'Docente ADS' }, { name: 'Aluno líder' }],
    platforms: ['Spotify', 'YouTube', 'Instagram'],
    createdAt: new Date(Date.now() - 86400 * 2000).toISOString(),
  },
];

/**
 * Initializes the database file if it doesn't exist, seeding with initial data.
 */
async function initDb(): Promise<void> {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    // If it exists but it's an old schema (e.g. transcriptions array from previous step)
    const parsed = JSON.parse(data);
    let updated = false;

    if (!parsed.episodes) {
      if (parsed.transcriptions) {
         const mergedEpisodes = [...initialEpisodes];
         for (const tr of parsed.transcriptions) {
            mergedEpisodes.push({
               id: tr.id,
               slug: tr.slug,
               title: tr.episodeTitle,
               category: tr.category,
               summary: tr.summary,
               status: tr.status,
               duration: tr.duration,
               guests: tr.guests || [],
               platforms: tr.platforms || [],
               createdAt: tr.createdAt,
               audioUrl: tr.audioUrl,
               transcriptionText: tr.transcriptionText,
               language: tr.language
            });
         }
         parsed.episodes = mergedEpisodes;
      } else {
         parsed.episodes = initialEpisodes;
      }
      updated = true;
    }

    if (!parsed.feedbacks) {
      parsed.feedbacks = initialFeedbacks;
      updated = true;
    }

    if (updated) {
      await fs.writeFile(DB_PATH, JSON.stringify(parsed, null, 2));
    }
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      await fs.writeFile(DB_PATH, JSON.stringify({ episodes: initialEpisodes, feedbacks: initialFeedbacks }, null, 2));
    }
  }
}

export async function readDb(): Promise<DbSchema> {
  await initDb();
  const data = await fs.readFile(DB_PATH, 'utf-8');
  return JSON.parse(data);
}

export async function writeDb(data: DbSchema): Promise<void> {
  await initDb();
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

// ------ EPISODE CRUD ------ //

export async function addEpisode(record: Episode) {
  const db = await readDb();
  db.episodes.unshift(record);
  await writeDb(db);
}

export async function updateEpisode(id: string, updates: Partial<Episode>) {
  const db = await readDb();
  const index = db.episodes.findIndex(t => t.id === id);
  if (index !== -1) {
    db.episodes[index] = { ...db.episodes[index], ...updates };
    await writeDb(db);
  }
}

export async function getEpisodeBySlug(slug: string): Promise<Episode | null> {
  const db = await readDb();
  return db.episodes.find(t => t.slug === slug) || null;
}

export async function getEpisodeById(id: string): Promise<Episode | null> {
  const db = await readDb();
  return db.episodes.find(t => t.id === id) || null;
}
