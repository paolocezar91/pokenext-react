import { gql, request } from 'graphql-request';
import { NextResponse } from 'next/server';

const apiUrl = process.env.GRAPHQL_URL as string;

export async function GET(_, { params }: { params: { id: string }}) {
  const idOrName = (await params).id;
  const isId = !isNaN(Number(idOrName));
  const name = isId ? '' : idOrName;
  const id = isId ? Number(idOrName) : undefined;
  const query = gql`
    query ($id: Int, $name: String) {
      move(id: $id, name: $name) {
        id
        name
        power
        accuracy
        pp
        learned_by_pokemon { name url }
        target { name url }
        flavor_text_entries { flavor_text language { name } version_group { name } }
        type { name url }
        damage_class { name }
        effect_entries { language { name } effect }
      }
    }
  `;
  try {
    const data = await request<{ move: Record<string, unknown> }>(apiUrl, query, { name, id });

    return NextResponse.json(data.move, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'GraphQL error' }, { status: 500 });
  }
}
