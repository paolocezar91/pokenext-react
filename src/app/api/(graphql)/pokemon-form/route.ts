import { formatResultsCount } from "@/app/api/api-utils";
import { queryGraphql } from "@/app/services/graphql";
import { gql } from "graphql-request";
import { NextRequest, NextResponse } from "next/server";
import { IPokemonForm } from "pokeapi-typescript";

export async function GET(req: NextRequest) {
  const ids = req.nextUrl.searchParams.get("ids");
  const vars = { ids: ids!.split(",") };
  const query = gql`
    query ($ids: [ID]) {
      pokemonFormByIds(ids: $ids) {
        id
        name
        is_mega
        is_default
      }
    }
  `;

  try {
    const { pokemonFormByIds } = await queryGraphql<{
      pokemonFormByIds: IPokemonForm[];
    }>(query, vars);
    return NextResponse.json(formatResultsCount(pokemonFormByIds), {
      status: 200,
    });
  } catch (err) {
    return NextResponse.json({ error: "GraphQL error", err }, { status: 500 });
  }
}
