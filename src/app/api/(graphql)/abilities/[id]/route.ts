import { idOrName } from "@/app/api/api-utils";
import { queryGraphql } from "@/app/services/graphql";
import { gql } from "graphql-request";
import { NextRequest, NextResponse } from "next/server";
import { IAbility } from "pokeapi-typescript";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const vars = idOrName(id);

  const query = gql`
    query ($id: Int, $name: String) {
      abilityById(id: $id, name: $name) {
        id
        name
        effect_entries {
          effect
          short_effect
          language {
            name
          }
        }
      }
    }
  `;

  try {
    const { abilityById } = await queryGraphql<{
      abilityById: IAbility;
    }>(query, vars);
    return NextResponse.json(abilityById, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "GraphQL error", err }, { status: 500 });
  }
}
