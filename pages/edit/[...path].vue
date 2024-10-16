<script setup lang="ts">
import { Crepe } from "@milkdown/crepe";
import "@milkdown/crepe/theme/common/style.css";
import "diff2html/bundles/css/diff2html.min.css";

// We have some themes for you to choose
import "@milkdown/crepe/theme/frame.css";

const path = (useRoute().params.path as Array<string>)
  .map(encodeURIComponent)
  .join("/");

const editor = ref() as Ref<HTMLDivElement>;

const page = await useAPI(`/api/pages/${encodeURIComponent(path)}`);

if (!page || "error" in page) {
  throw createError({
    statusCode: 404,
    message: "Page not found",
  });
}

let meta = ref<Record<string, any>>(page.meta);
let crepe: Crepe;

onMounted(() => {
  crepe = new Crepe({
    root: editor.value,
    defaultValue: page.source.split("---").pop(),
  });
  crepe.create().then(() => {
    console.log("Editor created");
  });
});

let diff = ref("");

async function loadDiff() {
  const markdown = crepe.getMarkdown();
  const resp = await useAPI(`/api/pages/${encodeURIComponent(path)}/diff`, {
    method: "post",
    body: JSON.stringify({ markdown, meta }),
  });
  if ("error" in resp) {
    console.error(resp.error);
    return;
  }
  diff.value = resp.diff;
}

onBeforeUnmount(() => {
  crepe?.destroy();
});
</script>

<template>
  <h1 class="text-lg">Editing {{ path }}</h1>
  <button class="bg-blue-600 text-white rounded px-2 py-1" @click="loadDiff">
    Load diff
  </button>
  <div v-html="diff" />
  <div ref="editor"></div>
</template>
