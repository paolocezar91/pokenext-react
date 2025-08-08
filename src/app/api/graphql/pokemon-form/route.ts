import { formatResultsCount } from '@/app/api-utils';
import { gql, request } from 'graphql-request';
import { NextRequest, NextResponse } from 'next/server';
import { IPokemonForm } from 'pokeapi-typescript';
const apiUrl = process.env.GRAPHQL_URL as string;

export async function GET(req: NextRequest) {
  const ids = req.nextUrl.searchParams.get("ids");
  return await getByIds(ids!);
}

async function getByIds(ids: string) {
  const vars = { ids: ids.split(',') };
  const query = gql`
    query ($ids: [ID]) {
      pokemonFormByIds(ids: $ids) {
        id
        name
        is_mega
        is_default
      }
    }
  `;

  try {
    const { pokemonFormByIds } = await request<{ pokemonFormByIds: IPokemonForm[] }>(apiUrl, query, vars);
    return NextResponse.json(formatResultsCount(pokemonFormByIds), { status: 200 });
  } catch(err) {
    return NextResponse.json({ error: 'GraphQL error', err }, { status: 500 });
  }
}
