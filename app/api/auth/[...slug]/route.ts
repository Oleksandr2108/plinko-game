import { proxyApiRequest } from "../../_lib/proxy";

const proxyAuthRequest = async (
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) => {
  const { slug } = await params;
  return proxyApiRequest(request, `auth/${slug.join("/")}`);
};

export async function POST(
  request: Request,
  context: { params: Promise<{ slug: string[] }> },
) {
  return proxyAuthRequest(request, context);
}
