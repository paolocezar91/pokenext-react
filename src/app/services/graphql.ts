import request from "graphql-request";

export async function requestGraphql<T>(
  query: string,
  vars?: Record<string, unknown>,
) {
  const apiUrl = process.env.GRAPHQL_URL as string;

  try {
    return await request<T>(apiUrl, query, vars);
  } catch (err) {
    throw err;
  }
}
