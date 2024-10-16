import spawnAsync from "@expo/spawn-async";
import { dir } from "~/server/utils/pages";
import * as Diff2Html from "diff2html";

export default defineEventHandler(async (event) => {
  if (event.method !== "POST") {
    setResponseStatus(event, 405);
    return { error: "Method Not Allowed" };
  }

  const { markdown } = (await readBody(event)) || {};
  if (typeof markdown !== "string") {
    setResponseStatus(event, 400);
    return { error: "Bad Request" };
  }

  let path = getRouterParam(event, "page");
  if (!path) {
    setResponseStatus(event, 400);
    return { error: "Bad Request" };
  }
  const page = await loadPage(path);

  const command: spawnAsync.SpawnPromise<spawnAsync.SpawnResult> = spawnAsync(
    "git",
    ["diff", "--no-index", "--", `${path.replace(/[.]|^-/g, "")}.md`, "-"],
    { cwd: dir }
  );

  command.child.on("spawn", () => {
    command.child.stdin?.write(markdown);
    command.child.stdin?.destroy();
  });

  const { status, stdout } = await command.catch<spawnAsync.SpawnResult>(
    (e) => e
  );

  return {
    diff: Diff2Html.html(stdout, {
      drawFileList: false,
      diffStyle: "word",
    }),
  };
});
