<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';
import CartItemComponent from '../components/CartItem.vue';
import { ArrowRight, ShoppingBag } from 'lucide-vue-next';

const router = useRouter();
const cartStore = useCartStore();

const cartItems = computed(() => cartStore.items);
const totalItems = computed(() => cartStore.totalItems);
const subtotal = computed(() => {
  return cartItems.value.reduce((total, item) => {
    const discountedPrice = item.price - (item.price * item.discountPercentage / 100);
    return total + (discountedPrice * item.quantity);
  }, 0);
});

const shipping = computed(() => subtotal.value > 0 && subtotal.value < 50 ? 10 : 0);
const tax = computed(() => subtotal.value * 0.08); // 8% mock tax
const grandTotal = computed(() => subtotal.value + shipping.value + tax.value);

function checkout() {
  alert('Checkout functionality is mocked for this demo!');
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Shopping Cart</h1>

    <div v-if="cartItems.length > 0" class="flex flex-col lg:flex-row gap-10">
      
      <!-- Cart Items List -->
      <div class="lg:w-2/3">
        <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
          <div class="hidden sm:flex justify-between border-b border-gray-100 dark:border-gray-700 pb-4 mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">
            <span class="flex-1">Product Details</span>
            <span class="w-32 text-center">Quantity</span>
            <span class="w-24 text-right">Total</span>
            <span class="w-10"></span>
          </div>

          <CartItemComponent 
            v-for="item in cartItems" 
            :key="item.id" 
            :item="item" 
          />
        </div>
      </div>

      <!-- Order Summary -->
      <div class="lg:w-1/3">
        <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8 sticky top-24">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>
          
          <div class="space-y-4 mb-6">
            <div class="flex justify-between text-gray-600 dark:text-gray-300">
              <span>Subtotal ({{ totalItems }} items)</span>
              <span class="font-medium text-gray-900 dark:text-white">${{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-gray-600 dark:text-gray-300">
              <span>Shipping</span>
              <span class="font-medium text-gray-900 dark:text-white">
                {{ shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}` }}
              </span>
            </div>
            <div class="flex justify-between text-gray-600 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700 pb-4">
              <span>Estimated Tax</span>
              <span class="font-medium text-gray-900 dark:text-white">${{ tax.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between items-end pt-2">
              <span class="text-lg font-bold text-gray-900 dark:text-white">Total</span>
              <span class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">${{ grandTotal.toFixed(2) }}</span>
            </div>
          </div>

          <button 
            @click="checkout"
            class="w-full flex items-center justify-center space-x-2 bg-gray-900 dark:bg-indigo-600 text-white px-6 py-4 rounded-2xl font-bold text-lg hover:bg-gray-800 dark:hover:bg-indigo-700 transition-colors shadow-lg shadow-gray-900/20 dark:shadow-indigo-600/20"
          >
            <span>Checkout</span>
            <ArrowRight class="w-5 h-5" />
          </button>

          <p class="text-center text-sm text-gray-500 mt-4 flex items-center justify-center">
            <ShieldCheck class="w-4 h-4 mr-1 text-emerald-500" />
            Secure Encrypted Checkout
          </p>
        </div>
      </div>
    </div>

    <!-- Empty Cart -->
    <div v-else class="text-center py-24 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-indigo-50 dark:bg-indigo-900/30 mb-6">
        <ShoppingBag class="w-12 h-12 text-indigo-300 dark:text-indigo-500" />
      </div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
      <p class="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">Looks like you haven't added anything to your cart yet. Discover our latest products and start shopping.</p>
      <button 
        @click="router.push('/')"
        class="inline-flex items-center px-8 py-3 rounded-full bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors"
      >
        Start Shopping
      </button>
    </div>
  </div>
</template>
