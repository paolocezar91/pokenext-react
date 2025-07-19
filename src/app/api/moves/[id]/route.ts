import { NextRequest, NextResponse } from 'next/server';
import { gql, request } from 'graphql-request';

export async function GET(req: NextRequest) {
  const idOrName = req.nextUrl.pathname.split('/').pop();
  const isId = !isNaN(Number(idOrName));
  const name = isId ? '' : idOrName;
  const id = isId ? Number(idOrName) : undefined;
  const params = { name, id };
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
    const data = await request('http://localhost:5678/', query, params) as any;
    return NextResponse.json(data.move, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'GraphQL error' }, { status: 500 });
  }
}
