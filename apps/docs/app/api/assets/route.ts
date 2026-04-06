import { NextResponse } from 'next/server';
import { getVisualAssets, addVisualAsset, deleteVisualAsset, VisualAsset } from '@/lib/db';

export async function GET() {
  try {
    const assets = await getVisualAssets();
    return NextResponse.json(assets);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read assets' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: VisualAsset = await request.json();
    await addVisualAsset(body);
    return NextResponse.json({ success: true, asset: body });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save asset' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    
    await deleteVisualAsset(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete asset' }, { status: 500 });
  }
}
