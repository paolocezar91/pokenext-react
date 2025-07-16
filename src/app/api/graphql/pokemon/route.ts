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
      pokemonMany(ids: $ids) {
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
    const data = await request<{ pokemonMany: Record<string, unknown>[] }>(apiUrl, query, vars);
    const paginatedResults = data.pokemonMany;
    const response = {
      count: paginatedResults.length,
      results: paginatedResults
    };

    return NextResponse.json(response, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'GraphQL error' }, { status: 500 });
  }
}

async function getAll(vars: { limit?: number, offset?: number, name?: string, types?: string }) {
  const query = gql`
      query ($limit: Int, $offset: Int, $name: String, $types: String) {
        pokemonList(limit: $limit, offset: $offset, name: $name, types: $types) {
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
    const data = await request<{ pokemonList: Record<string, unknown>[] }>(apiUrl, query, vars);
    const paginatedResults = data.pokemonList;
    const response = {
      count: paginatedResults.length,
      results: paginatedResults
    };

    return NextResponse.json(response, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'GraphQL error' }, { status: 500 });
  }
}