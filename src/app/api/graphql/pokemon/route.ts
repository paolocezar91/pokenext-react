import { getAllPokemon, getPokemonByIds } from '@/app/services/pokemon';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const ids = req.nextUrl.searchParams.get('ids') ?? '';
    const vars = {
      limit: Number(req.nextUrl.searchParams.get("limit")),
      offset: Number(req.nextUrl.searchParams.get("offset")),
      name: req.nextUrl.searchParams.get("name") ?? undefined,
      types: req.nextUrl.searchParams.get("types") ?? undefined
    };
    const response = ids ? await getPokemonByIds({ ids }) : await getAllPokemon(vars);
    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'GraphQL error', err }, { status: 500 });
  }

}

