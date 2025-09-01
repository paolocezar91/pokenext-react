import { idOrName } from '@/app/api-utils';
import { getTypeById } from '@/app/services/type';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vars = idOrName(id);
  try {
    const { pokemonType } = await getTypeById(vars);
    return NextResponse.json(pokemonType, { status: 200 });
  } catch(err) {
    return NextResponse.json({ error: 'GraphQL error', err }, { status: 500 });
  }
}
