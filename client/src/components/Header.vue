<template>
  <header class="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
    <!-- Top Utility Bar -->
    <div class="bg-[#073a22] text-gray-200 text-xs py-2 px-4 border-b border-[#0c5332]">
      <div class="container mx-auto flex flex-wrap justify-between items-center gap-2">
        <div class="flex items-center gap-4 text-xs font-sans">
          <span class="flex items-center gap-1.5 text-gray-300">
            <i class="fa-solid fa-phone text-[#d4af37]"></i>
            <span class="en-font">{{ settings.phone || '+92 300 0197274' }}</span>
          </span>
          <span class="flex items-center gap-1.5 text-gray-300">
            <i class="fa-solid fa-envelope text-[#d4af37]"></i>
            <span class="en-font">{{ settings.email || 'library@kitabosunnat.com' }}</span>
          </span>
          <span class="hidden md:inline-flex items-center gap-1 text-[#d4af37]">
            <i class="fa-regular fa-calendar-check"></i>
            <span>{{ todayUrdu }}</span>
          </span>
        </div>

        <div class="flex items-center gap-3 text-xs text-[#d4af37]">
          <span>{{ settings.topNotice || '﷽ کتب و سنت لائبریری' }}</span>
        </div>
      </div>
    </div>

    <!-- Main Navigation Bar -->
    <div class="container mx-auto py-3 px-4">
      <div class="flex items-center justify-between gap-4">
        <!-- Logo with user uploaded image -->
        <div class="flex items-center gap-3 cursor-pointer" @click="$emit('nav-home')">
          <div class="w-12 h-12 rounded-xl bg-white flex items-center justify-center p-1 shadow-md border border-[#d4af37]/40">
            <img src="/logo.png" alt="Urdu E-Books" class="w-full h-full object-contain" />
          </div>
          <div>
            <h1 class="text-xl md:text-2xl font-bold text-[#0c5332] leading-tight font-serif flex items-center gap-2">
              <span>{{ settings.siteTitle || 'اردو ای بکس' }}</span>
              <span class="text-xs bg-[#0c5332] text-white px-2 py-0.5 rounded-full font-sans">{{ settings.siteBadge || 'کتاب و سنت' }}</span>
            </h1>
            <p class="text-[11px] text-gray-500 font-sans tracking-wide">{{ settings.siteTagline || 'اردو اسلامی کتب کا سب سے بڑا مفت مرکز' }}</p>
          </div>
        </div>

        <!-- Navigation Links -->
        <nav class="hidden lg:flex items-center gap-1.5">
          <button 
            @click="$emit('nav-home')"
            :class="activeTab === 'home' && !isAdminOpen ? 'bg-[#0c5332] text-white' : 'text-gray-700 hover:bg-gray-100'"
            class="px-4 py-2 rounded-md font-medium text-sm transition flex items-center gap-2"
          >
            <i class="fa-solid fa-house text-xs"></i>
            <span>صفحہ اول</span>
          </button>

          <!-- Categories Mega Dropdown Trigger -->
          <div class="relative group">
            <button 
              @click="$emit('nav-books')"
              :class="activeTab === 'books' && !isAdminOpen ? 'bg-[#0c5332] text-white' : 'text-gray-700 hover:bg-gray-100'"
              class="px-4 py-2 rounded-md font-medium text-sm transition flex items-center gap-2"
            >
              <i class="fa-solid fa-book-open text-xs"></i>
              <span>کتب لائبریری</span>
              <i class="fa-solid fa-angle-down text-xs mr-1 opacity-75"></i>
            </button>

            <!-- Mega Dropdown Menu -->
            <div class="absolute right-0 top-full mt-1 w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div class="px-4 py-2 text-xs font-bold text-gray-400 border-b border-gray-100 uppercase tracking-wider">
                موضوعات و زمرہ جات
              </div>
              <div class="max-h-80 overflow-y-auto">
                <button 
                  v-for="cat in categories" 
                  :key="cat.name"
                  @click="$emit('filter-category', cat.name)"
                  class="w-full text-right px-4 py-2.5 text-xs text-gray-700 hover:bg-emerald-50 hover:text-[#0c5332] flex items-center justify-between border-b border-gray-50 transition"
                >
                  <span class="flex items-center gap-2">
                    <i class="fa-solid fa-folder text-emerald-600 text-[10px]"></i>
                    <span>{{ cat.name }}</span>
                  </span>
                  <span class="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[10px] en-font">{{ cat.count }}</span>
                </button>
              </div>
            </div>
          </div>

          <button 
            @click="$emit('filter-special', 'new')"
            class="px-4 py-2 rounded-md font-medium text-sm text-gray-700 hover:bg-gray-100 transition flex items-center gap-2"
          >
            <i class="fa-solid fa-sparkles text-amber-500 text-xs"></i>
            <span>جدید کتب</span>
          </button>

          <button 
            @click="$emit('filter-special', 'featured')"
            class="px-4 py-2 rounded-md font-medium text-sm text-gray-700 hover:bg-gray-100 transition flex items-center gap-2"
          >
            <i class="fa-solid fa-star text-amber-500 text-xs"></i>
            <span>اہم کتب</span>
          </button>

          <button 
            @click="$emit('scroll-to', 'stats-section')"
            class="px-4 py-2 rounded-md font-medium text-sm text-gray-700 hover:bg-gray-100 transition flex items-center gap-2"
          >
            <i class="fa-solid fa-chart-simple text-xs"></i>
            <span>اعداد و شمار</span>
          </button>

          <button 
            @click="$emit('scroll-to', 'contact-section')"
            class="px-4 py-2 rounded-md font-medium text-sm text-gray-700 hover:bg-gray-100 transition flex items-center gap-2"
          >
            <i class="fa-solid fa-phone text-xs"></i>
            <span>رابطہ کریں</span>
          </button>
        </nav>

        <!-- Right Action Button -->
        <div class="flex items-center gap-2">
          <button 
            @click="$emit('trigger-scan')"
            class="hidden sm:inline-flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-[#0c5332] border border-emerald-300 px-3.5 py-1.5 rounded-md text-xs font-semibold transition"
            title="فولڈر اسکین کریں اور نئی پی ڈی ایف کتابیں حاصل کریں"
          >
            <i class="fa-solid fa-arrows-rotate text-emerald-600"></i>
            <span>پی ڈی ایف سنک کریں</span>
          </button>

          <!-- Mobile Menu Button -->
          <button 
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="lg:hidden p-2 text-gray-600 hover:text-[#0c5332] rounded-md focus:outline-none"
          >
            <i class="fa-solid" :class="mobileMenuOpen ? 'fa-xmark text-xl' : 'fa-bars text-xl'"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation Drawer -->
    <div v-if="mobileMenuOpen" class="lg:hidden bg-white border-t border-gray-200 px-4 py-3 space-y-1">
      <button 
        @click="$emit('nav-home'); mobileMenuOpen = false;"
        class="w-full text-right px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
      >
        صفحہ اول
      </button>
      <button 
        @click="$emit('nav-books'); mobileMenuOpen = false;"
        class="w-full text-right px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
      >
        تمام کتب لائبریری
      </button>
      <button 
        @click="$emit('filter-special', 'new'); mobileMenuOpen = false;"
        class="w-full text-right px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
      >
        جدید کتابیں
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  activeTab: {
    type: String,
    default: 'home'
  },
  isAdminOpen: {
    type: Boolean,
    default: false
  },
  settings: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['toggle-admin', 'nav-home', 'nav-books', 'filter-category', 'filter-special', 'scroll-to', 'trigger-scan']);

const mobileMenuOpen = ref(false);

const todayUrdu = ref(new Date().toLocaleDateString('ur-PK', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}));
</script>
