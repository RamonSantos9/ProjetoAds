import fs from 'node:fs/promises';
import path from 'node:path';

const BASE_STORAGE_DIR = path.join(
  process.cwd(),
  'public',
  'uploads',
  'studio',
);

/**
 * Initializes the storage directory for a specific type.
 */
async function initStorage(subDir: string) {
  const dir = path.join(BASE_STORAGE_DIR, subDir);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

/**
 * Saves an asset (audio, video, or image) to the studio uploads directory.
 */
export async function saveProjectAsset(
  file: File,
  projectId: string,
): Promise<string> {
  const type = file.type.split('/')[0]; // audio, video, image
  const subDir = ['audio', 'video', 'image'].includes(type) ? type : 'other';

  await initStorage(subDir);

  const ext = path.extname(file.name) || `.${file.type.split('/')[1]}`;
  const cleanName = file.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
  const filename = `${projectId}-${Date.now()}-${cleanName}`;
  const filePath = path.join(BASE_STORAGE_DIR, subDir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);

  return `/uploads/studio/${subDir}/${filename}`;
}

export async function saveAudioFile(file: File, slug: string): Promise<string> {
  const dir = path.join(process.cwd(), 'public', 'uploads', 'audio');
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }

  const ext = path.extname(file.name) || '.mp3';
  const filename = `${slug}-${Date.now()}${ext}`;
  const filePath = path.join(dir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);

  return `/uploads/audio/${filename}`;
}

export async function deleteProjectAsset(fileUrl: string): Promise<void> {
  if (!fileUrl) return;
  // Convert relative URL /uploads/studio/... to absolute path
  const absolutePath = path.join(process.cwd(), 'public', fileUrl);
  try {
    await fs.access(absolutePath);
    await fs.unlink(absolutePath);
  } catch (err) {
    console.error('Failed to delete physical file:', absolutePath, err);
  }
}
