<script setup lang="ts">
const props = defineProps<{ path: string }>();
const page = await useAPI(`/api/pages/${encodeURIComponent(props.path)}`);
if (!page || "error" in page) {
  throw createError({
    statusCode: 404,
    message: "Page not found",
  });
}
const article = ref<HTMLDivElement>();

useSeoMeta({
  title: page.meta.title,
  description: page.meta.description,
});
onMounted(() => {
  const links: NodeListOf<HTMLAnchorElement> =
    article.value!.querySelectorAll("a");

  for (const link of links) {
    const url = new URL(link.href);
    if (link.target === "_blank") continue;
    if (url.host !== window.location.host) {
      link.target = "_blank";
      link.classList.add("external");
      continue;
    }
    link.addEventListener("click", (event) => {
      if (event.ctrlKey || event.shiftKey || event.altKey || event.metaKey) {
        return;
      }
      event.preventDefault();

      useRouter().push(url.pathname);
    });
  }
});
</script>

<template>
  <div
    v-if="path !== 'home'"
    class="border-b border-gray-300 mb-3 flex items-center"
  >
    <h2 class="text-2xl font-bold">
      {{ (page.meta as any).title }}
    </h2>

    <div class="ml-auto flex">
      <nuxt-link class="a px-2" :href="`/edit/${path}`">Edit</nuxt-link>
    </div>
  </div>
  <article class="md" ref="article" v-html="page.html"></article>
</template>
