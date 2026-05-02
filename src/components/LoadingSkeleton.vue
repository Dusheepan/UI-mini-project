<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full animate-pulse">
    <!-- Image Skeleton -->
    <div class="w-full pt-[100%] bg-gray-200 relative"></div>
    
    <!-- Content Skeleton -->
    <div class="p-5 flex flex-col flex-grow">
      <div class="h-6 bg-gray-200 rounded-md w-3/4 mb-4"></div>
      
      <div class="space-y-2 mb-4">
        <div class="h-4 bg-gray-200 rounded-md w-full"></div>
        <div class="h-4 bg-gray-200 rounded-md w-5/6"></div>
      </div>
      
      <div class="h-4 bg-gray-200 rounded-md w-1/4 mb-auto"></div>
      
      <div class="mt-4 flex items-center justify-between">
        <div class="h-7 bg-gray-200 rounded-md w-24"></div>
        <div class="h-10 w-10 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  </div>
</template>
