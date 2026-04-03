import fs from 'node:fs/promises';
import path from 'node:path';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'audio');

/**
 * Initializes the uploads directory if it doesn't exist.
 */
async function initStorage() {
  try {
    await fs.access(UPLOADS_DIR);
  } catch {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
  }
}

/**
 * Saves a file to the uploads directory.
 * @returns The public URL of the saved file.
 */
export async function saveAudioFile(file: File, slug: string): Promise<string> {
  await initStorage();
  
  const ext = path.extname(file.name) || '.mp3';
  const filename = `${slug}-${Date.now()}${ext}`;
  const filePath = path.join(UPLOADS_DIR, filename);
  
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);
  
  return `/uploads/audio/${filename}`;
}
