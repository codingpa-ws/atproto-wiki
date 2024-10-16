export default defineEventHandler(async (event) => {
  if (event.method !== "GET") {
    setResponseStatus(event, 405);
    return { error: "Method Not Allowed" };
  }

  const page = getRouterParam(event, "page");
  return loadPage(decodeURIComponent(page!));
});
