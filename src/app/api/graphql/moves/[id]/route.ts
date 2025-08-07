import { idOrName } from '@/app/api-utils';
import { gql, request } from 'graphql-request';
import { NextRequest, NextResponse } from 'next/server';

const apiUrl = process.env.GRAPHQL_URL as string;

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vars = idOrName(id);
  const query = gql`
    query ($id: Int, $name: String) {
      moveById(id: $id, name: $name) {
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
    const data = await request<{ moveById: Record<string, unknown> }>(apiUrl, query, vars);
    return NextResponse.json(data.moveById, { status: 200 });
  } catch(err) {
    return NextResponse.json({ error: 'GraphQL error', err }, { status: 500 });
  }
}
