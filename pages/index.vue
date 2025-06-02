<template>
  <div
    class="min-h-screen bg-gradient-to-b from-white to-blue-50 p-0 md:py-12 md:px-4 flex flex-col items-center"
  >
    <header class="w-full max-w-4xl text-center mb-12 px-4">
      <h1
        class="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent mb-4"
      >
        Discover Products on <span class="italic">Kulp.AI Hunt</span>
      </h1>
      <p class="text-gray-600 max-w-xl mx-auto text-base sm:text-lg italic">
        Find, share, and upvote the latest innovations powering the future.
      </p>
    </header>

    <div class="mb-6 flex justify-center gap-4">
      <button
        :class="
          sortBy === 'trending'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700'
        "
        class="px-4 py-2 font-semibold rounded-full shadow-lg transition duration-300 ease-in-out"
        @click="updateState({ sort: 'trending' })"
      >
        Trending
      </button>
      <button
        :class="
          sortBy === 'newest'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700'
        "
        class="px-4 py-2 font-semibold rounded-full shadow-lg transition duration-300 ease-in-out"
        @click="updateState({ sort: 'newest' })"
      >
        Newest
      </button>
    </div>

    <div class="category-container mb-8 px-4 max-w-6xl mx-auto">
      <div class="flex space-x-4 overflow-x-auto no-scrollbar py-2" role="list">
        <button
          v-for="cat in ['All', ...categories]"
          :key="cat"
          @click="updateState({ category: cat === 'All' ? '' : cat })"
          :class="[
            'whitespace-nowrap px-5 py-2 rounded-full font-semibold cursor-pointer select-none',
            selectedCategory === (cat === 'All' ? '' : cat)
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
          ]"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <main
      class="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 px-2 md:px-4"
    >
      <article
        v-for="product in featuredProducts"
        :key="product._id"
        class="bg-white/70 backdrop-blur rounded-xl p-4 shadow-lg hover:shadow-2xl transition-all flex flex-col sm:flex-row items-start gap-4"
      >
        <img
          :src="product.image"
          :alt="product.name"
          class="w-full sm:w-24 h-24 rounded-lg object-cover border border-gray-200"
          loading="lazy"
        />
        <div class="flex flex-col flex-grow">
          <div class="flex items-center justify-between mb-1">
            <h2 class="text-lg font-semibold text-gray-900">
              {{ product.name }}
            </h2>
            <span
              v-if="product.category"
              class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
            >
              {{ product.category }}
            </span>
          </div>
          <p class="text-sm text-gray-500 italic">{{ product.tagline }}</p>
          <div class="mt-4 flex items-center justify-between">
            <NuxtLink
              :to="`/products/${product._id}`"
              class="text-sm text-blue-600 hover:underline font-medium"
            >
              Visit →
            </NuxtLink>
            <div class="flex items-center gap-2">
              <span class="text-sm bg-blue-50 text-blue-800 px-2 py-1 rounded">
                ⭐ {{ product.upvotes.length }} votes
              </span>
              <button
                @click="upvote(product._id)"
                class="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:scale-105 text-white transition shadow-md"
              >
                <Icon name="uil:arrow-up" class="text-white" size="22" />
              </button>
            </div>
          </div>
        </div>
      </article>
    </main>

    <div v-if="loading" class="mt-8 flex justify-center">
      <div
        class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const featuredProducts = ref([]);
const categories = ref([]);
const page = ref(1);
const totalPages = ref(1);
const sortBy = ref("trending");
const selectedCategory = ref("");
const loading = ref(false);
const allLoaded = ref(false);
const limit = 4;

const fetchCategories = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/products/categories");
    const data = await res.json();
    categories.value = data.categories || [];
  } catch (err) {
    console.error("Failed to fetch categories", err);
  }
};

const fetchProducts = async () => {
  if (loading.value || allLoaded.value) return;
  loading.value = true;
  try {
    const cat = selectedCategory.value
      ? `&category=${selectedCategory.value}`
      : "";
    const res = await fetch(
      `http://localhost:5000/api/products?page=${page.value}&limit=${limit}&sortBy=${sortBy.value}${cat}`
    );
    const data = await res.json();
    if (data?.products?.length) {
      featuredProducts.value.push(...data.products);
      page.value++;
      totalPages.value = data.totalPages;
      if (page.value > data.totalPages) allLoaded.value = true;
    } else {
      allLoaded.value = true;
    }
  } catch (err) {
    console.error("Error fetching products:", err);
  } finally {
    loading.value = false;
  }
};

const updateState = ({ sort, category }) => {
  const shouldUpdateSort = sort && sortBy.value !== sort;
  const shouldUpdateCategory =
    category !== undefined && selectedCategory.value !== category;
  if (!shouldUpdateSort && !shouldUpdateCategory) return;

  if (sort) sortBy.value = sort;
  if (category !== undefined) selectedCategory.value = category;

  page.value = 1;
  totalPages.value = 1;
  featuredProducts.value = [];
  allLoaded.value = false;
  fetchProducts();
};

const handleScroll = () => {
  const nearBottom =
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;
  if (nearBottom) fetchProducts();
};

const upvote = async (productId) => {
  const token = localStorage.getItem("token");
  if (!token) return alert("⚠️ You must be logged in to upvote.");
  try {
    const res = await fetch(
      `http://localhost:5000/api/products/${productId}/upvote`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    if (res.ok) {
      alert(`👍 Upvoted successfully! Total Upvotes: ${data.upvotesCount}`);
      updateState({});
    } else {
      alert(`❌ Upvote failed: ${data.message || "Unknown error"}`);
    }
  } catch (err) {
    console.error("Upvote error:", err);
    alert("❌ Something went wrong while upvoting.");
  }
};

onMounted(() => {
  fetchCategories();
  fetchProducts();
  window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
