<template>
  <section class="relative overflow-hidden bg-gradient-to-r from-[#073a22] via-[#0c5332] to-[#073a22] text-white py-12 md:py-16 border-b-4 border-[#d4af37]">
    <!-- Islamic Geometric / Calligraphy Decorative Background -->
    <div class="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="islamicPattern" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke="#d4af37" stroke-width="1"/>
            <circle cx="30" cy="30" r="12" fill="none" stroke="#d4af37" stroke-width="0.8"/>
            <path d="M15 15 L45 45 M45 15 L15 45" stroke="#d4af37" stroke-width="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#islamicPattern)"/>
      </svg>
    </div>

    <!-- Soft Glow circles -->
    <div class="absolute -top-24 -right-24 w-96 h-96 bg-[#167a4b] rounded-full filter blur-3xl opacity-30 pointer-events-none"></div>
    <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-[#d4af37] rounded-full filter blur-3xl opacity-20 pointer-events-none"></div>

    <div class="container mx-auto px-4 relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <!-- Text Content -->
        <div class="md:col-span-8 text-center md:text-right space-y-4">
          <div class="inline-flex items-center gap-2 bg-[#d4af37]/20 border border-[#d4af37]/40 px-4 py-1 rounded-full text-[#d4af37] text-xs font-semibold">
            <span>{{ settings.bannerTag || '﷽ کتاب و سنت کی روشنی میں مستند علمی مرکز' }}</span>
          </div>

          <h1 class="text-3xl md:text-5xl font-bold font-serif leading-tight">
            <span>{{ settings.bannerTitle || 'کتاب و سنت' }} </span>
            <span class="text-[#d4af37]">{{ settings.bannerHighlight || '(محدث)' }}</span>
            <span> {{ settings.bannerSuffix || 'لائبریری' }}</span>
          </h1>

          <p class="text-sm md:text-lg text-emerald-100 max-w-2xl leading-relaxed">
            {{ settings.bannerDescription || 'کتاب و سنت کی روشنی میں لکھی جانے والی اردو اسلامی کتب کا سب سے بڑا مفت مرکز، جس میں احادیث مبارکہ، تربیت اولاد، سیرت و سوانح، اذکار و دعائیں اور دینی کتب مکمل پی ڈی ایف میں دستیاب ہیں۔' }}
          </p>

          <div class="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
            <button 
              @click="$emit('browse-books')"
              class="btn-gold-custom text-sm px-6 py-2.5 shadow-lg"
            >
              <i class="fa-solid fa-book-bookmark"></i>
              <span>{{ settings.bannerBtnText1 || 'کتب کا مطالعہ کریں' }}</span>
            </button>

            <button 
              @click="$emit('trigger-scan')"
              class="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-5 py-2.5 rounded-md text-sm font-medium transition flex items-center gap-2"
            >
              <i class="fa-solid fa-folder-open text-[#d4af37]"></i>
              <span>{{ settings.bannerBtnText2 || 'فولڈر میں نئی کتابیں شامل کریں' }}</span>
            </button>
          </div>
        </div>

        <!-- Banner Illustration / Quran Motif -->
        <div class="md:col-span-4 flex justify-center">
          <div class="relative w-56 h-64 md:w-64 md:h-72 bg-gradient-to-tr from-[#0a462a] to-[#167a4b] rounded-2xl p-6 shadow-2xl border-2 border-[#d4af37]/50 flex flex-col justify-between items-center text-center transform hover:rotate-1 transition-transform duration-300">
            <!-- Decorative Border Frame -->
            <div class="absolute inset-2 border border-[#d4af37]/30 rounded-xl pointer-events-none"></div>

            <div class="text-[#d4af37] text-4xl mt-2">
              <i class="fa-solid fa-book-quran"></i>
            </div>

            <div class="my-auto">
              <p class="text-xs text-[#d4af37] font-semibold tracking-wide">{{ settings.bannerCardBadge || 'القرآن والسنۃ' }}</p>
              <h3 class="text-xl font-bold text-white font-serif mt-1">{{ settings.bannerCardTitle || 'مفت اسلامی لائبریری' }}</h3>
              <p class="text-[11px] text-emerald-200 mt-1">{{ settings.bannerCardSubtitle || 'آن لائن پی ڈی ایف مطالعہ و ڈاؤن لوڈ' }}</p>
            </div>

            <div class="w-full bg-[#073a22] rounded-lg py-2 px-3 border border-[#d4af37]/30 flex justify-around text-xs">
              <div>
                <span class="block text-[#d4af37] font-bold en-font">{{ totalBooks }}</span>
                <span class="text-[10px] text-gray-300">کل کتب</span>
              </div>
              <div class="border-r border-emerald-700"></div>
              <div>
                <span class="block text-[#d4af37] font-bold en-font">{{ totalViews }}</span>
                <span class="text-[10px] text-gray-300">مشاہدات</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  totalBooks: {
    type: Number,
    default: 0
  },
  totalViews: {
    type: Number,
    default: 0
  },
  settings: {
    type: Object,
    default: () => ({})
  }
});

defineEmits(['browse-books', 'trigger-scan']);
</script>
