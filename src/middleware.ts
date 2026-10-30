import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  isAdminAccessAllowed,
  isInsecureRequest,
  parseAdminHosts,
} from '@/lib/admin-access';

function isAdminAllowed(request: NextRequest): boolean {
  return isAdminAccessAllowed({
    isProduction: process.env.NODE_ENV === 'production',
    adminFlag: process.env.ENABLE_ADMIN,
    host: request.headers.get('host'),
    allowlist: parseAdminHosts(process.env.ADMIN_ALLOWED_HOSTS),
  });
}

function arrivedOverHttp(request: NextRequest): boolean {
  return isInsecureRequest({
    forwardedProto: request.headers.get('x-forwarded-proto'),
    urlProtocol: request.nextUrl.protocol,
  });
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  // 'unsafe-eval' is only required by the development toolchain (HMR and source
  // maps); production has no eval in this codebase. 'unsafe-inline' stays because
  // Next.js emits inline bootstrap scripts.
  const scriptSrc =
    process.env.NODE_ENV === 'production'
      ? "script-src 'self' 'unsafe-inline' https://www.google.com https://www.gstatic.com https://www.googletagmanager.com"
      : "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://www.googletagmanager.com";

  const csp = [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    "img-src 'self' data: blob: https://*.googleusercontent.com https://*.openstreetmap.org https://server.arcgisonline.com https://*.google-analytics.com",
    // reCAPTCHA and Google Analytics both post back to their own origins.
    "connect-src 'self' https://api.open-meteo.com https://*.googleapis.com https://www.google.com https://www.google-analytics.com https://*.analytics.google.com",
    "frame-src 'self' https://www.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);

  const isAdminPath =
    request.nextUrl.pathname.startsWith('/admin') ||
    request.nextUrl.pathname.startsWith('/login');

  // The admin panel is a local-only authoring tool: it writes to data/*.json and
  // public/uploads, which are baked into the image at build time. Production must
  // never reach it.
  //
  // Fail closed: in production the panel requires the explicit server-side flag
  // ENABLE_ADMIN=true *and* an allowlisted host. The flag cannot be influenced by
  // the request, so a forged Host header alone never re-enables the panel.
  if (isAdminPath && !isAdminAllowed(request)) {
    return new NextResponse('Not Found', { status: 404 });
  }

  if (process.env.NODE_ENV === 'production' && arrivedOverHttp(request)) {
    const canonicalUrl = process.env.SITE_URL;
    if (canonicalUrl) {
      // Never build the redirect target from the Host header: that turns this
      // into an open redirect and a cache-poisoning vector.
      const target = new URL(request.nextUrl.pathname + request.nextUrl.search, canonicalUrl);
      return NextResponse.redirect(target, 301);
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
  ],
};
