<template>
  <div class="relative w-full overflow-hidden bg-black/80 backdrop-blur-sm py-6 shadow-2xl border-b border-gray-800/50">
    <!-- Gradient overlays for smooth fade effect -->
    <div class="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
    <div class="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>
    
    <div class="flex marquee-content w-max hover:[animation-play-state:paused]">
      <!-- We duplicate the list to create an infinite scroll effect -->
      <template v-for="n in 2" :key="n">
        <div 
          v-for="product in displayProducts" 
          :key="product.id + '-' + n" 
          class="flex items-center space-x-4 bg-gray-900/40 backdrop-blur-md rounded-2xl p-3 w-72 mx-3 flex-shrink-0 cursor-pointer group hover:bg-gray-800/60 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] border border-gray-800/50 hover:border-gray-600/50 shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgba(255,255,255,0.05)]"
          @click="$router.push(`/product/${product.id}`)"
        >
          <div class="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
            <img :src="product.thumbnail" :alt="product.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-colors duration-300"></div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-base font-bold text-white truncate">{{ product.title }}</p>
            <p class="text-sm text-indigo-400 font-semibold mt-1">${{ product.price }}</p>
            <div class="flex items-center mt-1">
              <svg class="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <span class="text-xs text-gray-400 ml-1">{{ product.rating }}</span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { apiService, type Product } from '../services/api';

const displayProducts = ref<Product[]>([]);

onMounted(async () => {
  try {
    // Fetch some top products for the slider
    const data = await apiService.getProducts(12);
    displayProducts.value = data.products;
  } catch (error) {
    console.error('Failed to load marquee products', error);
  }
});
</script>

<style scoped>
.marquee-content {
  animation: marquee 30s linear infinite;
}

@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); } /* Shift by exactly half since we duplicated the list */
}
</style>
