<template>
  <footer id="contact-section" class="bg-[#073a22] text-gray-300 pt-12 pb-6 border-t-4 border-[#d4af37]">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 text-xs">
        
        <!-- Column 1: About & Info with Logo -->
        <div class="space-y-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-white p-1 shadow flex items-center justify-center">
              <img src="/logo.png" alt="Urdu E-Books" class="w-full h-full object-contain" />
            </div>
            <h3 class="text-base font-bold text-white font-serif">{{ settings.footerAboutTitle || 'اردو ای بکس (کتاب و سنت)' }}</h3>
          </div>
          <p class="text-gray-300 leading-relaxed text-[11px]">
            {{ settings.footerAboutDesc || 'کتاب و سنت کی روشنی میں لکھی جانے والی اردو اسلامی کتب کی سب سے بڑی مفت لائبریری جس میں قرآن، حدیث، تفسیر، سیرت اور دیگر علوم اسلامیہ سے متعلق کتب موجود ہیں۔' }}
          </p>
          <div class="pt-2">
            <ul class="space-y-1.5 text-[11px] text-gray-300">
              <li class="flex items-center gap-2 hover:text-[#d4af37] cursor-pointer">
                <i class="fa-solid fa-angle-left text-[#d4af37]"></i>
                <span>رابطہ کریں</span>
              </li>
              <li class="flex items-center gap-2 hover:text-[#d4af37] cursor-pointer">
                <i class="fa-solid fa-angle-left text-[#d4af37]"></i>
                <span>شرائط و ضوابط</span>
              </li>
              <li class="flex items-center gap-2 hover:text-[#d4af37] cursor-pointer">
                <i class="fa-solid fa-angle-left text-[#d4af37]"></i>
                <span>رازداری کی پالیسی</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Column 2: Contact Info -->
        <div class="space-y-3">
          <h3 class="text-sm font-bold text-[#d4af37] font-serif border-b border-emerald-800 pb-2">
            رابطہ کریں
          </h3>
          <ul class="space-y-2 text-[11px]">
            <li class="flex items-start gap-2">
              <i class="fa-solid fa-location-dot text-[#d4af37] mt-1"></i>
              <span class="leading-relaxed">
                {{ settings.footerAddress || 'مرکز النور: کالج روڈ، نزد غازی چوک ٹاؤن شپ، لاہور ۔ پاکستان' }}
              </span>
            </li>
            <li class="flex items-center gap-2">
              <i class="fa-solid fa-phone text-[#d4af37]"></i>
              <span class="en-font">{{ settings.footerPhone || '0092-301-7989520' }}</span>
            </li>
            <li class="flex items-center gap-2">
              <i class="fa-solid fa-envelope text-[#d4af37]"></i>
              <span class="en-font">{{ settings.footerEmail || 'library@mohaddis.com' }}</span>
            </li>
            <li class="flex items-center gap-2">
              <i class="fa-solid fa-building-columns text-[#d4af37]"></i>
              <span class="text-emerald-300">{{ settings.footerBankNotice || 'بینک تفصیلات کے لیے رابطہ کریں' }}</span>
            </li>
          </ul>

          <!-- Social Icons -->
          <div class="pt-2 flex items-center gap-2 text-sm">
            <a :href="settings.facebookUrl || 'https://www.facebook.com/MohaddisMedia'" target="_blank" class="w-7 h-7 rounded bg-emerald-800 hover:bg-[#d4af37] hover:text-[#073a22] flex items-center justify-center transition">
              <i class="fa-brands fa-facebook-f"></i>
            </a>
            <a :href="settings.youtubeUrl || 'https://www.youtube.com/MohaddisMedia'" target="_blank" class="w-7 h-7 rounded bg-emerald-800 hover:bg-[#d4af37] hover:text-[#073a22] flex items-center justify-center transition">
              <i class="fa-brands fa-youtube"></i>
            </a>
            <a :href="settings.twitterUrl || 'https://twitter.com/MohaddisMedia'" target="_blank" class="w-7 h-7 rounded bg-emerald-800 hover:bg-[#d4af37] hover:text-[#073a22] flex items-center justify-center transition">
              <i class="fa-brands fa-x-twitter"></i>
            </a>
            <a :href="settings.instagramUrl || 'https://www.instagram.com/mohaddismedia'" target="_blank" class="w-7 h-7 rounded bg-emerald-800 hover:bg-[#d4af37] hover:text-[#073a22] flex items-center justify-center transition">
              <i class="fa-brands fa-instagram"></i>
            </a>
            <a :href="settings.whatsappUrl || 'https://wa.me/00923000197274'" target="_blank" class="w-7 h-7 rounded bg-emerald-800 hover:bg-[#d4af37] hover:text-[#073a22] flex items-center justify-center transition">
              <i class="fa-brands fa-whatsapp"></i>
            </a>
          </div>
        </div>

        <!-- Column 3: Other Projects -->
        <div class="space-y-3">
          <h3 class="text-sm font-bold text-[#d4af37] font-serif border-b border-emerald-800 pb-2">
            ہمارے دیگر پراجیکٹ
          </h3>
          <ul class="space-y-1.5 text-[11px] grid grid-cols-2 gap-x-2">
            <li class="flex items-center gap-1.5 hover:text-[#d4af37]">
              <i class="fa-solid fa-angle-left text-[9px] text-[#d4af37]"></i>
              <a href="https://quranonlinelibrary.com" target="_blank">قرآن لائبریری</a>
            </li>
            <li class="flex items-center gap-1.5 hover:text-[#d4af37]">
              <i class="fa-solid fa-angle-left text-[9px] text-[#d4af37]"></i>
              <a href="https://mohaddismedia.com" target="_blank">محدث اسٹوڈیو</a>
            </li>
            <li class="flex items-center gap-1.5 hover:text-[#d4af37]">
              <i class="fa-solid fa-angle-left text-[9px] text-[#d4af37]"></i>
              <a href="https://mohaddis.com" target="_blank">محدث حدیث</a>
            </li>
            <li class="flex items-center gap-1.5 hover:text-[#d4af37]">
              <i class="fa-solid fa-angle-left text-[9px] text-[#d4af37]"></i>
              <a href="https://store.mohaddis.com" target="_blank">محدث سٹور</a>
            </li>
            <li class="flex items-center gap-1.5 hover:text-[#d4af37]">
              <i class="fa-solid fa-angle-left text-[9px] text-[#d4af37]"></i>
              <a href="https://urdufatwa.com" target="_blank">محدث فتویٰ</a>
            </li>
            <li class="flex items-center gap-1.5 hover:text-[#d4af37]">
              <i class="fa-solid fa-angle-left text-[9px] text-[#d4af37]"></i>
              <a href="https://shamilaurdu.com" target="_blank">مکتبہ شاملہ</a>
            </li>
            <li class="flex items-center gap-1.5 hover:text-[#d4af37]">
              <i class="fa-solid fa-angle-left text-[9px] text-[#d4af37]"></i>
              <a href="https://rasailojaraid.com" target="_blank">رسائل و جرائد</a>
            </li>
            <li class="flex items-center gap-1.5 hover:text-[#d4af37]">
              <i class="fa-solid fa-angle-left text-[9px] text-[#d4af37]"></i>
              <a href="https://magazine.mohaddis.com" target="_blank">محدث میگزین</a>
            </li>
          </ul>
        </div>

        <!-- Column 4: Important Links & Excel -->
        <div class="space-y-3">
          <h3 class="text-sm font-bold text-[#d4af37] font-serif border-b border-emerald-800 pb-2">
            اہم لنکس
          </h3>
          <ul class="space-y-2 text-[11px]">
            <li class="flex items-center gap-2 hover:text-[#d4af37] cursor-pointer">
              <i class="fa-solid fa-circle-info text-[#d4af37]"></i>
              <span>ہمارے بارے میں</span>
            </li>
            <li class="flex items-center gap-2 hover:text-[#d4af37] cursor-pointer">
              <i class="fa-solid fa-feather-pointed text-[#d4af37]"></i>
              <span>معروف مصنفین</span>
            </li>
            <li class="flex items-center gap-2 hover:text-[#d4af37] cursor-pointer">
              <i class="fa-solid fa-landmark text-[#d4af37]"></i>
              <span>علمی ناشرین و مکتبات</span>
            </li>
            <li class="flex items-center gap-2 text-emerald-300 font-semibold cursor-pointer">
              <i class="fa-solid fa-file-excel text-[#d4af37]"></i>
              <span>تمام کتب کی ایکسل فہرست</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Copyright Bottom Bar -->
      <div class="border-t border-emerald-900 pt-6 mt-6 flex flex-col md:flex-row items-center justify-between text-gray-400 text-xs gap-3">
        <p>
          <span>{{ settings.copyrightText || 'جملہ حقوق محفوظ ہیں۔ کتاب و سنت لائبریری © 2026' }}</span>
        </p>
        <p class="text-[11px] text-gray-500">
          {{ settings.copyrightNote || 'تمام کتب آپ کے کمپیوٹر کے لوکل پی ڈی ایف فولڈر سے براہ راست پیش کی جا رہی ہیں۔' }}
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
defineProps({
  settings: {
    type: Object,
    default: () => ({})
  }
});

defineEmits(['open-admin']);
</script>
