import { ResultsCount } from '@/app/api/api-utils';
import { getAllPokemon, getPokemonByIds } from '@/app/services/pokemon';
import { NextRequest, NextResponse } from 'next/server';
import { IPokemon } from 'pokeapi-typescript';

export async function GET(req: NextRequest) {
  try {
    let response: ResultsCount<IPokemon>;
    const ids = req.nextUrl.searchParams.get('ids') ?? '';
    if(ids) {
      response = await getPokemonByIds({ ids });
    } else {
      const vars = {
        limit: Number(req.nextUrl.searchParams.get("limit")),
        offset: Number(req.nextUrl.searchParams.get("offset")),
        name: req.nextUrl.searchParams.get("name") ?? undefined,
        types: req.nextUrl.searchParams.get("types") ?? undefined
      };
      response = await getAllPokemon(vars);
    }
    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'GraphQL error', err }, { status: 500 });
  }

}

