<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import type { Product } from '../services/api';
import { useCartStore } from '../stores/cart';
import { ShoppingCart, Star } from 'lucide-vue-next';

const props = defineProps<{
  product: Product;
}>();

const emit = defineEmits(['added-to-cart']);

const router = useRouter();
const cartStore = useCartStore();

const discountedPrice = computed(() => {
  return props.product.price - (props.product.price * props.product.discountPercentage / 100);
});

function goToDetails() {
  router.push(`/product/${props.product.id}`);
}

function addToCart(event: Event) {
  event.stopPropagation();
  cartStore.addItem(props.product);
  emit('added-to-cart', props.product);
}
</script>

<template>
  <div 
    @click="goToDetails"
    class="group bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.05)] border border-white/50 dark:border-gray-700/50 overflow-hidden hover:shadow-[0_8px_30px_rgba(79,70,229,0.15)] dark:hover:shadow-[0_8px_30px_rgba(79,70,229,0.2)] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer flex flex-col h-full transform hover:-translate-y-2 hover:bg-white/90 dark:hover:bg-gray-800/90"
  >
    <!-- Image Container -->
    <div class="relative pt-[100%] bg-gray-50 dark:bg-gray-700/50 overflow-hidden">
      <img 
        :src="product.thumbnail" 
        :alt="product.title"
        class="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
        loading="lazy"
      />
      <!-- Discount Badge -->
      <div 
        v-if="product.discountPercentage > 0"
        class="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-sm"
      >
        -{{ Math.round(product.discountPercentage) }}%
      </div>
    </div>

    <!-- Content -->
    <div class="p-5 flex flex-col flex-grow">
      <div class="flex justify-between items-start mb-2">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {{ product.title }}
        </h3>
      </div>
      
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
        {{ product.description }}
      </p>

      <div class="flex items-center space-x-1 mb-auto">
        <Star class="w-4 h-4 text-amber-400 fill-amber-400" />
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ product.rating }}</span>
      </div>

      <!-- Footer/Price/Action -->
      <div class="mt-4 flex items-center justify-between">
        <div>
          <span class="text-xl font-bold text-gray-900 dark:text-white">${{ discountedPrice.toFixed(2) }}</span>
          <span v-if="product.discountPercentage > 0" class="ml-2 text-sm text-gray-400 dark:text-gray-500 line-through">
            ${{ product.price.toFixed(2) }}
          </span>
        </div>
        
        <button 
          @click="addToCart"
          class="p-2.5 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500 hover:text-white backdrop-blur-md border border-indigo-500/20 hover:border-indigo-400 shadow-sm hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500/50 dark:focus:ring-offset-gray-800"
          title="Add to cart"
        >
          <ShoppingCart class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>
