import { gql, request } from 'graphql-request';
import { NextResponse } from 'next/server';

const apiUrl = process.env.GRAPHQL_URL as string;

export async function GET(_, { params }: { params: { email: string }}) {
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
    const data = await request<{ user: { id: string, email: string }}>(apiUrl, query, { email });
    return NextResponse.json(data.user, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'GraphQL error', err }, { status: 500 });
  }
}