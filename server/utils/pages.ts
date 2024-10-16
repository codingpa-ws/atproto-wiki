import { glob } from "glob";
import { readFile } from "fs/promises";
import rehypeSanitize from "rehype-sanitize";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { matter } from "vfile-matter";
import { unified } from "unified";
import { type Parent } from "unist";

export const dir = "data/atproto-wiki-docs";

export async function listPages() {
  const pages = await glob(`${dir}/**/*.md`);

  return pages.map((p) => p.replace(dir, "").replace(/\.md$/, ""));
}

export async function loadPage(slug: string): Promise<{
  meta: Record<string, any>;
  html: string;
  source: string;
}> {
  slug = slug.replace(/[.]/g, "");
  const source = await readFile(`${dir}/${slug}.md`).then((r) => r.toString());

  const file = await unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(() => (tree, file) => matter(file))
    .use(remarkGfm)
    .use(() => (tree, file) => {
      updateLinks(tree as Parent);
    })
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .process(source);

  return {
    meta: file.data.matter as Record<string, any>,
    html: file.value.toString(),
    source,
  };
}

function updateLinks(tree: Parent) {
  for (const element of tree.children) {
    if (element.type === "link" && (element as any).url.startsWith("/")) {
      (element as any).url = `/wiki${(element as any).url}`;
    }
    if ("children" in element) {
      updateLinks(element as Parent);
    }
  }
}
