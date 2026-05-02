<script setup lang="ts">
import { ref, onMounted, computed, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { apiService, type Product } from '../services/api';
import { useCartStore } from '../stores/cart';
import { ArrowLeft, Star, ShoppingCart, Truck, ShieldCheck, RefreshCw } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();

const product = ref<Product | null>(null);
const isLoading = ref(true);
const activeImageIndex = ref(0);

const triggerToast = inject<((msg: string) => void)>('triggerToast');

const discountedPrice = computed(() => {
  if (!product.value) return 0;
  return product.value.price - (product.value.price * product.value.discountPercentage / 100);
});

async function loadProduct() {
  const id = route.params.id as string;
  try {
    product.value = await apiService.getProductById(id);
  } catch (error) {
    console.error('Error loading product details', error);
  } finally {
    isLoading.value = false;
  }
}

function addToCart() {
  if (product.value) {
    cartStore.addItem(product.value);
    if (triggerToast) {
      triggerToast(`${product.value.title} added to cart`);
    }
  }
}

onMounted(() => {
  loadProduct();
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <button 
      @click="router.back()"
      class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 mb-6 transition-colors"
    >
      <ArrowLeft class="w-4 h-4 mr-1" /> Back
    </button>

    <div v-if="isLoading" class="animate-pulse flex flex-col md:flex-row gap-10">
      <div class="w-full md:w-1/2 lg:w-3/5 h-96 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
      <div class="w-full md:w-1/2 lg:w-2/5 space-y-4">
        <div class="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
        <div class="h-20 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
        <div class="h-10 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
        <div class="h-12 bg-gray-200 dark:bg-gray-800 rounded w-full mt-6"></div>
      </div>
    </div>

    <div v-else-if="product" class="flex flex-col md:flex-row gap-10 lg:gap-16">
      
      <!-- Image Gallery -->
      <div class="w-full md:w-1/2 lg:w-3/5">
        <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 mb-4 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center h-96 sm:h-[32rem]">
          <img 
            :src="product.images[activeImageIndex]" 
            :alt="product.title"
            class="max-h-full object-contain drop-shadow-md"
          />
        </div>
        
        <div class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            v-for="(img, index) in product.images" 
            :key="index"
            @click="activeImageIndex = index"
            :class="[
              'w-20 h-20 flex-shrink-0 bg-white dark:bg-gray-800 rounded-xl border-2 p-2 transition-all',
              activeImageIndex === index ? 'border-indigo-600 dark:border-indigo-400 shadow-md' : 'border-gray-100 dark:border-gray-700 opacity-70 hover:opacity-100'
            ]"
          >
            <img :src="img" class="w-full h-full object-cover rounded-lg" />
          </button>
        </div>
      </div>

      <!-- Details -->
      <div class="w-full md:w-1/2 lg:w-2/5 flex flex-col">
        <div class="mb-6">
          <p class="text-sm font-medium text-indigo-600 dark:text-indigo-400 tracking-wide uppercase mb-2">{{ product.brand }}</p>
          <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
            {{ product.title }}
          </h1>
          
          <div class="flex items-center space-x-4 mb-4">
            <div class="flex items-center">
              <Star class="w-5 h-5 text-amber-400 fill-amber-400 mr-1" />
              <span class="font-medium text-gray-900 dark:text-gray-300">{{ product.rating }}</span>
            </div>
            <span class="text-gray-300 dark:text-gray-600">|</span>
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize">{{ product.category }}</span>
          </div>

          <div class="flex items-end mb-6">
            <span class="text-4xl font-bold text-gray-900 dark:text-white">${{ discountedPrice.toFixed(2) }}</span>
            <div v-if="product.discountPercentage > 0" class="ml-4 flex flex-col pb-1">
              <span class="text-lg text-gray-400 dark:text-gray-500 line-through">${{ product.price.toFixed(2) }}</span>
              <span class="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded uppercase">
                Save {{ Math.round(product.discountPercentage) }}%
              </span>
            </div>
          </div>

          <p class="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
            {{ product.description }}
          </p>
        </div>

        <div class="mt-auto space-y-6">
          
          <div class="flex items-center justify-between py-4 border-y border-gray-100 dark:border-gray-800">
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Availability</span>
            <span :class="['text-sm font-bold', product.stock > 0 ? 'text-emerald-600' : 'text-red-500']">
              {{ product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock' }}
            </span>
          </div>

          <button 
            @click="addToCart"
            :disabled="product.stock === 0"
            class="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/30"
          >
            <ShoppingCart class="w-6 h-6" />
            <span>Add to Cart</span>
          </button>

          <!-- Perks -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
            <div class="flex flex-col items-center text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
              <Truck class="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-2" />
              <span class="text-xs font-medium text-gray-900 dark:text-white">Free Shipping</span>
            </div>
            <div class="flex flex-col items-center text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
              <RefreshCw class="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-2" />
              <span class="text-xs font-medium text-gray-900 dark:text-white">30 Days Return</span>
            </div>
            <div class="flex flex-col items-center text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
              <ShieldCheck class="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-2" />
              <span class="text-xs font-medium text-gray-900 dark:text-white">Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-20">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Product not found</h2>
      <p class="text-gray-500 dark:text-gray-400 mt-2">The product you're looking for doesn't exist or has been removed.</p>
    </div>
  </div>
</template>
