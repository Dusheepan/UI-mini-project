<script setup lang="ts">
import { computed } from 'vue';
import type { CartItem } from '../stores/cart';
import { useCartStore } from '../stores/cart';
import { Minus, Plus, Trash2 } from 'lucide-vue-next';

const props = defineProps<{
  item: CartItem;
}>();

const cartStore = useCartStore();

const discountedPrice = computed(() => {
  return props.item.price - (props.item.price * props.item.discountPercentage / 100);
});

const itemTotal = computed(() => {
  return discountedPrice.value * props.item.quantity;
});

function increaseQuantity() {
  cartStore.updateQuantity(props.item.id, props.item.quantity + 1);
}

function decreaseQuantity() {
  cartStore.updateQuantity(props.item.id, props.item.quantity - 1);
}

function remove() {
  cartStore.removeItem(props.item.id);
}
</script>

<template>
  <div class="flex flex-col sm:flex-row items-center py-6 border-b border-gray-100 dark:border-gray-800 last:border-0 gap-4 sm:gap-6">
    <!-- Image -->
    <div class="w-full sm:w-24 h-24 flex-shrink-0 bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-md rounded-xl overflow-hidden border border-gray-100/50 dark:border-gray-700/50 relative shadow-inner">
      <img 
        :src="item.thumbnail" 
        :alt="item.title"
        class="absolute inset-0 w-full h-full object-contain p-2"
      />
    </div>

    <!-- Info -->
    <div class="flex-1 min-w-0 text-center sm:text-left">
      <h4 class="text-lg font-medium text-gray-900 dark:text-white truncate">{{ item.title }}</h4>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ item.brand }} | {{ item.category }}</p>
      <div class="mt-2 font-semibold text-gray-900 dark:text-white sm:hidden">
        ${{ itemTotal.toFixed(2) }}
      </div>
    </div>

    <!-- Controls -->
    <div class="flex items-center space-x-3">
      <button 
        @click="decreaseQuantity"
        class="p-1.5 rounded-md border border-gray-200/50 dark:border-gray-700/50 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm text-gray-500 dark:text-gray-400 hover:bg-white/60 dark:hover:bg-gray-800/60 hover:text-gray-700 dark:hover:text-gray-200 hover:shadow-sm transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
      >
        <Minus class="w-4 h-4" />
      </button>
      
      <span class="w-8 text-center font-medium text-gray-900 dark:text-white">{{ item.quantity }}</span>
      
      <button 
        @click="increaseQuantity"
        class="p-1.5 rounded-md border border-gray-200/50 dark:border-gray-700/50 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm text-gray-500 dark:text-gray-400 hover:bg-white/60 dark:hover:bg-gray-800/60 hover:text-gray-700 dark:hover:text-gray-200 hover:shadow-sm transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
      >
        <Plus class="w-4 h-4" />
      </button>
    </div>

    <!-- Price (Desktop) -->
    <div class="hidden sm:block w-24 text-right font-semibold text-gray-900 dark:text-white">
      ${{ itemTotal.toFixed(2) }}
    </div>

    <!-- Remove -->
    <button 
      @click="remove"
      class="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 bg-transparent hover:bg-red-500/10 dark:hover:bg-red-900/20 backdrop-blur-sm rounded-full transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-110 active:scale-95 hover:shadow-[0_0_10px_rgba(239,68,68,0.2)] focus:outline-none focus:ring-2 focus:ring-red-500/50"
      title="Remove item"
    >
      <Trash2 class="w-5 h-5" />
    </button>
  </div>
</template>
