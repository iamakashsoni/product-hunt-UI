<template>
  <nav
    class="backdrop-blur-md bg-white/70 shadow-lg px-8 py-4 flex justify-between items-center sticky top-0 z-50"
  >
    <h1
      class="text-3xl font-bold text-blue-700 tracking-wide cursor-default select-none"
    >
      Kulp.AI Hunt
    </h1>

    <div class="flex items-center gap-4">
      <template v-if="user">
        <span class="text-gray-700 font-semibold">Hi, {{ user.name }}</span>
        <button
          @click="handleLogout"
          class="w-8 h-8 flex items-center justify-center rounded-full font-medium text-white bg-red-500 hover:bg-red-600 transition"
          title="Logout"
        >
          <Icon name="uil:sign-out-alt" class="text-white" size="22" />
        </button>
      </template>

      <NuxtLink
        v-else
        to="/auth/login"
        class="px-6 py-2 font-semibold text-white rounded-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg transition duration-300 ease-in-out"
      >
        Login
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuth } from "~/composables/useAuth";
import { useHead } from "#imports";

useHead({
  title: "Kulp.AI Hunt",
});

const router = useRouter();
const { user, loadUserFromStorage, logout } = useAuth();

onMounted(() => {
  loadUserFromStorage();
});

const handleLogout = () => {
  logout();
  router.push("/");
};
</script>
