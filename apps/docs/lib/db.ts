import { prisma } from './prisma';
import { Prisma } from '@prisma/client';

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

export enum UserRole {
  USUARIO = 'USUARIO',
  ALUNO = 'ALUNO',
  PROFESSOR = 'PROFESSOR',
  ADMIN = 'ADMIN',
}

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
  email?: string;
  ownerId?: string | null;
}

export interface WordItem {
  word: string;
  start: number;
  end: number;
  confidence: number;
  punctuated_word?: string;
  speaker?: string | number;
}

export interface SharingConfig {
  isEnabled: boolean;
  publicAccess: 'Restrito' | 'Visualizador' | 'Comentador' | 'Editor' | 'Admin';
  token: string;
}

export interface TranscriptionSegment {
  id: string;
  start: number;
  end: number;
  speaker: string;
  text: string;
  words?: WordItem[];
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

export interface Episode {
  id: string; // unique identifier
  slug: string;
  title: string;
  summary: string;
  category: EpisodeCategory;
  status: EpisodeStatus;
  duration: string;
  guests: Guest[];
  platforms: string[];
  createdAt: string;
  ownerId?: string | null;

  audioUrl?: string;
  externalUrl?: string;
  transcriptionText?: string;
  segments?: TranscriptionSegment[];
  language?: string;
  confidence?: number;
  image?: string;
  tracks?: TimelineTrack[];
  assets?: UploadedFile[];
  sharingConfig?: SharingConfig;
  ownerName?: string;
}

export interface StudioProject {
  id: string;
  name: string;
  tracks: TimelineTrack[];
  assets?: UploadedFile[];
  aspectRatio: string;
  lastModified: string;
  createdAt?: string;
  ownerId?: string | null;
}

export interface Feedback {
  id?: string;
  avatar: string;
  user: string;
  role: string;
  message: string;
  ownerId?: string | null;
}

export interface VisualAsset {
  id: string;
  episodeId?: string;
  title: string;
  type: 'Thumbnail' | 'Social Post' | 'Banner' | 'Story';
  url: string;
  createdAt: string;
  ownerId?: string | null;
}

export interface PlayEvent {
  id: string;
  episodeId: string;
  device: 'desktop' | 'mobile';
  createdAt: string;
}

export interface DbSchema {
  episodes: Episode[];
  feedbacks: Feedback[];
  projects: StudioProject[];
  guests: Guest[];
  assets: VisualAsset[];
  events: PlayEvent[];
}

// ------ HELPER PARSERS (Simplified for Native PostgreSQL JSON) ------ //
function mapEpisode(ep: any): Episode {
  return {
    ...ep,
    status: ep.status as EpisodeStatus,
    category: ep.category as EpisodeCategory,
    createdAt: ep.createdAt.toISOString(),
    // Prisma maps native PgSQL Json to JS objects/arrays automatically
    platforms: ((ep as any).platforms as string[]) || [],
    segments: ((ep as any).segments as TranscriptionSegment[]) || [],
    tracks: ((ep as any).tracks as TimelineTrack[]) || [],
    assets: ((ep as any).assets as UploadedFile[]) || [],
    sharingConfig: ((ep as any).sharingConfig as SharingConfig) || undefined,
    guests: ep.guests?.map((g: any) => g.guest) || [],
    ownerName: ep.owner?.name || undefined,
  };
}

// ------ READ FULL DB (Mocking legacy behavior) ------ //
export async function readDb(): Promise<DbSchema> {
  const episodesData = await prisma.episode.findMany({
    include: { 
      guests: { include: { guest: true } },
      owner: { select: { name: true } }
    },
    orderBy: { createdAt: 'desc' },
  });
  
  const feedbacks = await prisma.feedback.findMany();
  const projectsData = await prisma.studioProject.findMany({ orderBy: { lastModified: 'desc' } });
  const guests = await prisma.guest.findMany();
  const assetsData = await prisma.visualAsset.findMany({ orderBy: { createdAt: 'desc' } });
  const eventsData = await prisma.playEvent.findMany();

  return {
    episodes: episodesData.map(mapEpisode),
    feedbacks: feedbacks.map((f: any) => ({ ...f, ownerId: f.ownerId || undefined })),
    projects: projectsData.map((p: any) => ({
      ...p,
      lastModified: p.lastModified.toISOString(),
      createdAt: p.createdAt.toISOString(),
      tracks: ((p as any).tracks as TimelineTrack[]) || [],
      assets: ((p as any).assets as UploadedFile[]) || [],
    })),
    guests: guests.map((g: any) => ({
      ...g,
      email: g.email || undefined,
      avatar: g.avatar || undefined,
      bio: g.bio || undefined,
      social: g.social || undefined,
    })),
    assets: assetsData.map((a: any) => ({ ...a, createdAt: a.createdAt.toISOString() }) as VisualAsset),
    events: eventsData.map((e: any) => ({ ...e, device: e.device as 'desktop'|'mobile', createdAt: e.createdAt.toISOString() })),
  };
}

// ------ EPISODE CRUD ------ //

export async function addEpisode(record: Episode, userId: string) {
  const { guests, platforms, segments, tracks, assets, sharingConfig, createdAt, ownerId, ...rest } = record;
  const id = record.id || `ep_${Math.random().toString(36).substring(2, 11)}`;
  const now = new Date().toISOString();
  
  // 1. Inserir o Episódio
  await prisma.$executeRaw`
    INSERT INTO "Episode" (
      "id", "slug", "title", "summary", "category", "status", "duration", 
      "createdAt", "updatedAt", "audioUrl", "externalUrl", "transcriptionText",
      "language", "confidence", "image", "platforms", "segments", "tracks",
      "sharingConfig", "assets", "ownerId"
    ) VALUES (
      ${id}, 
      ${rest.slug}, 
      ${rest.title}, 
      ${rest.summary}, 
      ${rest.category}, 
      ${rest.status}, 
      ${rest.duration}, 
      ${createdAt ? new Date(createdAt).toISOString() : now}::timestamp,
      ${now}::timestamp,
      ${rest.audioUrl || null},
      ${rest.externalUrl || null},
      ${rest.transcriptionText || null},
      ${rest.language || null},
      ${rest.confidence || null},
      ${rest.image || null},
      ${platforms ? JSON.stringify(platforms) : null}::jsonb,
      ${segments ? JSON.stringify(segments) : null}::jsonb,
      ${tracks ? JSON.stringify(tracks) : null}::jsonb,
      ${sharingConfig ? JSON.stringify(sharingConfig) : null}::jsonb,
      ${assets ? JSON.stringify(assets) : null}::jsonb,
      ${userId}
    )
  `;

  // 2. Lidar com Convidados (Simplificado: Assume que o Guest já existe ou é criado separadamente)
  if (guests && guests.length > 0) {
    for (const g of guests) {
      try {
        // Tenta garantir que o Guest existe (Raw)
        await prisma.$executeRaw`
          INSERT INTO "Guest" ("id", "name", "ownerId", "createdAt")
          VALUES (${g.id}, ${g.name}, ${userId}, ${now}::timestamp)
          ON CONFLICT (id) DO NOTHING
        `;
        
        // Cria a relação na tabela de junção
        await prisma.$executeRaw`
          INSERT INTO "EpisodeGuest" ("episodeId", "guestId")
          VALUES (${id}, ${g.id})
          ON CONFLICT DO NOTHING
        `;
      } catch (e) {
        console.error('Erro ao vincular convidado via SQL:', e);
      }
    }
  }
}

export async function updateEpisode(id: string, updates: Partial<Episode>, userId: string) {
  const { guests, platforms, segments, tracks, assets, sharingConfig, createdAt, ownerId, ...rest } = updates;
  const now = new Date().toISOString();
  
  // Security check: Verify ownership
  const existingRecords = await prisma.$queryRaw<any[]>`SELECT "ownerId" FROM "Episode" WHERE id = ${id}`;
  if (existingRecords.length > 0) {
    const recordOwnerId = existingRecords[0].ownerId;
    if (recordOwnerId && recordOwnerId !== userId) {
      throw new Error("Não autorizado: Você não é o proprietário deste episódio.");
    }
  }

  // Update Individual Fields safely
  if (rest.title !== undefined) await prisma.$executeRaw`UPDATE "Episode" SET "title" = ${rest.title} WHERE id = ${id}`;
  if (rest.summary !== undefined) await prisma.$executeRaw`UPDATE "Episode" SET "summary" = ${rest.summary} WHERE id = ${id}`;
  if (rest.category !== undefined) await prisma.$executeRaw`UPDATE "Episode" SET "category" = ${rest.category} WHERE id = ${id}`;
  if (rest.status !== undefined) await prisma.$executeRaw`UPDATE "Episode" SET "status" = ${rest.status} WHERE id = ${id}`;
  if (rest.duration !== undefined) await prisma.$executeRaw`UPDATE "Episode" SET "duration" = ${rest.duration} WHERE id = ${id}`;
  if (rest.image !== undefined) await prisma.$executeRaw`UPDATE "Episode" SET "image" = ${rest.image} WHERE id = ${id}`;
  if (rest.audioUrl !== undefined) await prisma.$executeRaw`UPDATE "Episode" SET "audioUrl" = ${rest.audioUrl} WHERE id = ${id}`;
  if (rest.externalUrl !== undefined) await prisma.$executeRaw`UPDATE "Episode" SET "externalUrl" = ${rest.externalUrl} WHERE id = ${id}`;
  if (rest.transcriptionText !== undefined) await prisma.$executeRaw`UPDATE "Episode" SET "transcriptionText" = ${rest.transcriptionText} WHERE id = ${id}`;
  
  // Update JSON Fields
  if (platforms !== undefined) await prisma.$executeRaw`UPDATE "Episode" SET "platforms" = ${JSON.stringify(platforms)}::jsonb WHERE id = ${id}`;
  if (segments !== undefined) await prisma.$executeRaw`UPDATE "Episode" SET "segments" = ${JSON.stringify(segments)}::jsonb WHERE id = ${id}`;
  if (tracks !== undefined) await prisma.$executeRaw`UPDATE "Episode" SET "tracks" = ${JSON.stringify(tracks)}::jsonb WHERE id = ${id}`;
  if (sharingConfig !== undefined) await prisma.$executeRaw`UPDATE "Episode" SET "sharingConfig" = ${JSON.stringify(sharingConfig)}::jsonb WHERE id = ${id}`;
  if (assets !== undefined) await prisma.$executeRaw`UPDATE "Episode" SET "assets" = ${JSON.stringify(assets)}::jsonb WHERE id = ${id}`;

  // Update Timestamp
  await prisma.$executeRaw`UPDATE "Episode" SET "updatedAt" = ${now}::timestamp WHERE id = ${id}`;

  // Update Guests if provided
  if (guests !== undefined) {
    await prisma.$executeRaw`DELETE FROM "EpisodeGuest" WHERE "episodeId" = ${id}`;
    if (guests && guests.length > 0) {
      for (const g of guests) {
        await prisma.$executeRaw`
          INSERT INTO "Guest" ("id", "name", "ownerId", "createdAt")
          VALUES (${g.id}, ${g.name}, ${userId}, ${now}::timestamp)
          ON CONFLICT (id) DO NOTHING
        `;
        await prisma.$executeRaw`
          INSERT INTO "EpisodeGuest" ("episodeId", "guestId")
          VALUES (${id}, ${g.id})
          ON CONFLICT DO NOTHING
        `;
      }
    }
  }
}

export async function getEpisodeBySlug(slug: string): Promise<Episode | null> {
  const ep = await prisma.episode.findUnique({
    where: { slug },
    include: { 
      guests: { include: { guest: true } },
      owner: { select: { name: true } }
    }
  });
  return ep ? mapEpisode(ep) : null;
}

export async function getEpisodeById(id: string): Promise<Episode | null> {
  const ep = await prisma.episode.findUnique({
    where: { id },
    include: { 
      guests: { include: { guest: true } },
      owner: { select: { name: true } }
    }
  });
  return ep ? mapEpisode(ep) : null;
}

export async function deleteEpisode(id: string, userId: string) {
  // Security check: Verify ownership
  const existing = await prisma.$queryRaw<any[]>`SELECT "ownerId" FROM "Episode" WHERE id = ${id}`;
  if (existing.length > 0 && existing[0].ownerId && existing[0].ownerId !== userId) {
    throw new Error("Não autorizado: Você não é o proprietário deste episódio.");
  }

  // Delete relations first (though Cascade should handle most, raw SQL is safer here)
  await prisma.$executeRaw`DELETE FROM "EpisodeGuest" WHERE "episodeId" = ${id}`;
  await prisma.$executeRaw`DELETE FROM "PlayEvent" WHERE "episodeId" = ${id}`;
  await prisma.$executeRaw`DELETE FROM "VisualAsset" WHERE "episodeId" = ${id}`;
  
  // Delete the episode
  await prisma.$executeRaw`DELETE FROM "Episode" WHERE id = ${id}`;
}

// ------ STUDIO PROJECT CRUD ------ //

export async function getProjects(userId: string, role: string): Promise<StudioProject[]> {
  const isElevated = role === 'ADMIN' || role === 'PROFESSOR';
  
  const projects = await prisma.studioProject.findMany({
    where: isElevated ? {} : { ownerId: userId },
    orderBy: { lastModified: 'desc' }
  });
  
  return projects.map((p: any) => ({
    ...p,
    lastModified: p.lastModified.toISOString(),
    createdAt: p.createdAt.toISOString(),
    tracks: ((p as any).tracks as TimelineTrack[]) || [],
    assets: ((p as any).assets as UploadedFile[]) || [],
  }));
}

export async function getProjectById(id: string): Promise<StudioProject | null> {
  const p = await prisma.studioProject.findUnique({ where: { id } });
  if (!p) return null;
  return {
    ...p,
    lastModified: p.lastModified.toISOString(),
    createdAt: p.createdAt.toISOString(),
    tracks: ((p as any).tracks as TimelineTrack[]) || [],
    assets: ((p as any).assets as UploadedFile[]) || [],
  } as StudioProject;
}

export async function addProject(project: StudioProject, userId: string) {
  const { tracks, assets, lastModified, createdAt, ownerId, ...rest } = project;
  await prisma.studioProject.create({
    data: {
      ...rest,
      lastModified: new Date(lastModified),
      createdAt: createdAt ? new Date(createdAt) : undefined,
      tracks: (tracks as any) || [],
      assets: (assets as any) || [],
      ownerId: userId
    }
  });
}

export async function updateProject(id: string, updates: Partial<StudioProject>, userId: string) {
  const { tracks, assets, lastModified, createdAt, ownerId, ...rest } = updates;
  
  const existing = await prisma.studioProject.findUnique({ where: { id } });
  if (existing && existing.ownerId !== userId) {
    throw new Error("Não autorizado: Este projeto pertence a outro aluno.");
  }

  const data: any = { ...rest };
  if (tracks !== undefined) data.tracks = tracks as any;
  if (assets !== undefined) data.assets = assets as any;
  if (lastModified !== undefined) data.lastModified = new Date(lastModified);
  
  await prisma.studioProject.update({
    where: { id },
    data
  });
}

export async function addAsset(projectId: string, asset: UploadedFile) {
  const project = await prisma.studioProject.findUnique({ where: { id: projectId } });
  if (!project) throw new Error("Projeto não encontrado");

  const currentAssets = ((project as any).assets as any[]) || [];
  await prisma.studioProject.update({
    where: { id: projectId },
    data: {
      assets: [...currentAssets, asset] as any
    }
  });
}

export async function deleteAsset(projectId: string, assetId: string): Promise<UploadedFile | null> {
  const project = await prisma.studioProject.findUnique({ where: { id: projectId } });
  if (!project) throw new Error("Projeto não encontrado");

  const currentAssets = ((project as any).assets as any[]) || [];
  const assetToDelete = currentAssets.find(a => a.id === assetId);
  if (!assetToDelete) return null;

  const newAssets = currentAssets.filter(a => a.id !== assetId);
  await prisma.studioProject.update({
    where: { id: projectId },
    data: { assets: newAssets as any }
  });

  return assetToDelete as UploadedFile;
}

export async function deleteProject(id: string, userId: string, role: string) {
  const existing = await prisma.studioProject.findUnique({ where: { id } });
  if (!existing) throw new Error("Projeto não encontrado.");
  
  const isElevated = role === 'ADMIN'; // Only admin can delete others' projects
  
  if (existing.ownerId !== userId && !isElevated) {
    throw new Error("Não autorizado: Você não pode excluir projetos de outros alunos.");
  }
  
  await prisma.studioProject.delete({ where: { id } });
}

// ------ GUEST CRUD ------ //

export async function getGuests(): Promise<Guest[]> {
  const list = await prisma.guest.findMany();
  return list.map((g: any) => ({
    ...g,
    email: g.email || undefined,
    avatar: g.avatar || undefined,
    bio: g.bio || undefined,
    social: g.social || undefined,
  }));
}

export async function addGuest(record: Guest, userId: string) {
  await prisma.guest.create({ data: { ...record, ownerId: userId } });
}

export async function updateGuest(id: string, updates: Partial<Guest>, userId: string) {
  const existing = await prisma.guest.findUnique({ where: { id } });
  if (existing && existing.ownerId && existing.ownerId !== userId) {
    throw new Error("Não autorizado.");
  }
  await prisma.guest.update({ where: { id }, data: updates });
}

export async function deleteGuest(id: string, userId: string) {
  const existing = await prisma.guest.findUnique({ where: { id } });
  if (existing && existing.ownerId && existing.ownerId !== userId) {
    throw new Error("Não autorizado.");
  }
  await prisma.guest.delete({ where: { id } });
}

// ------ ASSET CRUD ------ //

export async function getVisualAssets(): Promise<VisualAsset[]> {
  const assets = await prisma.visualAsset.findMany({ orderBy: { createdAt: 'desc' } });
  return assets.map((a: any) => ({ ...a, createdAt: a.createdAt.toISOString() }) as VisualAsset);
}

export async function addVisualAsset(record: VisualAsset, userId: string) {
  const { episodeId, createdAt, ownerId, ...rest } = record;
  await prisma.visualAsset.create({
    data: {
      ...rest,
      episodeId: episodeId || null,
      createdAt: createdAt ? new Date(createdAt) : undefined,
      ownerId: userId
    }
  });
}

export async function deleteVisualAsset(id: string, userId: string, role: string) {
  const existing = await prisma.visualAsset.findUnique({ where: { id } });
  if (!existing) throw new Error("Asset não encontrado.");

  const isElevated = role === 'ADMIN';
  if (existing.ownerId !== userId && !isElevated) {
    throw new Error("Não autorizado.");
  }
  await prisma.visualAsset.delete({ where: { id } });
}

export async function recordPlayEvent(event: Omit<PlayEvent, 'id' | 'createdAt'>) {
  const id = `evt_${Math.random().toString(36).substring(2, 11)}`;
  const now = new Date().toISOString();
  
  await prisma.$executeRaw`
    INSERT INTO "PlayEvent" ("id", "episodeId", "device", "createdAt")
    VALUES (${id}, ${event.episodeId}, ${event.device}, ${now}::timestamp)
  `;
}

export async function getPlayEvents(): Promise<PlayEvent[]> {
  const events = await prisma.playEvent.findMany({ orderBy: { createdAt: 'desc' } });
  return events.map((e: any) => ({
    ...e,
    device: e.device as 'desktop' | 'mobile',
    createdAt: e.createdAt.toISOString()
  }));
}
