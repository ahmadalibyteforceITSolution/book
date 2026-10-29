<template>
  <div class="book-card group">
    <!-- Cover & Badges Container -->
    <div class="book-cover-container" @click="$emit('select-book', book)">
      <!-- Book ID Badge (Top Right) -->
      <span class="badge-book-id">{{ book.bookNumber || ('#' + book.id) }}</span>

      <!-- New Badge (Top Left) -->
      <span v-if="book.isNew" class="badge-new">New</span>

      <!-- Cover Image from Backend API -->
      <img 
        :src="'/api/covers/' + encodeURIComponent(book.cover || (book.filename.replace(/\.pdf$/i, '.jpg')))" 
        :alt="book.title"
        class="book-cover-img"
        loading="lazy"
        @error="handleImgError"
      />

      <!-- Quick Hover Overlay -->
      <div class="absolute inset-0 bg-[#0c5332]/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 p-3 text-center">
        <button 
          @click.stop="$emit('read-book', book)"
          class="w-full bg-[#d4af37] hover:bg-[#b89726] text-[#073a22] font-bold py-2 px-3 rounded text-xs shadow-md flex items-center justify-center gap-1.5 transition transform translate-y-2 group-hover:translate-y-0"
        >
          <i class="fa-solid fa-book-open-reader"></i>
          <span>آن لائن پڑھیں</span>
        </button>

        <button 
          @click.stop="$emit('download-book', book)"
          class="w-full bg-white hover:bg-gray-100 text-[#0c5332] font-semibold py-2 px-3 rounded text-xs shadow-md flex items-center justify-center gap-1.5 transition transform translate-y-2 group-hover:translate-y-0"
        >
          <i class="fa-solid fa-download"></i>
          <span>ڈاؤن لوڈ کریں ({{ book.sizeFormatted }})</span>
        </button>
      </div>
    </div>

    <!-- Book Details Container -->
    <div class="p-3.5 flex flex-col justify-between flex-1">
      <div>
        <!-- Category Pill -->
        <div class="flex items-center justify-between text-[11px] text-emerald-800 mb-1">
          <span class="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-medium truncate max-w-[70%]">
            {{ book.category || 'عام کتب' }}
          </span>
          <span class="text-gray-400 en-font text-[10px]">{{ book.pages }} ص</span>
        </div>

        <!-- Book Title with generous line height and clean styling -->
        <h3 
          @click="$emit('select-book', book)"
          class="text-xs sm:text-[13px] md:text-[14px] font-bold text-gray-900 group-hover:text-[#0c5332] transition cursor-pointer my-1.5"
          style="line-height: 1.6; min-height: 44px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;"
          :title="book.title"
        >
          {{ book.title }}
        </h3>

        <!-- Author / Publisher -->
        <p class="text-[11px] text-gray-600 truncate pb-1">
          <i class="fa-solid fa-feather-pointed text-[9px] text-emerald-600 ml-1"></i>
          <span>{{ book.author || 'علمائے کرام' }}</span>
        </p>
      </div>

      <!-- Views & Date Info matching KitaboSunnat -->
      <div class="pt-3 mt-2 border-t border-gray-100 text-[11px] text-gray-500">
        <div class="flex items-center justify-between">
          <span class="flex items-center gap-1 text-emerald-700 font-medium">
            <i class="fa-solid fa-eye text-[10px]"></i>
            <span>مشاہدات: </span>
            <span class="en-font">{{ book.views || 0 }}</span>
          </span>
          <span class="text-gray-400 text-[10px]">
            {{ book.dateAdded }}
          </span>
        </div>

        <!-- Direct Actions on mobile/default -->
        <div class="grid grid-cols-2 gap-2 mt-2.5">
          <button 
            @click.stop="$emit('read-book', book)"
            class="bg-emerald-50 hover:bg-emerald-100 text-[#0c5332] py-1.5 px-2 rounded text-xs font-semibold flex items-center justify-center gap-1 border border-emerald-200 transition"
          >
            <i class="fa-solid fa-book-open text-[11px]"></i>
            <span>مطالعہ</span>
          </button>

          <button 
            @click.stop="$emit('download-book', book)"
            class="bg-gray-50 hover:bg-gray-100 text-gray-700 py-1.5 px-2 rounded text-xs font-medium flex items-center justify-center gap-1 border border-gray-200 transition"
          >
            <i class="fa-solid fa-arrow-down-to-bracket text-[11px] text-emerald-600"></i>
            <span>ڈاؤن لوڈ</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  book: {
    type: Object,
    required: true
  }
});

defineEmits(['select-book', 'read-book', 'download-book']);

function handleImgError(e) {
  // SVG placeholder fallback
  e.target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="420" viewBox="0 0 300 420"><rect width="300" height="420" fill="%230c5332"/><rect x="15" y="15" width="270" height="390" fill="none" stroke="%23d4af37" stroke-width="2"/><text x="150" y="200" fill="%23ffffff" font-size="20" font-family="sans-serif" text-anchor="middle">کتاب و سنت لائبریری</text><text x="150" y="235" fill="%23d4af37" font-size="14" font-family="sans-serif" text-anchor="middle">PDF کتاب</text></svg>`;
}
</script>
