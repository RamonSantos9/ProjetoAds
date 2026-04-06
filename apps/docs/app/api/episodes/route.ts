import { NextResponse } from 'next/server';
import { readDb, addEpisode, Episode } from '@/lib/db';

export async function GET() {
  try {
    const db = await readDb();
    return NextResponse.json(db.episodes);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read db' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: Episode = await request.json();
    await addEpisode(body);
    return NextResponse.json({ success: true, episode: body });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save episode' },
      { status: 500 },
    );
  }
}
