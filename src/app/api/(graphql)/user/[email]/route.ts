import { gql } from "graphql-request";
import { NextRequest, NextResponse } from "next/server";
import { authorizedQueryGraphql } from "@/app/services/graphql";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  const email = (await params).email;

  const query = gql`
    query ($email: String!) {
      user(email: $email) {
        id
        email
      }
    }
  `;

  try {
    const { user } = await authorizedQueryGraphql<{
      user: { id: string; email: string };
    }>(req, query, { email });
    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "GraphQL error", err }, { status: 500 });
  }
}
