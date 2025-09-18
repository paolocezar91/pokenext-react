import { authorizedQueryGraphql } from "@/app/services/graphql";
import { gql } from "graphql-request";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  const mutation = gql`
    mutation ($email: String!) {
      createUser(email: $email) {
        id
        email
      }
    }
  `;

  try {
    const { createUser } = await authorizedQueryGraphql<{
      createUser: { id: string; email: string };
    }>(req, mutation, { email });
    return NextResponse.json(createUser, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "GraphQL error", err }, { status: 500 });
  }
}
