import { NextResponse } from 'next/server'

/*
 * The App Router gives no way for the root layout (the only place allowed
 * to render <head>) to know the current route's pathname without this —
 * see app/layout.js, which reads x-pathname back out via next/headers to
 * server-render seo_pages.custom_head for the right path.
 */
export function proxy(request) {
  const headers = new Headers(request.headers)
  headers.set('x-pathname', request.nextUrl.pathname)
  return NextResponse.next({ request: { headers } })
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
