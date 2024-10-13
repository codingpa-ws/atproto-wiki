import { newClient } from "../utils/atproto";
import { schema } from "../utils/db";
import crypto from "crypto";

export default defineEventHandler(async (event) => {
  const host = event.headers.get("host");
  if (!host) {
    setResponseStatus(event, 400);
    return { error: "Bad Request" };
  }

  const client = await newClient({ host });

  const params = new URLSearchParams(event.path.split("?")[1]);
  const { session } = await client.callback(params);

  const url = new URL("https://api.bsky.app/xrpc/app.bsky.actor.getProfile");
  url.searchParams.set("actor", session.did);

  const resp: any = await $fetch(url.href);

  const userBase = {
    name: resp.displayName,
    handle: resp.handle,
    avatarUrl: resp.avatar,
  };

  await db
    .insert(schema.users)
    .values({
      did: session.did,
      ...userBase,
    })
    .onConflictDoUpdate({
      set: userBase,
      target: schema.users.did,
    });

  const token = `apwk_${crypto.hash(
    "sha256",
    crypto.randomBytes(1024),
    "hex"
  )}`;

  await db.insert(schema.userSessions).values({
    userId: session.did,
    token,
  });

  setCookie(event, "atprotowiki-session", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365,
  });

  return sendRedirect(event, "/");
});
