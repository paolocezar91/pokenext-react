import { idOrName } from '@/app/api-utils';
import { getMoveById } from '@/app/services/move';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vars = idOrName(id);
  try {
    const { moveById } = await getMoveById(vars);
    return NextResponse.json(moveById, { status: 200 });
  } catch(err) {
    return NextResponse.json({ error: 'GraphQL error', err }, { status: 500 });
  }
}
