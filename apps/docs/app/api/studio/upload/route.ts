import { NextResponse } from 'next/server';
import { saveProjectAsset, deleteProjectAsset } from '@/lib/storage';
import { addAsset, deleteAsset, UploadedFile } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const projectId = formData.get('projectId') as string;

    if (!file || !projectId) {
      return NextResponse.json(
        { error: 'Missing file or projectId' },
        { status: 400 },
      );
    }

    // Save to disk
    const url = await saveProjectAsset(file, projectId);

    // Create asset object
    const asset: UploadedFile = {
      id: `asset-${Date.now()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      url: url,
    };

    // Save to DB
    await addAsset(projectId, asset);

    return NextResponse.json(asset);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload asset' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const assetId = searchParams.get('assetId');

    if (!projectId || !assetId) {
      return NextResponse.json(
        { error: 'Missing projectId or assetId' },
        { status: 400 },
      );
    }

    // Delete from DB first
    const deletedAsset = await deleteAsset(projectId, assetId);

    if (!deletedAsset) {
      return NextResponse.json(
        { error: 'Asset not found in DB' },
        { status: 404 },
      );
    }

    // Delete physically from disk if URL exists
    if (deletedAsset.url) {
      await deleteProjectAsset(deletedAsset.url);
    }

    return NextResponse.json({
      success: true,
      message: 'Asset deleted successfully',
    });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete asset' },
      { status: 500 },
    );
  }
}
