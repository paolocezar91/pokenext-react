import { gql, request } from "graphql-request";
import { NextRequest, NextResponse } from "next/server";

const apiUrl = process.env.GRAPHQL_URL as string;

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ email: string }> },
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
    const { user } = await request<{ user: { id: string; email: string } }>(
      apiUrl,
      query,
      { email },
    );
    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "GraphQL error", err }, { status: 500 });
  }
}
