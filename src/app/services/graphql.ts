import request, { RequestDocument } from "graphql-request";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { sign } from "jsonwebtoken";
const secret = process.env.AUTH_SECRET as string;

export async function queryGraphql<T>(
  query: RequestDocument,
  vars: Record<string, unknown> = {},
  headers: HeadersInit = {}
) {
  const apiUrl = process.env.GRAPHQL_URL as string;

  try {
    return await request<T>(apiUrl, query, vars, headers);
  } catch (err) {
    throw err;
  }
}

export const authorizedQueryGraphql = async <T extends Record<string, unknown>>(
  req: NextRequest,
  query: RequestDocument,
  vars: Record<string, unknown>,
  additionalHeaders?: HeadersInit
) => {
  const headers = await getAuthorizationToken(req, additionalHeaders);

  try {
    return await queryGraphql<T>(query, vars, headers);
  } catch (error) {
    throw error;
  }
};

/**
 *
 * @param req
 * @param additionalHeaders
 * @returns
 */
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
