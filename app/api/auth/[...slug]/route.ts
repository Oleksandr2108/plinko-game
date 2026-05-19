import { API_BASE_URL } from "@/shared/config";

const forwardHeaders = (request: Request) => {
  const headers = new Headers();
  const authorization = request.headers.get("authorization");
  const contentType = request.headers.get("content-type");

  if (authorization) {
    headers.set("authorization", authorization);
  }

  if (contentType) {
    headers.set("content-type", contentType);
  }

  return headers;
};

const proxyAuthRequest = async (
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) => {
  const { slug } = await params;
  const targetUrl = `${API_BASE_URL.replace(/\/$/, "")}/auth/${slug.join("/")}`;
  const body = request.method === "POST" ? await request.text() : undefined;

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: forwardHeaders(request),
      body,
      cache: "no-store",
    });

    const responseText = await response.text();
    const contentType =
      response.headers.get("content-type") ?? "application/json";

    return new Response(responseText, {
      status: response.status,
      headers: {
        "content-type": contentType,
      },
    });
  } catch {
    return Response.json(
      {
        message: "Unable to reach auth service.",
      },
      { status: 502 },
    );
  }
};

export async function POST(
  request: Request,
  context: { params: Promise<{ slug: string[] }> },
) {
  return proxyAuthRequest(request, context);
}
