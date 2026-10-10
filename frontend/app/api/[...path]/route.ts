import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function backendOrigin(): string | null {
  const configured = process.env.BACKEND_URL?.trim().replace(/\/+$/, "");
  if (configured) return configured;
  if (process.env.VERCEL) return null;
  return "http://localhost:8000";
}

async function proxy(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const origin = backendOrigin();
  if (!origin) {
    return NextResponse.json(
      { detail: "BACKEND_URL is not set." },
      { status: 500 },
    );
  }

  const { path } = await context.params;
  const target = new URL(`${origin}/${path.join("/")}`);
  target.search = request.nextUrl.search;

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);

  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  let response: Response;
  try {
    response = await fetch(target, {
      method: request.method,
      headers,
      body: hasBody ? await request.arrayBuffer() : undefined,
    });
  } catch {
    return NextResponse.json(
      { detail: "The coach could not be reached." },
      { status: 502 },
    );
  }

  const responseHeaders = new Headers();
  const responseType = response.headers.get("content-type");
  if (responseType) responseHeaders.set("content-type", responseType);

  return new NextResponse(response.body, {
    status: response.status,
    headers: responseHeaders,
  });
}

export const GET = proxy;
export const POST = proxy;
