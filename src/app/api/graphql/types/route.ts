import { gql, request } from 'graphql-request';
import { NextResponse } from 'next/server';
const apiUrl = process.env.GRAPHQL_URL as string;

export async function GET() {
  const query = gql`
      query {
        types {
          id
          name
        }
      }
    `;

  try {
    const data = await request<{ types: Record<string, unknown>[] }>(apiUrl, query);
    return NextResponse.json(data.types, { status: 200 });
  } catch(err) {
    return NextResponse.json({ error: 'GraphQL error', err }, { status: 500 });
  }
}
