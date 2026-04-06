import { NextResponse } from 'next/server';
import { getEpisodeBySlug } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const ep = await getEpisodeBySlug(slug);

    if (!ep) {
      return NextResponse.json({ error: 'Episode not found' }, { status: 404 });
    }
    return NextResponse.json(ep);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read db' }, { status: 500 });
  }
}
