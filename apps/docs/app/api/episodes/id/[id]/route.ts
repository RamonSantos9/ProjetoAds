import { NextResponse } from 'next/server';
import { getEpisodeById } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const ep = await getEpisodeById(id);

    if (!ep) {
      return NextResponse.json({ error: 'Episode not found' }, { status: 404 });
    }
    return NextResponse.json(ep);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read db' }, { status: 500 });
  }
}
