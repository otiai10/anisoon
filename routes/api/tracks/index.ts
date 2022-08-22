import { HandlerContext } from "$fresh/server.ts";

const DATABASE_URL =
  `https://raw.githubusercontent.com/otiai10/anisoon/main/db`;
export const handler = async (
  _req: Request,
  _ctx: HandlerContext,
): Promise<Response> => {
  // if (_req.url.endsWith("/api/tracks")) {
  const res = await fetch(`${DATABASE_URL}/tracks/index.json`);
  return new Response(res.body, {
    headers: { "Content-Type": "application/json" },
  });
};
