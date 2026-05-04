<template>
  <div class="bg-indigo-600 rounded-3xl overflow-hidden mb-10 shadow-lg relative flex flex-col lg:flex-row items-stretch min-h-[400px]">
    <!-- Background Gradient -->
    <div class="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 mix-blend-multiply pointer-events-none"></div>
    
    <!-- Left Text Area -->
    <div class="relative px-8 py-12 lg:py-24 lg:w-1/2 flex flex-col items-start justify-center text-left z-10">
      <h1 class="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
        Discover Our <br/> <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-400">Latest Collection</span>
      </h1>
      <p class="text-indigo-100 max-w-lg text-lg mb-8">
        Upgrade your lifestyle with premium products curated just for you. Free shipping on all orders over $50.
      </p>
      <button class="bg-white text-indigo-600 px-8 py-3 rounded-full font-bold shadow-md hover:bg-gray-50 hover:shadow-lg transition-all duration-300">
        Shop Now
      </button>
    </div>

    <!-- Right Slider Area -->
    <div class="relative px-8 pb-12 lg:py-12 lg:w-1/2 flex items-center justify-center z-10">
      
      <!-- Skeleton/Loading state if no products -->
      <div v-if="featuredProducts.length === 0" class="w-full max-w-sm h-80 bg-white/10 backdrop-blur-md rounded-2xl animate-pulse flex items-center justify-center">
        <span class="text-white/50 font-medium">Loading collection...</span>
      </div>

      <div class="w-full max-w-sm relative" v-else>
        <!-- Slider Container -->
        <div class="overflow-hidden rounded-2xl shadow-2xl bg-white dark:bg-gray-800 relative group">
          
          <!-- Slides -->
          <div 
            class="flex transition-transform duration-500 ease-out" 
            :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
          >
            <div 
              v-for="product in featuredProducts" 
              :key="product.id" 
              class="w-full flex-shrink-0 cursor-pointer"
              @click="$router.push(`/product/${product.id}`)"
            >
              <div class="relative pt-[80%] sm:pt-[100%] bg-gray-50 dark:bg-gray-700/50">
                <img :src="product.thumbnail" :alt="product.title" class="absolute inset-0 w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500" />
                <!-- Discount Badge -->
                <div v-if="product.discountPercentage > 0" class="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md z-10">
                  -{{ Math.round(product.discountPercentage) }}%
                </div>
              </div>
              <div class="p-6 relative bg-white dark:bg-gray-800">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white line-clamp-1 mb-2">{{ product.title }}</h3>
                <div class="flex items-center space-x-3">
                  <span class="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    ${{ (product.price - (product.price * product.discountPercentage / 100)).toFixed(2) }}
                  </span>
                  <span v-if="product.discountPercentage > 0" class="text-sm text-gray-400 dark:text-gray-500 line-through">
                    ${{ product.price.toFixed(2) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Navigation Arrows -->
          <button @click.stop="prev" class="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-900/90 p-2 rounded-full text-gray-800 dark:text-white hover:bg-white dark:hover:bg-gray-900 shadow-lg transition-all opacity-0 -translate-x-4 group-hover:translate-x-0 group-hover:opacity-100 focus:opacity-100 z-20">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <button @click.stop="next" class="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-900/90 p-2 rounded-full text-gray-800 dark:text-white hover:bg-white dark:hover:bg-gray-900 shadow-lg transition-all opacity-0 translate-x-4 group-hover:translate-x-0 group-hover:opacity-100 focus:opacity-100 z-20">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>

        <!-- Navigation Dots -->
        <div class="flex justify-center space-x-2 mt-6">
          <button 
            v-for="(_, index) in featuredProducts" 
            :key="index"
            @click="currentIndex = index"
            class="w-2.5 h-2.5 rounded-full transition-all duration-300"
            :class="currentIndex === index ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/70'"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { Product } from '../services/api';

const props = defineProps<{
  products: Product[];
}>();

// Only pick 5 products for the slider
const featuredProducts = computed(() => {
  return props.products.slice(0, 5);
});

const currentIndex = ref(0);
let intervalId: ReturnType<typeof setInterval> | null = null;

function next() {
  if (featuredProducts.value.length === 0) return;
  currentIndex.value = (currentIndex.value + 1) % featuredProducts.value.length;
  resetAutoSlide();
}

function prev() {
  if (featuredProducts.value.length === 0) return;
  currentIndex.value = (currentIndex.value - 1 + featuredProducts.value.length) % featuredProducts.value.length;
  resetAutoSlide();
}

function startAutoSlide() {
  intervalId = setInterval(() => {
    if (featuredProducts.value.length > 0) {
      currentIndex.value = (currentIndex.value + 1) % featuredProducts.value.length;
    }
  }, 5000);
}

function resetAutoSlide() {
  if (intervalId) {
    clearInterval(intervalId);
    startAutoSlide();
  }
}

onMounted(() => {
  startAutoSlide();
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>
