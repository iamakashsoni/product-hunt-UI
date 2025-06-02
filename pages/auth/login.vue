<template>
  <div class="flex items-center justify-center px-4 py-0">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
      <div class="text-center">
        <h2 class="text-3xl font-extrabold text-blue-700">Welcome Back</h2>
        <p class="text-sm text-gray-500 italic">
          Login to continue your journey
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div>
          <label class="block text-md font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            v-model="form.email"
            type="email"
            placeholder="you@example.com"
            class="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <div>
          <label class="block text-md font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            v-model="form.password"
            type="password"
            placeholder="Your password"
            class="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <p v-if="error" class="text-sm text-red-600 text-start">
          {{ error }}
        </p>

        <button
          type="submit"
          class="w-full px-6 py-2 font-semibold text-white rounded-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg transition duration-300 ease-in-out"
        >
          Login
        </button>
      </form>

      <div class="text-sm text-center text-gray-600 pt-4">
        Don't have an account?
        <a
          href="/auth/register"
          class="text-blue-600 hover:underline font-medium"
        >
          Register
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "~/composables/useAuth";

const router = useRouter();

const { setUser } = useAuth();

const form = reactive({
  email: "",
  password: "",
});

const error = ref("");

async function handleSubmit() {
  if (!form.email || !form.password) {
    error.value = "Please fill all fields";
    return;
  }

  error.value = "";

  try {
    const res = await $fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: form,
    });

    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user));
    setUser(res.user);
    alert(`Welcome back, ${res.user.name}`);
    router.push("/");
  } catch (err: any) {
    error.value = err?.data?.message || "Invalid credentials. Try again.";
  }
}
</script>
