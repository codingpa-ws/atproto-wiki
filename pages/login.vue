<script setup lang="ts">
const handle = ref("");

async function login() {
  const { url }: any = await $fetch("/api/login", {
    method: "post",
    body: { handle: handle.value },
  });
  window.location.href = url;
}
</script>

<template>
  <main class="max-w-[400px] px-4 mx-auto py-12">
    <h1 class="font-bold text-2xl mb-3">Login</h1>
    <div class="flex flex-col gap-3">
      <div class="flex flex-col">
        <label for="handle">Bluesky name</label>
        <div class="flex items-center">
          <div
            class="flex h-full border rounded rounded-r-none bg-gray-100 border-gray-200 border-r-0 py-0.5 px-2"
          >
            @
          </div>
          <input
            class="border-l-0 border border-gray-200 rounded rounded-l-none py-0.5 px-1 w-full"
            id="handle"
            name="handle"
            type="text"
            v-model="handle"
          />
        </div>
        <p class="text-gray-600 text-sm">For example, user.bsky.social.</p>
      </div>
      <button
        type="button"
        class="bg-blue-600 text-white py-1.5 px-2 rounded disabled:opacity-70 disabled:cursor-not-allowed"
        :disabled="handle.trim().length === 0"
        @click="login"
      >
        🦋 Login with Bluesky
      </button>
    </div>
  </main>
</template>
