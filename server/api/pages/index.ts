import { listPages } from "~/server/utils/pages";

export default defineEventHandler(async (event) => {
  if (event.method !== "GET") {
    setResponseStatus(event, 405);
    return { error: "Method Not Allowed" };
  }

  const pages = await listPages();
  return pages;
});
