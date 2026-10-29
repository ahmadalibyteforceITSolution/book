<template>
  <div v-if="book" class="fixed inset-0 z-50 bg-black/90 flex flex-col animate-fade-in">
    <!-- Top Reader Bar -->
    <div class="bg-[#073a22] text-white px-4 py-2.5 flex items-center justify-between border-b border-[#0c5332] shadow-lg">
      <div class="flex items-center gap-3 overflow-hidden">
        <button 
          @click="$emit('close')"
          class="bg-[#0c5332] hover:bg-emerald-700 text-white p-2 rounded-lg transition text-xs flex items-center gap-1.5"
          title="بند کریں"
        >
          <i class="fa-solid fa-arrow-right"></i>
          <span class="hidden sm:inline">واپس لائبریری</span>
        </button>

        <div class="truncate">
          <h2 class="text-sm md:text-base font-bold text-[#d4af37] truncate font-serif">
            {{ book.title }}
          </h2>
          <p class="text-[11px] text-gray-300 truncate hidden md:block">
            <span>مصنف: {{ book.author }}</span> | <span>کل صفحات: {{ book.pages }}</span>
          </p>
        </div>
      </div>

      <!-- Action Tools -->
      <div class="flex items-center gap-2">
        <a 
          :href="'/api/pdfs/' + encodeURIComponent(book.filename) + '?download=1'"
          class="bg-[#d4af37] hover:bg-[#b89726] text-[#073a22] font-bold px-3 py-1.5 rounded text-xs flex items-center gap-1.5 transition shadow"
          title="پی ڈی ایف ڈاؤن لوڈ کریں"
        >
          <i class="fa-solid fa-download"></i>
          <span class="hidden sm:inline">ڈاؤن لوڈ کریں</span>
        </a>

        <button 
          @click="toggleFullscreen" 
          class="bg-white/10 hover:bg-white/20 text-white p-2 rounded text-xs transition"
          title="فل اسکرین"
        >
          <i class="fa-solid" :class="isFullscreen ? 'fa-compress' : 'fa-expand'"></i>
        </button>

        <button 
          @click="$emit('close')" 
          class="bg-red-600 hover:bg-red-700 text-white p-2 rounded text-xs transition"
          title="بند کریں"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>

    <!-- PDF Viewer Frame -->
    <div ref="viewerContainer" class="flex-1 w-full h-full bg-[#323639] relative">
      <iframe 
        :src="'/api/pdfs/' + encodeURIComponent(book.filename) + '#toolbar=1&navpanes=1&scrollbar=1'" 
        class="w-full h-full border-none"
        title="PDF Viewer"
      ></iframe>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  book: {
    type: Object,
    default: null
  }
});

defineEmits(['close']);

const viewerContainer = ref(null);
const isFullscreen = ref(false);

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().then(() => {
      isFullscreen.value = true;
    }).catch(err => {
      console.error('Fullscreen error:', err);
    });
  } else {
    document.exitFullscreen().then(() => {
      isFullscreen.value = false;
    });
  }
}
</script>
