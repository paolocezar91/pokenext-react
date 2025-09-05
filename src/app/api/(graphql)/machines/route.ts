import { formatResultsCount } from '@/app/api/api-utils';
import { gql, request } from 'graphql-request';
import { NextRequest, NextResponse } from 'next/server';
import { IMachine } from 'pokeapi-typescript';
const apiUrl = process.env.GRAPHQL_URL as string;

export async function GET(req: NextRequest) {
  const ids = req.nextUrl.searchParams.get("ids");
  return await getByIds(ids!);
}

async function getByIds(ids: string) {
  const vars = { ids: ids.split(',') };
  const query = gql`
    query ($ids: [ID]) {
      machinesByIds(ids: $ids) {
        id
        machine { url }
        version_group { name url }
        item { name url }
        move { name url }
      }
    }
  `;

  try {
    const { machinesByIds } = await request<{ machinesByIds: IMachine[] }>(apiUrl, query, vars);
    return NextResponse.json(formatResultsCount(machinesByIds), { status: 200 });
  } catch(err) {
    return NextResponse.json({ error: 'GraphQL error', err }, { status: 500 });
  }
}
