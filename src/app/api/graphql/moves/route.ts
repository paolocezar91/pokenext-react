import { formatResultsCount } from '@/app/api-utils';
import { gql, request } from 'graphql-request';
import { NextRequest, NextResponse } from 'next/server';
import { IMove } from 'pokeapi-typescript';
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
      movesByIds(ids: $ids) {
        id
        name
        power
        pp
        accuracy
        damage_class {
          name
        }
        type {
          name
          url
        }
        machines {
          machine {
            url
          }
          version_group {
            name
            url
          }
        }
      }
    }
  `;

  try {
    const data = await request<{ movesByIds: IMove[] }>(apiUrl, query, vars);
    const response = formatResultsCount(data.movesByIds);
    return NextResponse.json(response, { status: 200 });
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
    const data = await request<{ moves: IMove[] }>(apiUrl, query);
    const response = formatResultsCount(data.moves);
    return NextResponse.json(response, { status: 200 });
  } catch(err) {
    return NextResponse.json({ error: 'GraphQL error', err }, { status: 500 });
  }
}
