import { newClient } from "~/server/utils/atproto";

export default defineEventHandler(async (event) => {
  const host = event.headers.get("host");

  if (!host) {
    setResponseStatus(event, 400, "Bad Request");
    return { error: "Host must be defined" };
  }

  const client = await newClient({ host });

  return client.clientMetadata;
});
