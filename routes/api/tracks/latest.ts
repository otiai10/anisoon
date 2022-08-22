import { HandlerContext } from "$fresh/server.ts";

const DATABASE_URL =
  `https://raw.githubusercontent.com/otiai10/anisoon/main/db`;
export const handler = async (
  _req: Request,
  _ctx: HandlerContext,
): Promise<Response> => {
  const [latest, ..._] =
    await (await fetch(`${DATABASE_URL}/tracks/index.json`)).json();
  const res = await fetch(`${DATABASE_URL}/tracks${latest.path}`);
  return new Response(res.body, {
    headers: { "Content-Type": "application/json" },
  });
};
