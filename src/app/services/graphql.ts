import request, { RequestDocument } from "graphql-request";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { sign } from "jsonwebtoken";
const secret = process.env.AUTH_SECRET as string;

export async function requestGraphql<T>(
  query: string,
  vars?: Record<string, unknown>
) {
  const apiUrl = process.env.GRAPHQL_URL as string;

  try {
    return await request<T>(apiUrl, query, vars);
  } catch (err) {
    throw err;
  }
}

const getAuthorizationToken = async (
  req: NextRequest,
  additionalHeaders: HeadersInit = {}
) => {
  const token = (await getToken({ req, secret })) as Object;

  const headers = token
    ? { Authorization: `Bearer ${sign(token, secret)}`, ...additionalHeaders }
    : additionalHeaders;

  return headers;
};

export const queryGraphql = async <T extends Record<string, unknown>>(
  req: NextRequest,
  query: RequestDocument,
  vars: Record<string, unknown>,
  additionalHeaders?: HeadersInit
) => {
  const apiUrl = process.env.GRAPHQL_URL as string;
  const headers = await getAuthorizationToken(req, additionalHeaders);

  try {
    return await request<T>(apiUrl, query, vars, headers);
  } catch (error) {
    throw error;
  }
};
