import { gql, request } from 'graphql-request';
import { NextRequest, NextResponse } from 'next/server';

const apiUrl = process.env.GRAPHQL_URL as string;

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
    const { createUser } = await request<{ createUser: { id: string, email: string }}>(apiUrl, mutation, { email });
    return NextResponse.json(createUser, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'GraphQL error', err }, { status: 500 });
  }
}