import request, { RequestDocument } from "graphql-request";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { sign } from "jsonwebtoken";
// prefer the NextAuth env var but support older AUTH_SECRET in .env.local
const secret = (process.env.NEXTAUTH_SECRET ||
  process.env.AUTH_SECRET) as string;

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
  console.log("authorizedQueryGraphql headers:", headers);

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
  // Try retrieving the token using the Next Request first. In some hosted/test
  // environments next-auth's getToken can't find the cookie from the provided
  // request object; if that happens, attempt a fallback using only the
  // cookie header (shim a minimal request object). We avoid passing unknown
  // params to getToken to keep TypeScript happy.
  let token = (await getToken({ req, secret })) as Record<
    string,
    unknown
  > | null;

  if (!token) {
    const cookieHeader = req.headers.get("cookie");
    if (cookieHeader) {
      try {
        const shimReq = {
          headers: { cookie: cookieHeader },
        } as unknown as NextRequest;
        token = (await getToken({ req: shimReq, secret })) as Record<
          string,
          unknown
        > | null;
      } catch (e) {
        console.log("getToken fallback failed", e);
      }
    }
  }

  console.log("getAuthorizationToken", token ?? null, !!secret);

  const headers = token
    ? {
      Authorization: `Bearer ${sign(token as object, secret)}`,
      ...additionalHeaders,
    }
    : additionalHeaders;

  return headers;
};
