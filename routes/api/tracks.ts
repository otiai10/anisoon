import { HandlerContext } from "$fresh/server.ts";

export const handler = async (
  _req: Request,
  _ctx: HandlerContext,
): Promise<Response> => {
  const url =
    "https://raw.githubusercontent.com/otiai10/anisoon/main/db/tracks/2022/08/18.json";
  const res = await fetch(url);
  return new Response(res.body, {
    headers: { "Content-Type": "application/json" },
  });
};
