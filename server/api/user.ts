import { eq } from "drizzle-orm";

export default defineEventHandler(
  async (event): Promise<User | undefined | { error: string }> => {
    if (event.method !== "GET") {
      setResponseStatus(event, 405);
      return { error: "Method Not Allowed" };
    }

    const cookie = getCookie(event, "atprotowiki-session");
    if (!cookie) {
      return undefined;
    }

    const session = await db.query.userSessions.findFirst({
      where: eq(schema.userSessions.token, cookie),
    });
    if (!session) {
      return undefined;
    }
    return await db.query.users.findFirst({
      where: eq(schema.users.did, session.userId),
    });
  }
);
