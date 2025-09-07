import { auth } from "@/auth";
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function middleware(request: any) {
  await auth(request);
  return createMiddleware(routing)(request);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|fonts|favicon.ico|logo.svg).*)",
  ],
};