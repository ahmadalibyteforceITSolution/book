<template>
  <section class="bg-white py-4 shadow-sm border-b border-gray-200">
    <div class="container mx-auto px-4">
      <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#f0f5f2] p-2.5 rounded-lg border border-emerald-200">
        
        <!-- Category Dropdown Button (موضوعاتی فہرست) -->
        <div class="relative">
          <button 
            @click="categoryMenuOpen = !categoryMenuOpen"
            class="w-full md:w-auto bg-[#0c5332] text-white hover:bg-[#073a22] px-4 py-2.5 rounded-md text-sm font-medium flex items-center justify-between gap-3 transition shadow-sm"
          >
            <span class="flex items-center gap-2">
              <i class="fa-solid fa-list-ul text-[#d4af37]"></i>
              <span>موضوعاتی فہرست</span>
            </span>
            <i class="fa-solid fa-angle-down text-xs transition-transform" :class="categoryMenuOpen ? 'rotate-180' : ''"></i>
          </button>

          <!-- Dropdown List -->
          <div 
            v-if="categoryMenuOpen" 
            class="absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-40 animate-fade-in"
          >
            <div class="px-3 py-1.5 text-xs font-bold text-gray-500 border-b border-gray-100 flex justify-between items-center">
              <span>تمام زمرہ جات</span>
              <button @click="categoryMenuOpen = false" class="text-gray-400 hover:text-gray-600">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div class="max-h-72 overflow-y-auto">
              <button 
                @click="selectCategory('all')"
                :class="selectedCategory === 'all' ? 'bg-emerald-50 text-[#0c5332] font-bold' : 'text-gray-700'"
                class="w-full text-right px-4 py-2 text-xs hover:bg-gray-50 flex items-center justify-between border-b border-gray-50"
              >
                <span>تمام کتب دکھائیں</span>
                <span class="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full en-font">{{ totalBooksCount }}</span>
              </button>

              <button 
                v-for="cat in categories" 
                :key="cat.name"
                @click="selectCategory(cat.name)"
                :class="selectedCategory === cat.name ? 'bg-emerald-50 text-[#0c5332] font-bold' : 'text-gray-700'"
                class="w-full text-right px-4 py-2 text-xs hover:bg-emerald-50 flex items-center justify-between border-b border-gray-50"
              >
                <span class="flex items-center gap-2">
                  <i class="fa-solid fa-folder-closed text-emerald-600 text-[11px]"></i>
                  <span>{{ cat.name }}</span>
                </span>
                <span class="text-[10px] bg-emerald-100 text-[#0c5332] font-semibold px-2 py-0.5 rounded-full en-font">
                  {{ cat.count }}
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- Main Search Form -->
        <div class="flex-1 flex flex-col sm:flex-row items-stretch border border-gray-300 rounded-md overflow-hidden bg-white shadow-inner">
          <!-- Search Type Selector (نام، مصنف، ناشر، نمبر) -->
          <select 
            v-model="searchType"
            class="bg-gray-50 text-gray-700 text-xs px-3 py-2.5 border-b sm:border-b-0 sm:border-l border-gray-200 outline-none cursor-pointer focus:bg-white"
          >
            <option value="book">نام کے ذریعے کتاب تلاش کریں۔۔۔</option>
            <option value="author">مصنف تلاش کریں۔۔۔</option>
            <option value="publisher">ناشر تلاش کریں۔۔۔</option>
            <option value="number">کتاب نمبر کے ذریعے تلاش کریں۔۔۔</option>
            <option value="all">تمام تفصیلات میں تلاش کریں۔۔۔</option>
          </select>

          <!-- Search Input -->
          <div class="flex-1 flex items-center px-3">
            <input 
              type="text" 
              v-model="searchKeyword"
              @keyup.enter="triggerSearch"
              placeholder="تلاش کریں۔۔۔ (مثلاً: حدیث، بچے، معاویہ، اذکار، تربیت)"
              class="w-full text-sm outline-none text-gray-800 placeholder-gray-400 py-2 bg-transparent"
            />
            <button 
              v-if="searchKeyword" 
              @click="clearSearch"
              class="text-gray-400 hover:text-gray-600 p-1"
            >
              <i class="fa-solid fa-circle-xmark text-xs"></i>
            </button>
          </div>

          <!-- Search Submit Button -->
          <button 
            @click="triggerSearch"
            class="bg-[#0c5332] hover:bg-[#073a22] text-white px-5 py-2.5 text-sm font-semibold flex items-center justify-center gap-2 transition"
          >
            <i class="fa-solid fa-magnifying-glass"></i>
            <span class="hidden sm:inline">تلاش</span>
          </button>
        </div>

        <!-- Order Button matching KitaboSunnat -->
        <a 
          href="https://store.mohaddis.com" 
          target="_blank"
          class="bg-[#d4af37] hover:bg-[#b89726] text-[#073a22] font-bold px-4 py-2.5 rounded-md text-xs flex items-center justify-center gap-2 transition shadow-sm whitespace-nowrap"
        >
          <i class="fa-solid fa-cart-shopping text-sm"></i>
          <span>کتاب منگوائیں</span>
        </a>

      </div>

      <!-- Active Filter Tags Display -->
      <div v-if="selectedCategory !== 'all' || searchKeyword" class="mt-2.5 flex items-center gap-2 text-xs text-gray-600 flex-wrap">
        <span class="font-bold text-gray-500">فعال فلٹرز:</span>
        <span v-if="selectedCategory !== 'all'" class="inline-flex items-center gap-1.5 bg-emerald-100 text-[#0c5332] px-2.5 py-1 rounded-full font-medium">
          <span>زمرہ: {{ selectedCategory }}</span>
          <button @click="selectCategory('all')" class="hover:text-red-600"><i class="fa-solid fa-xmark text-[10px]"></i></button>
        </span>
        <span v-if="searchKeyword" class="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full font-medium">
          <span>تلاش: "{{ searchKeyword }}"</span>
          <button @click="clearSearch" class="hover:text-red-600"><i class="fa-solid fa-xmark text-[10px]"></i></button>
        </span>
        <button @click="resetAllFilters" class="text-xs text-red-600 hover:underline mr-2">تمام فلٹرز ختم کریں</button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  totalBooksCount: {
    type: Number,
    default: 0
  },
  selectedCategory: {
    type: String,
    default: 'all'
  }
});

const emit = defineEmits(['search', 'filter-category', 'open-admin-add']);

const categoryMenuOpen = ref(false);
const searchType = ref('all');
const searchKeyword = ref('');

function selectCategory(category) {
  categoryMenuOpen.value = false;
  emit('filter-category', category);
}

function triggerSearch() {
  emit('search', {
    keyword: searchKeyword.value,
    type: searchType.value
  });
}

function clearSearch() {
  searchKeyword.value = '';
  triggerSearch();
}

function resetAllFilters() {
  searchKeyword.value = '';
  selectCategory('all');
}
</script>
