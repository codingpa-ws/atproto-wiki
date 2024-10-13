import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  if (event.method !== "POST") {
    setResponseStatus(event, 405);
    return { error: "Method Not Allowed" };
  }

  const cookie = getCookie(event, "atprotowiki-session");
  if (!cookie) {
    setResponseStatus(event, 403);
    return { error: "Unauthorized" };
  }

  await db
    .delete(schema.userSessions)
    .where(eq(schema.userSessions.token, cookie));

  return {};
});
