<template>
  <div class="flex items-center justify-center px-4 py-0">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
      <div class="text-center">
        <h2 class="text-3xl font-extrabold text-blue-700">Create Account</h2>
        <p class="text-sm text-gray-500 italic">
          Join and explore the world of innovation
        </p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-5">
        <div>
          <label class="block text-md font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            v-model="form.name"
            type="text"
            placeholder="Your full name"
            class="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

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
            placeholder="Choose a strong password"
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
          Register
        </button>
      </form>

      <div class="text-sm text-center text-gray-600 pt-4">
        Already have an account?
        <a href="/auth/login" class="text-blue-600 hover:underline font-medium">
          Login
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "~/composables/useAuth";

const form = reactive({
  name: "",
  email: "",
  password: "",
});

const { setUser } = useAuth();

const error = ref("");
const router = useRouter();

async function handleRegister() {
  if (!form.name || !form.email || !form.password) {
    error.value = "Please fill all fields";
    return;
  }

  error.value = "";

  try {
    const res = await $fetch(
      "https://product-hunt-api.onrender.com/api/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      }
    );

    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user));
    setUser(res.user);
    alert(`Welcome ${res.user.name}!`);
    router.push("/auth/login");
  } catch (err: any) {
    error.value = err?.data?.message || "Registration failed. Try again.";
  }
}
</script>
