<script setup lang="ts">
import { ref, onMounted, inject } from 'vue';
import { apiService, type Product } from '../services/api';
import ProductCard from '../components/ProductCard.vue';
import LoadingSkeleton from '../components/LoadingSkeleton.vue';

const products = ref<Product[]>([]);
const categories = ref<string[]>([]);
const activeCategory = ref<string>('');
const isLoading = ref(true);

const triggerToast = inject<((msg: string) => void)>('triggerToast');

async function fetchCategories() {
  try {
    categories.value = await apiService.getCategories();
  } catch (error) {
    console.error('Failed to load categories', error);
  }
}

async function fetchProducts() {
  isLoading.value = true;
  try {
    if (activeCategory.value) {
      const data = await apiService.getProductsByCategory(activeCategory.value);
      products.value = data.products;
    } else {
      const data = await apiService.getProducts(30);
      products.value = data.products;
    }
  } catch (error) {
    console.error('Failed to fetch products', error);
  } finally {
    isLoading.value = false;
  }
}

function filterByCategory(category: string) {
  activeCategory.value = category === activeCategory.value ? '' : category;
  fetchProducts();
}

function handleAddedToCart(product: Product) {
  if (triggerToast) {
    triggerToast(`${product.title} added to cart`);
  }
}

onMounted(() => {
  fetchCategories();
  fetchProducts();
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    
    <!-- Hero Banner -->
    <div class="bg-indigo-600 rounded-3xl overflow-hidden mb-10 shadow-lg relative">
      <div class="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 mix-blend-multiply"></div>
      <div class="relative px-8 py-16 sm:px-16 sm:py-24 lg:py-32 flex flex-col items-start justify-center text-left">
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4">
          Discover Our <br/> <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-400">Latest Collection</span>
        </h1>
        <p class="text-indigo-100 max-w-2xl text-lg sm:text-xl mb-8">
          Upgrade your lifestyle with premium products curated just for you. Free shipping on all orders over $50.
        </p>
        <button class="bg-white text-indigo-600 px-8 py-3 rounded-full font-bold shadow-md hover:bg-gray-50 hover:shadow-lg transition-all duration-300">
          Shop Now
        </button>
      </div>
    </div>

    <div class="flex flex-col lg:flex-row gap-8">
      
      <!-- Sidebar / Categories -->
      <aside class="w-full lg:w-64 flex-shrink-0">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 sticky top-24 transition-colors duration-300">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Categories</h2>
          <div class="flex flex-wrap lg:flex-col gap-2">
            <button 
              @click="filterByCategory('')"
              :class="['text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors', 
                activeCategory === '' ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              ]"
            >
              All Products
            </button>
            <button 
              v-for="category in categories" 
              :key="category"
              @click="filterByCategory(category)"
              :class="['text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize', 
                activeCategory === category ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              ]"
            >
              {{ category.replace('-', ' ') }}
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content / Products Grid -->
      <div class="flex-1">
        <div class="flex justify-between items-end mb-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white capitalize">
            {{ activeCategory ? activeCategory.replace('-', ' ') : 'All Products' }}
          </h2>
          <span class="text-sm text-gray-500 dark:text-gray-400" v-if="!isLoading">{{ products.length }} items</span>
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
        
        <div v-else class="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">No products found.</h3>
          <p class="text-gray-500 dark:text-gray-400 mt-2">Try selecting a different category.</p>
        </div>
      </div>
    </div>
  </div>
</template>
