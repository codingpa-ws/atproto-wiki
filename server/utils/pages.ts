import { glob } from "glob";

const dir = "data/atproto-wiki-docs";

export async function listPages() {
  const pages = await glob(`${dir}/**/*.md`);

  return pages.map((p) => p.replace(dir, "").replace(/\.md$/, ""));
}
