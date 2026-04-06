import fs from 'node:fs/promises';
import path from 'node:path';

const getDbPath = () => {
  const cwd = process.cwd();
  // Detect if we're in the monorepo root or already in the app docs folder
  if (
    cwd.endsWith('apps/docs') ||
    cwd.includes('apps\\docs') ||
    cwd.includes('apps/docs')
  ) {
    return path.resolve(cwd, 'lib', 'db.json');
  }
  // Assume monorepo root
  return path.resolve(cwd, 'apps/docs/lib/db.json');
};
const DB_PATH = getDbPath();

export type EpisodeStatus =
  | 'Publicado'
  | 'Em gravação'
  | 'Em pauta'
  | 'Processando'
  | 'Concluído'
  | 'Erro'
  | 'Produção'
  | 'Rascunho'
  | 'Agendado';
export type EpisodeCategory =
  | 'Institucional'
  | 'Carreira'
  | 'Formação'
  | 'Entrevista'
  | 'Geral';

export interface Guest {
  id: string;
  name: string;
  bio?: string;
  social?: string;
  avatar?: string;
  email?: string; // Adicionado para CRM
}

export interface Episode {
  id: string; // unique identifier
  slug: string;
  title: string; // Maps from "episodeTitle" and "title"
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
  image?: string; // URL for persisted image
  imageFile?: any; // Local File object for optimistic UI
}

export interface TimelineTrack {
  id: string;
  name: string;
  duration: number; // in seconds
  startTime: number; // offset in seconds
  color: string;
  type?: string;
  url?: string;
  layerIndex?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rotation?: number;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
}

export interface StudioProject {
  id: string;
  name: string;
  tracks: TimelineTrack[];
  assets?: UploadedFile[];
  aspectRatio: string;
  lastModified: string;
  createdAt?: string;
}

export interface Feedback {
  avatar: string;
  user: string;
  role: string;
  message: string;
}

export interface VisualAsset {
  id: string;
  episodeId?: string;
  title: string;
  type: 'Thumbnail' | 'Social Post' | 'Banner' | 'Story';
  url: string;
  createdAt: string;
}

export interface DbSchema {
  episodes: Episode[];
  feedbacks: Feedback[];
  projects: StudioProject[];
  guests: Guest[];
  assets: VisualAsset[];
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
    message:
      'Uma iniciativa incrível da Serra Dourada. Talentos são formados quando há essa troca de experiências que o podcast proporciona.',
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
    summary:
      'Apresentação oficial do projeto, da proposta de extensão e da conexão entre o curso de ADS, a faculdade e a comunidade.',
    guests: [{ id: 'guest-equipe', name: 'Equipe PodcastAds' }],
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
    summary:
      'Conversa com empreendedores e profissionais da região sobre empregabilidade, portfólio e primeiros passos na tecnologia.',
    guests: [
      { id: 'guest-empreendedor', name: 'Empreendedor local' },
      { id: 'guest-professor', name: 'Professor convidado' },
    ],
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
    summary:
      'Debate sobre comunicação, trabalho em equipe e postura profissional para estudantes e futuros desenvolvedores.',
    guests: [
      { id: 'guest-docente', name: 'Docente ADS' },
      { id: 'guest-aluno-lider', name: 'Aluno líder' },
    ],
    platforms: ['Spotify', 'YouTube', 'Instagram'],
    createdAt: new Date(Date.now() - 86400 * 2000).toISOString(),
  },
];

const initialAssets: VisualAsset[] = [
  {
    id: 'asset-1',
    episodeId: 'ep-1',
    title: 'Thumbnail Oficial - Ep 01',
    type: 'Thumbnail',
    url: 'https://picsum.photos/seed/ep1/800/450',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'asset-2',
    episodeId: 'ep-1',
    title: 'Post Instagram - Ep 01',
    type: 'Social Post',
    url: 'https://picsum.photos/seed/ep1-insta/1080/1080',
    createdAt: new Date().toISOString(),
  },
];

const initialGuests: Guest[] = [
  {
    id: 'guest-anderson',
    name: 'Prof. Anderson',
    bio: 'Coordenador do curso de ADS com vasta experiência em gestão acadêmica e tecnologia.',
    social: 'https://linkedin.com/in/anderson',
    avatar: 'https://avatars.githubusercontent.com/u/1',
  },
  {
    id: 'guest-julia',
    name: 'Júlia Santos',
    bio: 'Aluna destaque do 4º período, entusiasta de desenvolvimento web e UX Design.',
    social: 'https://instagram.com/juliasantos',
    avatar: 'https://avatars.githubusercontent.com/u/35677084',
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
            language: tr.language,
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

    if (!parsed.projects) {
      parsed.projects = [];
      updated = true;
    }

    if (!parsed.guests) {
      parsed.guests = initialGuests;
      updated = true;
    }

    if (!parsed.assets) {
      parsed.assets = initialAssets;
      updated = true;
    }

    if (updated) {
      await fs.writeFile(DB_PATH, JSON.stringify(parsed, null, 2));
    }
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      await fs.writeFile(
        DB_PATH,
        JSON.stringify(
          {
            episodes: initialEpisodes,
            feedbacks: initialFeedbacks,
            projects: [],
            guests: initialGuests,
            assets: initialAssets,
          },
          null,
          2,
        ),
      );
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
  const index = db.episodes.findIndex((t) => t.id === id);
  if (index !== -1) {
    db.episodes[index] = { ...db.episodes[index], ...updates };
    await writeDb(db);
  }
}

export async function getEpisodeBySlug(slug: string): Promise<Episode | null> {
  const db = await readDb();
  return db.episodes.find((t) => t.slug === slug) || null;
}

export async function getEpisodeById(id: string): Promise<Episode | null> {
  const db = await readDb();
  return db.episodes.find((t) => t.id === id) || null;
}

// ------ STUDIO PROJECT CRUD ------ //

export async function getProjects(): Promise<StudioProject[]> {
  const db = await readDb();
  return db.projects || [];
}

export async function addProject(project: StudioProject) {
  const db = await readDb();
  db.projects.unshift(project);
  await writeDb(db);
}

export async function updateProject(
  id: string,
  updates: Partial<StudioProject>,
) {
  const db = await readDb();
  const index = db.projects.findIndex((p) => p.id === id);
  if (index !== -1) {
    db.projects[index] = { ...db.projects[index], ...updates };
    await writeDb(db);
  }
}

export async function getProjectById(
  id: string,
): Promise<StudioProject | null> {
  const db = await readDb();
  return db.projects.find((p) => p.id === id) || null;
}

export async function deleteProject(id: string) {
  const db = await readDb();
  db.projects = db.projects.filter((p) => p.id !== id);
  await writeDb(db);
}

export async function addAsset(projectId: string, asset: UploadedFile) {
  const db = await readDb();
  const index = db.projects.findIndex((p) => p.id === projectId);
  if (index !== -1) {
    if (!db.projects[index].assets) db.projects[index].assets = [];
    db.projects[index].assets!.push(asset);
    await writeDb(db);
  }
}

export async function deleteAsset(
  projectId: string,
  assetId: string,
): Promise<UploadedFile | null> {
  const db = await readDb();
  const index = db.projects.findIndex((p) => p.id === projectId);
  if (index !== -1) {
    const project = db.projects[index];
    if (!project.assets) return null;
    const assetIndex = project.assets.findIndex((a) => a.id === assetId);
    if (assetIndex !== -1) {
      const [deletedAsset] = project.assets.splice(assetIndex, 1);
      await writeDb(db);
      return deletedAsset;
    }
  }
  return null;
}

// ------ GUEST CRUD ------ //

export async function getGuests(): Promise<Guest[]> {
  const db = await readDb();
  return db.guests || [];
}

export async function addGuest(record: Guest) {
  const db = await readDb();
  if (!db.guests) db.guests = [];
  db.guests.unshift(record);
  await writeDb(db);
}

export async function updateGuest(id: string, updates: Partial<Guest>) {
  const db = await readDb();
  const index = db.guests.findIndex((g) => g.id === id);
  if (index !== -1) {
    db.guests[index] = { ...db.guests[index], ...updates };
    await writeDb(db);
  }
}

export async function deleteGuest(id: string) {
  const db = await readDb();
  db.guests = db.guests.filter((g) => g.id !== id);
  await writeDb(db);
}

// ------ ASSET CRUD ------ //

export async function getVisualAssets(): Promise<VisualAsset[]> {
  const db = await readDb();
  return db.assets || [];
}

export async function addVisualAsset(record: VisualAsset) {
  const db = await readDb();
  if (!db.assets) db.assets = [];
  db.assets.unshift(record);
  await writeDb(db);
}

export async function deleteVisualAsset(id: string) {
  const db = await readDb();
  db.assets = db.assets.filter((a) => a.id !== id);
  await writeDb(db);
}
