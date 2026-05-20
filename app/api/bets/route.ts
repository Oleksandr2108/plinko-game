import { proxyApiRequest } from "../_lib/proxy";

export async function GET(request: Request) {
  return proxyApiRequest(request, "bets");
}

export async function POST(request: Request) {
  return proxyApiRequest(request, "bets");
}
