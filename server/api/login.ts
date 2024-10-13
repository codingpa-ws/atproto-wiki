import { newClient } from "../utils/atproto";

export default defineEventHandler(async (event) => {
  if (event.method !== "POST") {
    setResponseStatus(event, 405);
    return { error: "Method Not Allowed" };
  }

  const data = await readBody(event);

  if (!("handle" in data)) {
    setResponseStatus(event, 400);
    return { error: "Bad Request" };
  }

  const host = event.headers.get("host");
  if (!host) {
    setResponseStatus(event, 400);
    return { error: "Bad Request" };
  }

  const client = await newClient({ host });

  const url = await client.authorize(data.handle, { prompt: "consent" });

  return {
    url,
  };
});
