import { NextResponse } from 'next/server';
import { getGuests, addGuest, updateGuest, deleteGuest, Guest } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const guests = await getGuests();
    return NextResponse.json(guests);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to read guests' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    const body: Guest = await request.json();
    await addGuest(body, session.user.id);
    return NextResponse.json({ success: true, guest: body });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save guest' },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    const body: { id: string; updates: Partial<Guest> } = await request.json();
    await updateGuest(body.id, body.updates, session.user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update guest' },
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
    const id = searchParams.get('id');
    if (!id)
      return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await deleteGuest(id, session.user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete guest' },
      { status: 500 },
    );
  }
}
