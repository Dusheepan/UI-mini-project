<script setup lang="ts">
import { CheckCircle } from 'lucide-vue-next';

defineProps<{
  show: boolean;
  message: string;
}>();
</script>

<template>
  <Transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="show" class="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center p-4 bg-gray-900 text-white rounded-xl shadow-2xl max-w-sm w-full sm:w-auto">
      <CheckCircle class="w-5 h-5 text-emerald-400 mr-3 flex-shrink-0" />
      <span class="font-medium">{{ message }}</span>
    </div>
  </Transition>
</template>
