import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { locales } from "./i18n/config";
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Basic getLocale implementation
function getLocale(request: Request) {
  const acceptLang = request.headers.get("accept-language");
  if (!acceptLang) return locales[0];
  const preferred = acceptLang.split(",").map(l => l.split(";")[0].trim());
  const matched = preferred.find(l => locales.includes(l));
  return matched || locales[0];
}

export async function middleware(request: any) {
  await auth(request);
  return createMiddleware(routing)(request);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|fonts|favicon.ico|logo.svg).*)",
  ],
};