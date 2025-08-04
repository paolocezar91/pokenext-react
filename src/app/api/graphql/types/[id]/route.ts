import { idOrName } from '@/app/api-utils';
import { gql, request } from 'graphql-request';
import { NextRequest, NextResponse } from 'next/server';

const apiUrl = process.env.GRAPHQL_URL as string;

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vars = idOrName(id);
  const query = gql`
      query ($id: Int, $name: String) {
        pokemonType(id: $id, name: $name) {
          id
          name
          pokemon {
            pokemon { name url }
          }
          moves { name url }
        }
      }
    `;

  try {
    const data = await request<{ pokemonType: Record<string, unknown> }>(apiUrl, query, vars);
    return NextResponse.json(data.pokemonType, { status: 200 });
  } catch(err) {
    return NextResponse.json({ error: 'GraphQL error', err }, { status: 500 });
  }
}
