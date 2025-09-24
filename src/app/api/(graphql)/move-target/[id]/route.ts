import { idOrName } from "@/app/api/api-utils";
import { queryGraphql } from "@/app/services/graphql";
import { gql } from "graphql-request";
import { NextRequest, NextResponse } from "next/server";
import { MoveTarget } from "pokeapi-typescript";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const vars = idOrName(id);
  const query = gql`
    query ($id: ID!) {
      moveTargetById(id: $id) {
        id
        name
        descriptions {
          language {
            name
          }
          description
        }
        moves {
          name
          url
        }
      }
    }
  `;
  try {
    const { moveTargetById } = await queryGraphql<{
      moveTargetById: MoveTarget;
    }>(query, vars);
    return NextResponse.json(moveTargetById, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "GraphQL error", err }, { status: 500 });
  }
}
