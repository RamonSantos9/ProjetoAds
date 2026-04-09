// scripts/migrate-db.ts

import fs from 'node:fs/promises';
import path from 'node:path';
import { prisma } from '../lib/prisma';

async function migrate() {
  const dbPath = path.resolve(process.cwd(), 'lib/db.json');
  const data = JSON.parse(await fs.readFile(dbPath, 'utf-8'));

  console.log('--- Migrando PodcastsAds para Prisma ---');

  // 1. Migrar Feedbacks
  if (data.feedbacks) {
    console.log(`Migrando ${data.feedbacks.length} feedbacks...`);
    for (const f of data.feedbacks) {
      try {
        await prisma.feedback.create({ data: f });
      } catch(e: any) { if (e.code !== 'P2002') throw e; }
    }
  }

  // 2. Migrar Guests
  const guestMap = new Map<string, string>();
  if (data.guests) {
    console.log(`Migrando ${data.guests.length} convidados...`);
    for (const g of data.guests) {
      try {
        const created = await prisma.guest.create({ data: g });
        guestMap.set(g.id, created.id);
      } catch(e: any) { 
        if (e.code !== 'P2002') throw e; 
        guestMap.set(g.id, g.id); // Trata fallback de ID
      }
    }
  }

  // 3. Migrar Episódios
  if (data.episodes) {
    console.log(`Migrando ${data.episodes.length} episódios...`);
    for (const ep of data.episodes) {
      const { guests: epGuests, ...rest } = ep;
      
      let episode: any;
      try {
        episode = await prisma.episode.create({
          data: {
            ...rest,
            platforms: rest.platforms ? JSON.stringify(rest.platforms) : '[]',
            segments: rest.segments ? JSON.stringify(rest.segments) : '[]',
            tracks: rest.tracks ? JSON.stringify(rest.tracks) : '[]',
            assets: rest.assets ? JSON.stringify(rest.assets) : '[]',
            sharingConfig: rest.sharingConfig ? JSON.stringify(rest.sharingConfig) : '{}',
          },
        });
      } catch(e: any) {
        if (e.code !== 'P2002') throw e;
        episode = { id: rest.id }; // Assume falha foi por causa do ID (já existe)
      }

      // Lidar com Relações de Convidados
      if (epGuests && Array.isArray(epGuests)) {
        for (const g of epGuests) {
          // Se for objeto, criamos ou encontramos o guest
          if (typeof g === 'object') {
            await prisma.episodeGuest.create({
              data: {
                episodeId: episode.id,
                guestId: guestMap.get(g.id) || g.id, // Fallback p/ o ID original se não estiver no mapa
              },
            }).catch(() => {}); // Ignorar se já existir (pode acontecer se o ID for o mesmo)
          }
        }
      }
    }
  }

  // 4. Migrar Projetos do Studio
  if (data.projects) {
    console.log(`Migrando ${data.projects.length} projetos do estúdio...`);
    for (const p of data.projects) {
      try {
        await prisma.studioProject.create({
          data: {
            id: p.id,
            name: p.name,
            aspectRatio: p.aspectRatio,
            lastModified: new Date(p.lastModified),
            createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
            tracks: p.tracks ? JSON.stringify(p.tracks) : '[]',
            assets: p.assets ? JSON.stringify(p.assets) : '[]',
          },
        });
      } catch(e: any) { if (e.code !== 'P2002') throw e; }
    }
  }

  // 5. Migrar Visual Assets
  if (data.assets) {
    console.log(`Migrando ${data.assets.length} visual assets...`);
    for (const a of data.assets) {
      try {
        await prisma.visualAsset.create({ data: a });
      } catch(e: any) { if (e.code !== 'P2002') throw e; }
    }
  }

  console.log('✅ Migração concluída com sucesso!');
}

migrate()
  .catch((e) => {
    console.error('❌ Erro na migração:');
    console.error(JSON.stringify(e, Object.getOwnPropertyNames(e), 2));
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
