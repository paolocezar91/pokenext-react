import { gql, request } from 'graphql-request';
import { NextResponse } from 'next/server';

const apiUrl = process.env.GRAPHQL_URL as string;

export async function GET(_, { params }: { params: { id: string }}) {
  const idOrName = (await params).id;
  const isId = !isNaN(Number(idOrName));
  const name = isId ? '' : idOrName;
  const id = isId ? Number(idOrName) : undefined;
  const vars = { name, id };
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
  } catch {
    return NextResponse.json({ error: 'GraphQL error' }, { status: 500 });
  }
}
