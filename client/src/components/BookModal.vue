<template>
  <div v-if="book" class="modal-overlay" @click.self="$emit('close')">
    <div class="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 animate-fade-in">
      
      <!-- Modal Header -->
      <div class="bg-gradient-to-r from-[#0c5332] to-[#167a4b] text-white p-4 px-6 flex justify-between items-center rounded-t-xl sticky top-0 z-20 shadow-md">
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-book-open text-[#d4af37]"></i>
          <span class="font-bold text-sm md:text-base">تفصیلات کتاب (کتاب و سنت لائبریری)</span>
        </div>
        <button 
          @click="$emit('close')" 
          class="text-white hover:text-[#d4af37] w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition"
        >
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          <!-- Book Cover Column -->
          <div class="md:col-span-5 flex flex-col items-center">
            <div class="w-full max-w-[240px] rounded-lg shadow-xl overflow-hidden border-2 border-emerald-700 relative group bg-emerald-950">
              <span class="badge-book-id">{{ book.bookNumber || ('#' + book.id) }}</span>
              <img 
                :src="'/api/covers/' + encodeURIComponent(book.cover || (book.filename.replace(/\.pdf$/i, '.jpg')))" 
                :alt="book.title"
                class="w-full h-auto object-cover"
              />
            </div>

            <!-- Action Buttons under Cover -->
            <div class="w-full max-w-[240px] mt-4 space-y-2">
              <button 
                @click="$emit('read-book', book)"
                class="w-full btn-gold-custom justify-center py-2.5 text-sm shadow-md"
              >
                <i class="fa-solid fa-book-open-reader"></i>
                <span>آن لائن مطالعہ کریں</span>
              </button>

              <button 
                @click="$emit('download-book', book)"
                class="w-full btn-primary-custom justify-center py-2.5 text-sm shadow-md"
              >
                <i class="fa-solid fa-download"></i>
                <span>ڈاؤن لوڈ کریں ({{ book.sizeFormatted }})</span>
              </button>
            </div>
          </div>

          <!-- Book Info Details Column -->
          <div class="md:col-span-7 space-y-4">
            <div>
              <span class="inline-block bg-emerald-100 text-[#0c5332] text-xs font-bold px-3 py-1 rounded-full mb-2">
                {{ book.category || 'عام کتب' }}
              </span>
              <h2 class="text-xl md:text-2xl font-bold text-gray-900 leading-snug font-serif">
                {{ book.title }}
              </h2>
            </div>

            <!-- Metadata Table -->
            <div class="bg-gray-50 rounded-lg p-3.5 border border-gray-200 text-xs space-y-2">
              <div class="grid grid-cols-2 gap-2 border-b border-gray-200 pb-2">
                <div>
                  <span class="text-gray-500 block">مصنف:</span>
                  <span class="font-bold text-gray-800">{{ book.author || 'علمائے کرام' }}</span>
                </div>
                <div>
                  <span class="text-gray-500 block">ناشر / ادارہ:</span>
                  <span class="font-bold text-gray-800">{{ book.publisher || 'مکتبہ کتاب و سنت' }}</span>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2 border-b border-gray-200 pb-2">
                <div>
                  <span class="text-gray-500 block">کل صفحات:</span>
                  <span class="font-bold text-gray-800 en-font">{{ book.pages || 'نامعلوم' }}</span>
                </div>
                <div>
                  <span class="text-gray-500 block">فائل سائز:</span>
                  <span class="font-bold text-gray-800 en-font">{{ book.sizeFormatted }}</span>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <span class="text-gray-500 block">کتاب نمبر:</span>
                  <span class="font-bold text-emerald-800 en-font">{{ book.bookNumber || ('#' + book.id) }}</span>
                </div>
                <div>
                  <span class="text-gray-500 block">کل مشاہدات:</span>
                  <span class="font-bold text-gray-800 en-font">{{ book.views || 0 }} مرتبہ</span>
                </div>
              </div>
            </div>

            <!-- Tabsarah / Description -->
            <div>
              <h4 class="font-bold text-sm text-[#0c5332] border-b border-emerald-100 pb-1 mb-2 flex items-center gap-1.5">
                <i class="fa-solid fa-feather text-xs"></i>
                <span>تبصرہ و تعارف کتاب:</span>
              </h4>
              <p class="text-xs md:text-sm text-gray-700 leading-relaxed bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
                {{ book.description || 'اس کتاب کے بارے میں معلومات کتاب و سنت لائبریری میں شامل کر دی گئی ہیں۔ مکمل مطالعے کے لیے اوپر موجود بٹن پر کلک کیجیے۔' }}
              </p>
            </div>

            <!-- PDF File Info Box -->
            <div class="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs flex items-center gap-2.5 text-amber-900">
              <i class="fa-solid fa-file-pdf text-red-600 text-xl"></i>
              <div class="truncate">
                <span class="font-bold block">موجودہ پی ڈی ایف فائل:</span>
                <span class="text-gray-600 en-font truncate block text-[11px]">{{ book.filename }}</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      <!-- Modal Footer -->
      <div class="bg-gray-100 px-6 py-3 border-t border-gray-200 flex justify-between items-center rounded-b-xl">
        <span class="text-xs text-gray-500">تاریخ شمولیت: {{ book.dateAdded }}</span>
        <button 
          @click="$emit('close')"
          class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-1.5 rounded text-xs font-semibold transition"
        >
          بند کریں
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
defineProps({
  book: {
    type: Object,
    default: null
  }
});

defineEmits(['close', 'read-book', 'download-book']);
</script>
