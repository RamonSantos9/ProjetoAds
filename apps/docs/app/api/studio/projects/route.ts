import { NextResponse } from 'next/server';
import { readDb, addProject, StudioProject } from '@/lib/db';

export async function GET() {
  try {
    const db = await readDb();
    return NextResponse.json(db.projects || []);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to read projects' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body: StudioProject = await request.json();
    if (!body.id) {
      body.id = `proj-${Date.now()}`;
    }
    await addProject(body);
    return NextResponse.json({ success: true, project: body });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 },
    );
  }
}
