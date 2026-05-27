import { API_BASE_URL } from "@/shared/config";

const METHODS_WITH_BODY = new Set(["POST", "PUT", "PATCH", "DELETE"]);

const buildTargetUrl = (request: Request, path: string) => {
  const incomingUrl = new URL(request.url);
  const targetUrl = new URL(
    `${API_BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`,
  );

  targetUrl.search = incomingUrl.search;

  return targetUrl;
};

const forwardHeaders = (
  request: Request,
  options: { includeContentType?: boolean } = {},
) => {
  const { includeContentType = true } = options;
  const headers = new Headers();
  const authorization = request.headers.get("authorization");
  const contentType = request.headers.get("content-type");

  if (authorization) {
    headers.set("authorization", authorization);
  }

  if (includeContentType && contentType) {
    headers.set("content-type", contentType);
  }

  return headers;
};

export const proxyApiRequest = async (request: Request, path: string) => {
  const targetUrl = buildTargetUrl(request, path);
  const contentType = request.headers.get("content-type") ?? "";
  const isMultipart = contentType
    .toLowerCase()
    .startsWith("multipart/form-data");
  let body: BodyInit | undefined;

  if (METHODS_WITH_BODY.has(request.method)) {
    if (isMultipart) {
      body = await request.formData();
    } else {
      const requestBody = await request.arrayBuffer();
      body = requestBody.byteLength > 0 ? requestBody : undefined;
    }
  }

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: forwardHeaders(request, {
        includeContentType: !isMultipart,
      }),
      body,
      cache: "no-store",
    });

    const responseText = await response.text();
    const contentType = response.headers.get("content-type");
    const headers = new Headers();

    if (contentType) {
      headers.set("content-type", contentType);
    }

    return new Response(responseText || null, {
      status: response.status,
      headers,
    });
  } catch {
    return Response.json(
      {
        message: "Unable to reach upstream API.",
      },
      { status: 502 },
    );
  }
};
