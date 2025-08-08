import { idOrName } from "@/app/api-utils";
import { gql,request } from "graphql-request";
import { NextRequest, NextResponse } from "next/server";
import { IMoveTarget } from "pokeapi-typescript";

const apiUrl = process.env.GRAPHQL_URL as string;

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vars = idOrName(id);
  const query = gql`
    query ($id: ID!) {
      moveTargetById(id: $id) {
        id
        name
        descriptions {
          language { name }
          description
        }
        moves { name url }
      }
    }
  `;
  try {
    const { moveTargetById } = await request<{ moveTargetById: IMoveTarget }>(apiUrl, query, vars);
    return NextResponse.json(moveTargetById, { status: 200 });
  } catch(err) {
    return NextResponse.json({ error: 'GraphQL error', err }, { status: 500 });
  }
}