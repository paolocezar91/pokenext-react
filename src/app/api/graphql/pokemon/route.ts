import { formatResultsCount } from '@/app/api-utils';
import { gql, request } from 'graphql-request';
import { NextRequest, NextResponse } from 'next/server';
const apiUrl = process.env.GRAPHQL_URL as string;

export async function GET(req: NextRequest) {
  const ids = req.nextUrl.searchParams.get("ids");

  if(ids) {
    return await getByIds(ids);
  } else {
    const vars = {
      limit: Number(req.nextUrl.searchParams.get("limit")),
      offset: Number(req.nextUrl.searchParams.get("offset")),
      name: req.nextUrl.searchParams.get("name") ?? undefined,
      types: req.nextUrl.searchParams.get("types") ?? undefined
    };
    return await getAll(vars);
  }

}

async function getByIds(ids: string) {
  const vars = { ids: ids.split(',') };
  const query = gql`
    query ($ids: [ID]) {
      pokemonsByIds(ids: $ids) {
        id
        name
        types {
          type {
            name
            url
          }
        }
        stats {
          base_stat
          stat {
              name
          }
        }
        forms {
          name
          url
        }
      }
    }
  `;

  try {
    const data = await request<{ pokemonsByIds: Record<string, unknown>[] }>(apiUrl, query, vars);
    const response = formatResultsCount(data.pokemonsByIds);
    return NextResponse.json(response, { status: 200 });
  } catch(err) {
    return NextResponse.json({ error: 'GraphQL error', err }, { status: 500 });
  }
}

async function getAll(vars: { limit?: number, offset?: number, name?: string, types?: string }) {
  const query = gql`
      query ($limit: Int, $offset: Int, $name: String, $types: String) {
        pokemons(limit: $limit, offset: $offset, name: $name, types: $types) {
          id
          name
          types {
            type {
              name
              url
            }
          }
          stats {
            base_stat
            stat {
                name
            }
          }
        }
      }
    `;

  try {
    const data = await request<{ pokemons: Record<string, unknown>[] }>(apiUrl, query, vars);
    const response = formatResultsCount(data.pokemons);
    return NextResponse.json(response, { status: 200 });
  } catch(err) {
    return NextResponse.json({ error: 'GraphQL error', err }, { status: 500 });
  }
}