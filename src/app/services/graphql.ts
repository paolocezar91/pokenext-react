import request, { RequestDocument } from "graphql-request";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { sign } from "jsonwebtoken";
// prefer the NextAuth env var but support older AUTH_SECRET in .env.local
const secret = (process.env.NEXTAUTH_SECRET ||
  process.env.AUTH_SECRET) as string;
const isVercel = process.env.ENVIRONMENT !== "local";

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
  // Try retrieving the token using the Next Request first.
  let token = (await getToken({
    req,
    secret,
    secureCookie: isVercel,
    cookieName:
      !isVercel
        ? "authjs.session-token"
        : "__Secure-authjs.session-token",
  })) as Record<string, unknown> | null;

  const cookieHeader = req.headers.get("cookie");
  console.log({ cookieHeader });
  console.log({ token });

  if (!token) {
    if (cookieHeader) {
      // First try the full cookie header shim (existing fallback)
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
      console.log({ token2: token });

      // If still null, try individual cookie names commonly used in prod (Vercel/NextAuth)
      if (!token) {
        try {
          const parsed = Object.fromEntries(
            cookieHeader
              .split(";")
              .map((c) => c.trim())
              .map((s) => {
                const idx = s.indexOf("=");
                return [s.slice(0, idx), s.slice(idx + 1)];
              })
          );

          const candidates = [
            "__Host-authjs.session-token",
            "__Secure-authjs.session-token",
            "authjs.session-token",
            "__Host-next-auth.session-token",
            "__Secure-next-auth.session-token",
            "next-auth.session-token",
          ];

          for (const name of candidates) {
            const val = parsed[name];
            if (!val) continue;
            try {
              const shimReqSingle = {
                headers: { cookie: `${name}=${val}` },
              } as unknown as NextRequest;
              token = (await getToken({
                req: shimReqSingle,
                secret,
              })) as Record<string, unknown> | null;
              if (token) {
                console.log("getToken succeeded with cookie:", name);
                break;
              }
            } catch (e) {
              console.log("getToken candidate failed", name, e);
            }
          }
        } catch (e) {
          console.log("cookie parse fallback failed", e);
        }
        console.log({ token3: token });
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
