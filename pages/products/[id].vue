<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
    <section v-if="product" class="space-y-6">
      <div class="space-y-1">
        <h1 class="text-3xl sm:text-5xl font-bold text-gray-900">
          {{ product.name }}
        </h1>
        <p class="text-lg text-gray-500 italic mt-0">
          {{ product.tagline }}
        </p>
      </div>

      <img
        :src="product.image"
        alt="product image"
        class="w-full rounded-xl shadow-lg object-cover max-h-[500px]"
      />

      <p class="text-gray-800 text-lg leading-relaxed">
        {{ product.description }}
      </p>

      <div class="flex flex-wrap justify-between items-center gap-4 mt-6">
        <span
          class="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium"
        >
          {{ product.category }}
        </span>

        <a
          :href="product.url"
          target="_blank"
          class="inline-flex items-center text-blue-600 font-semibold hover:underline"
        >
          Know More
          <svg
            class="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </a>
      </div>
    </section>

    <section class="px-4 py-6 border-b border-gray-200">
      <div class="flex items-center gap-3 mb-4">
        <div
          class="w-10 h-10 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold"
        >
          U
        </div>
        <h2 class="text-lg font-semibold text-gray-800">Leave a Comment</h2>
      </div>

      <textarea
        v-model="newComment"
        rows="3"
        placeholder="Share your thoughts..."
        class="w-full text-sm p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none text-gray-800 placeholder:text-gray-400"
      ></textarea>

      <div class="flex justify-end mt-2">
        <button
          @click="submitComment"
          class="px-6 py-2 font-semibold text-white rounded-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg transition duration-300 ease-in-out"
        >
          ✨ Post Comment
        </button>
      </div>
    </section>

    <section v-if="comments.length" class="space-y-2">
      <h2 class="text-lg font-semibold text-gray-900">💬 Comments</h2>

      <div class="space-y-2">
        <div
          v-for="comment in comments"
          :key="comment._id"
          class="bg-white border border-gray-200 rounded-lg p-3 shadow-sm"
        >
          <div class="flex justify-between items-center mb-2">
            <div class="font-semibold text-gray-800">
              {{ comment.userId.name }}
            </div>
            <div class="text-sm text-gray-400">
              {{ formatDate(comment.createdAt) }}
            </div>
          </div>
          <p class="text-gray-700 mb-3">{{ comment.content }}</p>

          <div
            v-if="comment.replies?.length"
            class="pl-4 border-l-2 border-blue-200 space-y-3 mt-3"
          >
            <div
              v-for="reply in comment.replies"
              :key="reply._id"
              class="bg-blue-50 px-3 py-1 rounded"
            >
              <div
                class="flex justify-between text-sm text-blue-700 font-medium mb-1"
              >
                <span>{{ reply.userId?.name || "User" }}</span>
                <span class="text-xs text-blue-500">{{
                  formatDate(reply.createdAt)
                }}</span>
              </div>
              <p class="text-blue-900 text-sm">{{ reply.content }}</p>
            </div>
          </div>

          <div class="mt-4">
            <textarea
              v-model="replyInputs[comment._id]"
              rows="1"
              placeholder="Write a reply..."
              class="w-full p-2 text-sm border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            ></textarea>
            <button
              @click="submitReply(comment._id)"
              class="mt-2 px-6 py-2 font-semibold text-white rounded-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg transition duration-300 ease-in-out"
            >
              Reply
            </button>
          </div>
        </div>
      </div>
    </section>

    <div v-if="!product" class="text-center text-gray-400 text-lg">
      Loading product details...
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, reactive, onMounted } from "vue";

const route = useRoute();
const product = ref(null);
const comments = ref([]);
const newComment = ref("");
const replyInputs = reactive({});
const token = localStorage.getItem("token");
const isAuthenticated = ref(!!token);

const fetchData = async () => {
  try {
    const [productRes, commentsRes] = await Promise.all([
      fetch(
        `https://product-hunt-api.onrender.com/api/products/${route.params.id}`
      ),
      fetch(
        `https://product-hunt-api.onrender.com/api/products/${route.params.id}/comments`
      ),
    ]);
    product.value = await productRes.json();
    comments.value = await commentsRes.json();
  } catch (error) {
    console.error("Error loading product or comments:", error);
  }
};

onMounted(fetchData);

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const submitComment = async () => {
  if (!newComment.value.trim() || !isAuthenticated.value) return;
  try {
    const res = await fetch(
      `https://product-hunt-api.onrender.com/api/products/${route.params.id}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComment.value }),
      }
    );
    if (res.ok) {
      newComment.value = "";
      fetchData();
    }
  } catch (error) {
    console.error("Failed to post comment:", error);
  }
};

const submitReply = async (commentId) => {
  const replyText = replyInputs[commentId];
  if (!replyText?.trim() || !isAuthenticated.value) return;

  try {
    const res = await fetch(
      `https://product-hunt-api.onrender.com/api/products/reply/${commentId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: replyText }),
      }
    );
    if (res.ok) {
      replyInputs[commentId] = "";
      fetchData();
    }
  } catch (error) {
    console.error("Failed to post reply:", error);
  }
};
</script>
