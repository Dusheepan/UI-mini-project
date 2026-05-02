import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import type { Product } from '../services/api';

export interface CartItem extends Product {
  quantity: number;
}

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref<CartItem[]>([]);
  
  // Load from local storage
  const storedCart = localStorage.getItem('cart');
  if (storedCart) {
    try {
      items.value = JSON.parse(storedCart);
    } catch (e) {
      console.error('Failed to parse cart from local storage', e);
    }
  }

  // Watch state and save to local storage
  watch(items, (newItems) => {
    localStorage.setItem('cart', JSON.stringify(newItems));
  }, { deep: true });

  // Getters
  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0);
  });

  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  });

  // Actions
  function addItem(product: Product) {
    const existingItem = items.value.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      items.value.push({ ...product, quantity: 1 });
    }
  }

  function removeItem(productId: number) {
    items.value = items.value.filter(item => item.id !== productId);
  }

  function updateQuantity(productId: number, quantity: number) {
    const item = items.value.find(item => item.id === productId);
    if (item) {
      if (quantity <= 0) {
        removeItem(productId);
      } else {
        item.quantity = quantity;
      }
    }
  }

  function clearCart() {
    items.value = [];
  }

  return {
    items,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  };
});
