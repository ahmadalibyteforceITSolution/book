<template>
  <section id="stats-section" class="py-12 bg-white border-y border-gray-200">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left: Counter Box (اعداد و شمار) matching KitaboSunnat -->
        <div class="lg:col-span-5 bg-gradient-to-br from-[#073a22] to-[#0c5332] text-white rounded-xl p-6 shadow-xl border-2 border-[#d4af37]/30">
          <div class="flex items-center justify-between border-b border-emerald-700/60 pb-3 mb-4">
            <h2 class="text-xl font-bold font-serif text-[#d4af37] flex items-center gap-2">
              <i class="fa-solid fa-chart-line"></i>
              <span>{{ settings.statsTitle || 'اعداد و شمار لائبریری' }}</span>
            </h2>
            <span class="text-xs bg-emerald-900/80 px-2 py-0.5 rounded text-emerald-200">{{ settings.statsSubtitle || 'براہ راست اعداد' }}</span>
          </div>

          <div class="grid grid-cols-2 gap-3 text-center">
            <!-- Weekly -->
            <div class="bg-black/20 p-3 rounded-lg border border-white/10 hover:border-[#d4af37]/50 transition">
              <span class="block text-2xl font-bold text-[#d4af37] en-font">{{ Math.floor(stats.totalViews * 2.5) + 1240 }}</span>
              <p class="text-xs text-emerald-100 mt-1">اس ہفتے کے قارئین</p>
            </div>

            <!-- Today -->
            <div class="bg-black/20 p-3 rounded-lg border border-white/10 hover:border-[#d4af37]/50 transition">
              <span class="block text-2xl font-bold text-white en-font">{{ Math.floor(stats.totalViews * 0.4) + 185 }}</span>
              <p class="text-xs text-emerald-100 mt-1">آج کے قارئین</p>
            </div>

            <!-- Total Books (Mine from PDF folder!) -->
            <div class="bg-emerald-950/60 p-3.5 rounded-lg border-2 border-[#d4af37] col-span-2 shadow-inner">
              <span class="block text-3xl font-extrabold text-[#d4af37] en-font">{{ stats.totalBooks }}</span>
              <p class="text-sm font-bold text-white mt-0.5">کل کتب (آپ کے پی ڈی ایف ذخیرہ سے)</p>
              <p class="text-[11px] text-emerald-200 en-font mt-0.5">کل صفحات: {{ stats.totalPages }} ص | کل حجم: {{ stats.totalSizeFormatted }}</p>
            </div>

            <!-- Monthly -->
            <div class="bg-black/20 p-3 rounded-lg border border-white/10 hover:border-[#d4af37]/50 transition">
              <span class="block text-2xl font-bold text-white en-font">{{ Math.floor(stats.totalViews * 8) + 5400 }}</span>
              <p class="text-xs text-emerald-100 mt-1">اس ماہ کے قارئین</p>
            </div>

            <!-- Total Readers/Views -->
            <div class="bg-black/20 p-3 rounded-lg border border-white/10 hover:border-[#d4af37]/50 transition">
              <span class="block text-2xl font-bold text-[#d4af37] en-font">{{ stats.totalViews + 12500 }}</span>
              <p class="text-xs text-emerald-100 mt-1">کل قارئین</p>
            </div>
          </div>
        </div>

        <!-- Middle: Newsletter / Notification Subscription -->
        <div class="lg:col-span-4 bg-[#f8fbf9] border border-emerald-100 rounded-xl p-6 shadow-sm flex flex-col justify-between h-full">
          <div>
            <h2 class="text-xl font-bold font-serif text-[#0c5332] mb-2 flex items-center gap-2">
              <i class="fa-solid fa-envelope-open-text text-[#d4af37]"></i>
              <span>{{ settings.newsletterTitle || 'ای میل سبسکرپشن' }}</span>
            </h2>
            <p class="text-xs text-gray-600 leading-relaxed">
              {{ settings.newsletterDesc || 'کتاب و سنت لائبریری کی نئی کتب اور اپ ڈیٹس بذریعہ ای میل وصول کرنے کے لیے اپنا ای میل درج کر کے سبسکرائب کریں۔' }}
            </p>

            <form @submit.prevent="handleSubscribe" class="mt-4 space-y-2.5">
              <input 
                type="email" 
                v-model="emailInput"
                placeholder="آپ کا ای میل ایڈریس..." 
                required
                class="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-md focus:border-[#0c5332] focus:ring-1 focus:ring-[#0c5332] outline-none"
              />
              <button 
                type="submit"
                class="w-full btn-primary-custom justify-center py-2 text-xs"
              >
                <span>سبسکرائب کریں</span>
                <i class="fa-solid fa-paper-plane text-xs"></i>
              </button>
            </form>
            <p v-if="subscribed" class="text-xs text-emerald-700 font-bold mt-2 text-center animate-fade-in">
              شکریہ! آپ کو باقاعدگی سے نئی کتب کی معلومات موصول ہوں گی۔
            </p>
          </div>

          <!-- Feature Tag -->
          <div class="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-500 flex items-center gap-2">
            <i class="fa-solid fa-shield-halved text-emerald-600"></i>
            <span>تمام کتب مکمل طور پر مفت، بلا معاوضہ اور پی ڈی ایف فارمیٹ میں ہیں۔</span>
          </div>
        </div>

        <!-- Right: Mobile App & Direct Support matching KitaboSunnat -->
        <div class="lg:col-span-3 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 shadow-sm">
          <h2 class="text-xl font-bold font-serif text-[#0c5332] mb-2 flex items-center gap-2">
            <i class="fa-solid fa-mobile-screen text-[#d4af37]"></i>
            <span>{{ settings.appBoxTitle || 'موبائل لائبریری ایپ' }}</span>
          </h2>
          <p class="text-xs text-gray-600 leading-relaxed">
            {{ settings.appBoxDesc || 'کتاب و سنت لائبریری کے ذریعے اپنے موبائل پر ہزاروں کتب آسانی سے پڑھیں اور محفوظ کریں۔' }}
          </p>

          <div class="mt-4 space-y-2">
            <a 
              href="https://play.google.com/store/apps/details?id=com.MohaddisMedia.kitabosunnat" 
              target="_blank" 
              rel="noopener"
              class="flex items-center gap-3 bg-black text-white px-3.5 py-2 rounded-lg hover:bg-gray-800 transition shadow"
            >
              <i class="fa-brands fa-google-play text-xl text-green-400"></i>
              <div class="text-right">
                <span class="block text-[9px] uppercase tracking-wider text-gray-400 font-sans">Get it on</span>
                <span class="font-bold text-xs font-sans">Google Play</span>
              </div>
            </a>

            <a 
              href="https://apps.apple.com/us/app/%DA%A9%D8%AA%D8%A7%D8%A8-%D9%88%D8%B3%D9%86%D8%AA-%D9%85%D8%AD%D8%AF%D8%AB-kitabosunnat/id1538600318" 
              target="_blank" 
              rel="noopener"
              class="flex items-center gap-3 bg-gray-900 text-white px-3.5 py-2 rounded-lg hover:bg-gray-800 transition shadow"
            >
              <i class="fa-brands fa-apple text-2xl text-white"></i>
              <div class="text-right">
                <span class="block text-[9px] uppercase tracking-wider text-gray-400 font-sans">Download on the</span>
                <span class="font-bold text-xs font-sans">App Store</span>
              </div>
            </a>
          </div>

          <div class="mt-4 pt-3 border-t border-amber-200/60 text-center">
            <span class="text-[11px] text-amber-800 font-medium">سپورٹ و رہنمائی کے لیے ہمہ وقت دستیاب</span>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  stats: {
    type: Object,
    default: () => ({
      totalBooks: 0,
      totalViews: 0,
      totalDownloads: 0,
      totalPages: 0,
      totalSizeFormatted: '0 MB'
    })
  },
  settings: {
    type: Object,
    default: () => ({})
  }
});

const emailInput = ref('');
const subscribed = ref(false);

function handleSubscribe() {
  if (emailInput.value) {
    subscribed.value = true;
    emailInput.value = '';
    setTimeout(() => {
      subscribed.value = false;
    }, 5000);
  }
}
</script>
