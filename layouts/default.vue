<script setup lang="ts">
const user = await useUser();

async function logout() {
  if (confirm("Do you want to log out?")) {
    await useAPI("/api/logout", { method: "post" });
    window.location.href = "/";
  }
}
</script>

<template>
  <nav class="py-2 px-2 flex items-center mb-4">
    <h1 class="text-2xl font-bold">ATProto.wiki</h1>

    <div class="ml-auto" v-if="!$route.fullPath.startsWith('/login')">
      <div v-if="user" class="flex items-center gap-2">
        <img
          v-if="user.avatarUrl"
          :src="user.avatarUrl"
          class="rounded-full"
          height="28"
          width="28"
          alt=""
        />
        <button @click="logout" class="underline hover:no-underline">
          Logout
        </button>
      </div>

      <nuxt-link
        v-else
        href="/login"
        class="bg-blue-600 text-white py-1.5 px-2 rounded"
      >
        🦋 Login with Bluesky
      </nuxt-link>
    </div>
  </nav>
  <main class="px-2">
    <slot />
  </main>
</template>

<style scoped>
main,
nav {
  max-width: 1000px;
  @apply mx-auto;
}
</style>
