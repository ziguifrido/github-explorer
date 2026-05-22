import type { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

const GITHUB_API_BASE = 'https://api.github.com';
const ALLOWED_PATHS = [
  /^\/users\/[^/]+$/,
  /^\/users\/[^/]+\/repos$/,
  /^\/repos\/[^/]+\/[^/]+$/,
  /^\/repos\/[^/]+\/[^/]+\/readme$/,
  /^\/repos\/[^/]+\/[^/]+\/commits$/,
  /^\/repos\/[^/]+\/[^/]+\/contributors$/,
  /^\/repos\/[^/]+\/[^/]+\/languages$/,
] as const;

function isAllowedPath(pathname: string) {
  return ALLOWED_PATHS.some((pattern) => pattern.test(pathname));
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const pathname = `/${path.join('/')}`;

  if (!isAllowedPath(pathname)) {
    return Response.json({ error: 'Unsupported GitHub API endpoint.' }, { status: 400 });
  }

  const upstreamUrl = `${GITHUB_API_BASE}${pathname}${request.nextUrl.search}`;
  const token = process.env.GITHUB_TOKEN;

  const upstreamResponse = await fetch(upstreamUrl, {
    headers: {
      Accept: 'application/vnd.github+json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: 'no-store',
  });

  const body = await upstreamResponse.text();
  const contentType = upstreamResponse.headers.get('content-type') || 'application/json; charset=utf-8';

  return new Response(body, {
    status: upstreamResponse.status,
    headers: {
      'Content-Type': contentType,
      'X-Ratelimit-Remaining': upstreamResponse.headers.get('x-ratelimit-remaining') ?? '',
    },
  });
}
