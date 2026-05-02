<script setup lang="ts">
import { ref, onMounted, watch, inject } from 'vue';
import { useRoute } from 'vue-router';
import { apiService, type Product } from '../services/api';
import ProductCard from '../components/ProductCard.vue';
import LoadingSkeleton from '../components/LoadingSkeleton.vue';

const route = useRoute();
const products = ref<Product[]>([]);
const isLoading = ref(true);

const triggerToast = inject<((msg: string) => void)>('triggerToast');

async function searchProducts(query: string) {
  isLoading.value = true;
  try {
    const data = await apiService.searchProducts(query);
    products.value = data.products;
  } catch (error) {
    console.error('Error searching products', error);
  } finally {
    isLoading.value = false;
  }
}

function handleAddedToCart(product: Product) {
  if (triggerToast) {
    triggerToast(`${product.title} added to cart`);
  }
}

onMounted(() => {
  const query = route.query.q as string;
  if (query) {
    searchProducts(query);
  } else {
    isLoading.value = false;
  }
});

watch(
  () => route.query.q,
  (newQuery) => {
    if (newQuery) {
      searchProducts(newQuery as string);
    } else {
      products.value = [];
    }
  }
);
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Search Results for "{{ route.query.q }}"
      </h1>
      <p class="text-gray-500 dark:text-gray-400 mt-2" v-if="!isLoading">
        Found {{ products.length }} items
      </p>
    </div>

    <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <LoadingSkeleton v-for="i in 8" :key="i" />
    </div>

    <div v-else-if="products.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <ProductCard 
        v-for="product in products" 
        :key="product.id" 
        :product="product" 
        @added-to-cart="handleAddedToCart"
      />
    </div>

    <div v-else class="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 mt-8">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">No results found for "{{ route.query.q }}"</h3>
      <p class="text-gray-500 dark:text-gray-400 mt-2">Try checking your spelling or using more general terms.</p>
    </div>
  </div>
</template>
