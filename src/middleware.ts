import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { locales } from "./i18n/config";

// Basic getLocale implementation
function getLocale(request: Request) {
  const acceptLang = request.headers.get("accept-language");
  if (!acceptLang) return locales[0];
  const preferred = acceptLang.split(",").map(l => l.split(";")[0].trim());
  const matched = preferred.find(l => locales.includes(l));
  return matched || locales[0];
}

export function middleware(request: any) {
  // Run auth middleware first
  const authResponse = auth(request);
  if (authResponse) return authResponse;

  const { pathname } = request.nextUrl;
  // Exclude API, _next, and static files from i18n redirect
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/logo.svg') ||
    pathname.startsWith('/fonts') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};