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
  };
}

// ------ READ FULL DB (Mocking legacy behavior) ------ //
export async function readDb(): Promise<DbSchema> {
  const episodesData = await prisma.episode.findMany({
    include: { guests: { include: { guest: true } } },
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
  
  await prisma.episode.create({
    data: {
      ...rest,
      status: rest.status,
      category: rest.category,
      createdAt: createdAt ? new Date(createdAt) : undefined,
      // Pass arrays directly to Postgres JSON columns
      platforms: platforms || [],
      segments: (segments as any) || [],
      tracks: (tracks as any) || [],
      assets: (assets as any) || [],
      sharingConfig: (sharingConfig as any) || {},
      ownerId: userId,
      guests: {
        create: guests?.map(g => ({
          guest: {
            connectOrCreate: {
              where: { id: g.id },
              create: { ...g, ownerId: userId }
            }
          }
        })) || []
      }
    }
  });
}

export async function updateEpisode(id: string, updates: Partial<Episode>, userId: string) {
  const { guests, platforms, segments, tracks, assets, sharingConfig, createdAt, ownerId, ...rest } = updates;
  
  // Security check: Verify ownership if not an admin (Admin check can be added here)
  const existing = await prisma.episode.findUnique({ where: { id } });
  if (existing && existing.ownerId && existing.ownerId !== userId) {
    throw new Error("Não autorizado: Você não é o proprietário deste episódio.");
  }

  await prisma.episode.update({
    where: { id },
    data: {
      ...rest,
      platforms,
      segments: segments as any,
      tracks: tracks as any,
      assets: assets as any,
      sharingConfig: sharingConfig as any,
    },
  });
}

export async function getEpisodeBySlug(slug: string): Promise<Episode | null> {
  const ep = await prisma.episode.findUnique({
    where: { slug },
    include: { guests: { include: { guest: true } } }
  });
  return ep ? mapEpisode(ep) : null;
}

export async function getEpisodeById(id: string): Promise<Episode | null> {
  const ep = await prisma.episode.findUnique({
    where: { id },
    include: { guests: { include: { guest: true } } }
  });
  return ep ? mapEpisode(ep) : null;
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
  await prisma.playEvent.create({
    data: {
      episodeId: event.episodeId,
      device: event.device,
    }
  });
}

export async function getPlayEvents(): Promise<PlayEvent[]> {
  const events = await prisma.playEvent.findMany({ orderBy: { createdAt: 'desc' } });
  return events.map((e: any) => ({
    ...e,
    device: e.device as 'desktop' | 'mobile',
    createdAt: e.createdAt.toISOString()
  }));
}
