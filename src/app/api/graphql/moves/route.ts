import { gql, request } from 'graphql-request';
import { NextRequest, NextResponse } from 'next/server';
const apiUrl = process.env.GRAPHQL_URL as string;

export async function GET(req: NextRequest) {
  const ids = req.nextUrl.searchParams.get('ids');
  if (ids) {
    return await getByIds(ids);
  } else {
    return await getAll();
  }
}


async function getByIds(ids: string) {
  const vars = { ids: ids.split(',') };
  const query = gql`
    query ($ids: [ID]) {
      movesMany(ids: $ids) {
        id
        name
        power
        pp
        accuracy
        damage_class { name }
      }
    }
  `;

  try {
    const data = await request<{ movesMany: Record<string, unknown>[] }>(apiUrl, query, vars);
    return NextResponse.json(data.movesMany, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'GraphQL error' }, { status: 500 });
  }
}

async function getAll() {
  const query = gql`
      query {
        moves {
          id
          name
        }
      }
    `;
  try {
    const data = await request<{ moves: { id: string, name: string }[] }>(apiUrl, query);

    return NextResponse.json(data.moves, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'GraphQL error' }, { status: 500 });
  }
}