<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { ShoppingCart, Search, Store, Sun, Moon } from 'lucide-vue-next';

const router = useRouter();
const cartStore = useCartStore();

const searchQuery = ref('');

const totalCartItems = computed(() => cartStore.totalItems);

const isDark = ref(false);

onMounted(() => {
  // Check local storage or system preference
  if (localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true;
    document.documentElement.classList.add('dark');
  } else {
    isDark.value = false;
    document.documentElement.classList.remove('dark');
  }
});

function toggleTheme() {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
}

function onSearch() {
  if (searchQuery.value.trim()) {
    router.push({ name: 'search', query: { q: searchQuery.value.trim() } });
    searchQuery.value = ''; // Optional: clear after search
  }
}
</script>

<template>
  <nav class="bg-white/40 dark:bg-gray-900/40 backdrop-blur-lg sticky top-0 z-50 border-b border-white/20 dark:border-gray-800/50 shadow-[0_4px_30px_rgba(0,0,0,0.1)] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        
        <!-- Logo -->
        <div class="flex-shrink-0 flex items-center cursor-pointer" @click="router.push('/')">
          <Store class="h-8 w-8 text-indigo-600 dark:text-indigo-400 mr-2" />
          <span class="font-bold text-xl tracking-tight text-gray-900 dark:text-white hidden sm:block">Shopify</span>
        </div>

        <!-- Search Bar -->
        <div class="flex-1 max-w-lg mx-4">
          <form @submit.prevent="onSearch" class="relative group">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search class="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors" />
            </div>
            <input
              v-model="searchQuery"
              type="text"
              class="block w-full pl-10 pr-3 py-2 border border-white/30 dark:border-gray-700/50 rounded-full leading-5 bg-white/20 dark:bg-gray-800/30 backdrop-blur-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:bg-white/40 dark:focus:bg-gray-800/50 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 sm:text-sm shadow-inner transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-white/30 dark:hover:bg-gray-800/40 hover:shadow-[0_0_15px_rgba(79,70,229,0.1)]"
              placeholder="Search for products..."
            />
          </form>
        </div>

        <!-- Actions -->
        <div class="flex items-center space-x-2">
          
          <!-- Theme Toggle -->
          <button 
            @click="toggleTheme"
            class="p-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 bg-white/20 dark:bg-gray-800/30 hover:bg-white/40 dark:hover:bg-gray-800/50 backdrop-blur-md border border-white/30 dark:border-gray-700/30 shadow-sm hover:shadow-[0_0_15px_rgba(79,70,229,0.2)] rounded-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            title="Toggle theme"
          >
            <Sun v-if="isDark" class="h-5 w-5" />
            <Moon v-else class="h-5 w-5" />
          </button>

          <!-- Cart Icon -->
          <button 
            @click="router.push('/cart')"
            class="relative p-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 bg-white/20 dark:bg-gray-800/30 hover:bg-white/40 dark:hover:bg-gray-800/50 backdrop-blur-md border border-white/30 dark:border-gray-700/30 shadow-sm hover:shadow-[0_0_15px_rgba(79,70,229,0.2)] rounded-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            <span class="sr-only">View cart</span>
            <ShoppingCart class="h-6 w-6" />
            
            <!-- Badge -->
            <span 
              v-if="totalCartItems > 0"
              class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full animate-bounce-short"
            >
              {{ totalCartItems }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.animate-bounce-short {
  animation: bounce 0.5s ease-in-out 2;
}
</style>
