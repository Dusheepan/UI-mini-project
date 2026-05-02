<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Toast from './components/Toast.vue'
import { ref, provide } from 'vue';

const showToast = ref(false);
const toastMessage = ref('');

let timeoutId: ReturnType<typeof setTimeout> | null = null;

function triggerToast(message: string) {
  toastMessage.value = message;
  showToast.value = true;
  
  if (timeoutId) clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    showToast.value = false;
  }, 3000);
}

// Provide the toast trigger method globally
provide('triggerToast', triggerToast);
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300">
    <Navbar />
    
    <main class="flex-grow">
      <RouterView />
    </main>

    <footer class="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto py-8 transition-colors duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 dark:text-gray-400 text-sm">
        &copy; {{ new Date().getFullYear() }} ModernStore. All rights reserved.
      </div>
    </footer>

    <Toast :show="showToast" :message="toastMessage" />
  </div>
</template>
