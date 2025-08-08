import { idOrName } from '@/app/api-utils';
import { getPokemonById } from '@/app/services/pokemon';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vars = idOrName(id);

  try {
    const { pokemonById } = await getPokemonById(vars);
    return NextResponse.json(pokemonById, { status: 200 });
  } catch(err) {
    return NextResponse.json({ error: 'GraphQL error', err }, { status: 500 });
  }
}
