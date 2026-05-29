import { proxyApiRequest } from "../../_lib/proxy";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await params;
  return proxyApiRequest(request, `game/${slug.join("/")}`);
}
