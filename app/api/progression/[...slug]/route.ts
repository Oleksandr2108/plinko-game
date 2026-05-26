import { proxyApiRequest } from "../../_lib/proxy";

const proxyProgressionRequest = async (
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) => {
  const { slug } = await params;
  return proxyApiRequest(request, `progression/${slug.join("/")}`);
};

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string[] }> },
) {
  return proxyProgressionRequest(request, context);
}

export async function POST(
  request: Request,
  context: { params: Promise<{ slug: string[] }> },
) {
  return proxyProgressionRequest(request, context);
}
