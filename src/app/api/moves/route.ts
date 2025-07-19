import { NextRequest, NextResponse } from 'next/server';
import { gql, request } from 'graphql-request';

export async function GET(req: NextRequest) {
  const ids = req.nextUrl.searchParams.get("ids");

  if(ids) {
    return getByIds(ids);
  } else {
    return getAll();
  }

}

async function getByIds(ids: string) {
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
  const vars = { ids: ids.split(',') };
  try {
    const data = await request('http://localhost:5678/', query, vars) as any;
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
    const data = await request('http://localhost:5678/', query, {}) as any;
    return NextResponse.json(data.moves, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'GraphQL error' }, { status: 500 });
  }
}