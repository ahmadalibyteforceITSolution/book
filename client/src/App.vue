<template>
  <div class="min-h-screen flex flex-col bg-[#f4f6f5] selection:bg-[#0c5332] selection:text-white">
    
    <!-- 1. PRIVATE OWNER PORTAL: Only accessible via /admin or #/admin -->
    <div v-if="isAdminRoute" class="flex-1">
      <!-- Separate Owner Login Screen (Only shown if NOT logged in) -->
      <OwnerLogin 
        v-if="!isOwnerAuthenticated"
        @login-success="onOwnerLoginSuccess"
      />

      <!-- Secure Admin Panel (Only shown after Owner Login) -->
      <AdminPanel 
        v-else
        :books="books"
        :stats="stats"
        :settings="siteSettings"
        @logout="onOwnerLogout"
        @close-admin="goToPublicSite"
        @refresh-books="fetchAllData"
        @refresh-settings="fetchSettings"
        @read-book="openReader"
        @preview-book="openBookModal"
      />
    </div>

    <!-- 2. PUBLIC WEBSITE (Exact KitaboSunnat - Zero Admin buttons visible) -->
    <div v-else class="flex flex-col min-h-screen">
      <!-- Top Header -->
      <Header 
        :categories="categories"
        :active-tab="activeTab"
        :settings="siteSettings"
        @nav-home="goHome"
        @nav-books="goBooks"
        @filter-category="handleCategorySelect"
        @filter-special="handleSpecialFilter"
        @scroll-to="scrollToSection"
        @trigger-scan="handleScanFolder"
        @search="handleSearch"
      />

      <!-- Main Content Area -->
      <main class="flex-1">
        <!-- Hero Banner (Fully customizable from CMS) -->
        <Banner 
          :total-books="stats.totalBooks"
          :total-views="stats.totalViews"
          :settings="siteSettings"
          @browse-books="goBooks"
          @trigger-scan="handleScanFolder"
        />

        <!-- Search Bar with Category Selector -->
        <SearchBar 
          :categories="categories"
          :total-books-count="books.length"
          :selected-category="selectedCategory"
          @search="handleSearch"
          @filter-category="handleCategorySelect"
        />

        <!-- Scan notification toast -->
        <div v-if="scanNotice" class="container mx-auto px-4 mt-4">
          <div class="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-lg flex items-center justify-between text-xs animate-fade-in shadow-sm">
            <span class="flex items-center gap-2">
              <i class="fa-solid fa-circle-check text-emerald-600"></i>
              <span>{{ scanNotice }}</span>
            </span>
            <button @click="scanNotice = ''"><i class="fa-solid fa-xmark"></i></button>
          </div>
        </div>

        <!-- MAIN BOOKS DISPLAY CONTAINER -->
        <div class="container mx-auto px-4 py-8 space-y-12">
          
          <!-- SECTION 1: جديد کتابیں (Latest Books) -->
          <section id="latest-books-section">
            <div class="flex items-center justify-between border-b-2 border-emerald-800 pb-2.5 mb-6">
              <div class="flex items-center gap-2">
                <div class="w-3 h-6 bg-[#0c5332] rounded-sm"></div>
                <h2 class="text-xl md:text-2xl font-bold text-[#0c5332] font-serif">
                  {{ filterTitle || (siteSettings.latestBooksTitle || 'جديد کتابیں') }}
                </h2>
                <span class="bg-emerald-100 text-[#0c5332] text-xs font-bold px-2.5 py-0.5 rounded-full en-font">
                  {{ displayedBooks.length }} کتب
                </span>
              </div>

              <div class="flex items-center gap-2">
                <button 
                  v-if="selectedCategory !== 'all' || searchKeyword"
                  @click="resetFilters"
                  class="text-xs text-red-600 hover:underline flex items-center gap-1"
                >
                  <i class="fa-solid fa-rotate-left"></i>
                  <span>فلٹر ختم کریں</span>
                </button>
                <button 
                  @click="goBooks"
                  class="text-xs font-bold text-[#0c5332] hover:text-[#073a22] hover:underline"
                >
                  تمام کتب دیکھیں &larr;
                </button>
              </div>
            </div>

            <!-- Empty State -->
            <div v-if="displayedBooks.length === 0" class="text-center py-12 bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
              <div class="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-[#0c5332] flex items-center justify-center text-2xl mb-3">
                <i class="fa-solid fa-book-open"></i>
              </div>
              <h3 class="text-base font-bold text-gray-800 mb-1">کوئی کتاب نہیں ملی</h3>
              <p class="text-xs text-gray-500 mb-4">آپ کی تلاش کے مطابق کتاب دستیاب نہیں ہے۔</p>
              <button @click="resetFilters" class="btn-primary-custom text-xs">
                تمام کتب دیکھیں
              </button>
            </div>

            <!-- Books Grid -->
            <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
              <BookCard 
                v-for="book in displayedBooks" 
                :key="book.id"
                :book="book"
                @select-book="openBookModal"
                @read-book="openReader"
                @download-book="downloadBook"
              />
            </div>
          </section>

          <!-- SECTION 2: اعداد و شمار (Statistics Section matching KitaboSunnat) -->
          <StatsSection :stats="stats" :settings="siteSettings" />

          <!-- SECTION 3: اہم کتابیں (Featured Books) -->
          <section v-if="featuredBooks.length > 0 && selectedCategory === 'all' && !searchKeyword">
            <div class="flex items-center justify-between border-b-2 border-emerald-800 pb-2.5 mb-6">
              <div class="flex items-center gap-2">
                <div class="w-3 h-6 bg-[#d4af37] rounded-sm"></div>
                <h2 class="text-xl md:text-2xl font-bold text-[#0c5332] font-serif">
                  {{ siteSettings.featuredBooksTitle || 'اہم و منتخب کتابیں' }}
                </h2>
                <span class="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full en-font">
                  Featured
                </span>
              </div>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
              <BookCard 
                v-for="book in featuredBooks" 
                :key="'featured-' + book.id"
                :book="book"
                @select-book="openBookModal"
                @read-book="openReader"
                @download-book="downloadBook"
              />
            </div>
          </section>

          <!-- SECTION 4: کتب کے زمرہ جات (Categories Quick Access) -->
          <section class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div class="border-b border-gray-200 pb-3 mb-4 flex items-center justify-between">
              <h3 class="text-lg font-bold text-[#0c5332] font-serif flex items-center gap-2">
                <i class="fa-solid fa-layer-group text-[#d4af37]"></i>
                <span>{{ siteSettings.categoriesSectionTitle || 'موضوعاتی فہرست و لائبریری سیکشنز' }}</span>
              </h3>
              <span class="text-xs text-gray-500">{{ siteSettings.categoriesSectionSubtitle || 'اپنی پسندیدہ موضوع کے مطابق کتب تلاش کریں' }}</span>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              <button 
                v-for="cat in categories" 
                :key="'cat-btn-' + cat.name"
                @click="handleCategorySelect(cat.name)"
                class="text-right p-3 rounded-lg border border-gray-200 hover:border-[#0c5332] hover:bg-emerald-50/50 transition group flex flex-col justify-between"
              >
                <div class="flex items-center justify-between mb-2">
                  <span class="w-8 h-8 rounded-full bg-emerald-100 text-[#0c5332] flex items-center justify-center text-xs group-hover:bg-[#0c5332] group-hover:text-white transition">
                    <i class="fa-solid fa-book"></i>
                  </span>
                  <span class="text-[11px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full en-font group-hover:bg-emerald-200 group-hover:text-[#0c5332]">
                    {{ cat.count }}
                  </span>
                </div>
                <span class="text-xs font-bold text-gray-800 group-hover:text-[#0c5332] leading-tight line-clamp-1">
                  {{ cat.name }}
                </span>
              </button>
            </div>
          </section>

          <!-- SECTION 5: مسئلہ رپورٹ کریں (Report an issue form matching KitaboSunnat) -->
          <section class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div class="md:col-span-5 space-y-2">
                <h3 class="text-xl font-bold font-serif text-[#0c5332] flex items-center gap-2">
                  <i class="fa-solid fa-headset text-[#d4af37]"></i>
                  <span>{{ siteSettings.issueBoxTitle || 'ویب سائٹ یا پی ڈی ایف سے متعلق مسئلہ رپورٹ کریں' }}</span>
                </h3>
                <p class="text-xs text-gray-600 leading-relaxed">
                  {{ siteSettings.issueBoxDesc || 'اگر آپ کو کسی کتاب کی پی ڈی ایف فائل کھولنے، ڈاؤن لوڈ کرنے یا صفحات کے پڑھنے میں کوئی دشواری پیش آئے تو برائے مہربانی ہمیں مطلع فرمائیں۔' }}
                </p>
                <div class="pt-2 text-xs text-emerald-800 font-semibold flex items-center gap-2">
                  <i class="fa-solid fa-circle-check text-emerald-600"></i>
                  <span>ہماری ٹیم فوری طور پر فائل کی تصدیق کر کے مسئلہ حل کرے گی۔</span>
                </div>
              </div>

              <div class="md:col-span-7">
                <form @submit.prevent="submitIssueReport" class="space-y-3">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input 
                      type="text" 
                      v-model="issueForm.name"
                      placeholder="آپ کا نام" 
                      required
                      class="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:border-[#0c5332] outline-none"
                    />
                    <input 
                      type="email" 
                      v-model="issueForm.email"
                      placeholder="آپ کا ای میل" 
                      required
                      class="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:border-[#0c5332] outline-none"
                    />
                  </div>
                  <textarea 
                    v-model="issueForm.message"
                    rows="2" 
                    placeholder="مسئلہ کی تفصیل تحریر فرمائیں..."
                    required
                    class="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:border-[#0c5332] outline-none"
                  ></textarea>
                  <div class="flex justify-between items-center">
                    <span v-if="issueSent" class="text-xs text-emerald-700 font-bold">
                      رپورٹ موصول ہو گئی ہے، شکریہ!
                    </span>
                    <button type="submit" class="btn-primary-custom text-xs px-5 py-2 mr-auto">
                      <span>رپورٹ بھیجیں</span>
                      <i class="fa-solid fa-paper-plane text-xs"></i>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>

        </div>
      </main>

      <!-- Footer (All content editable from CMS) -->
      <Footer :settings="siteSettings" />
    </div>

    <!-- MODAL 1: BOOK DETAILS MODAL -->
    <BookModal 
      v-if="selectedBook"
      :book="selectedBook"
      @close="selectedBook = null"
      @read-book="openReaderFromModal"
      @download-book="downloadBook"
    />

    <!-- MODAL 2: IN-BROWSER PDF READER -->
    <PdfViewer 
      v-if="readingBook"
      :book="readingBook"
      @close="readingBook = null"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Header from './components/Header.vue';
import Banner from './components/Banner.vue';
import SearchBar from './components/SearchBar.vue';
import BookCard from './components/BookCard.vue';
import BookModal from './components/BookModal.vue';
import PdfViewer from './components/PdfViewer.vue';
import StatsSection from './components/StatsSection.vue';
import AdminPanel from './components/AdminPanel.vue';
import OwnerLogin from './components/OwnerLogin.vue';
import Footer from './components/Footer.vue';

const books = ref([]);
const categories = ref([]);
const stats = ref({
  totalBooks: 0,
  totalViews: 0,
  totalDownloads: 0,
  totalPages: 0,
  totalSizeFormatted: '0 MB'
});

const siteSettings = ref({});

const activeTab = ref('home');

// Routing: Check for #/admin or /admin
const currentRoute = ref(window.location.hash || window.location.pathname);
const isOwnerAuthenticated = ref(sessionStorage.getItem('owner_authenticated') === 'true');

const isAdminRoute = computed(() => {
  return currentRoute.value.includes('admin');
});

function updateRoute() {
  currentRoute.value = window.location.hash || window.location.pathname;
}

window.addEventListener('hashchange', updateRoute);
window.addEventListener('popstate', updateRoute);

function onOwnerLoginSuccess() {
  isOwnerAuthenticated.value = true;
  sessionStorage.setItem('owner_authenticated', 'true');
}

function onOwnerLogout() {
  isOwnerAuthenticated.value = false;
  sessionStorage.removeItem('owner_authenticated');
  window.location.hash = '';
  currentRoute.value = '/';
}

function goToPublicSite() {
  window.location.hash = '';
  currentRoute.value = '/';
}

const selectedBook = ref(null);
const readingBook = ref(null);

const selectedCategory = ref('all');
const searchKeyword = ref('');
const searchType = ref('all');
const specialFilter = ref('');

const scanNotice = ref('');

const issueForm = ref({ name: '', email: '', message: '' });
const issueSent = ref(false);

// Fetch settings from MongoDB
async function fetchSettings() {
  try {
    const res = await fetch('/api/settings');
    const data = await res.json();
    if (data.success && data.settings) {
      siteSettings.value = data.settings;
    }
  } catch (err) {
    console.error('Settings fetch error:', err);
  }
}

// Fetch all initial data
async function fetchAllData() {
  try {
    const [booksRes, catsRes, statsRes] = await Promise.all([
      fetch('/api/books'),
      fetch('/api/categories'),
      fetch('/api/stats'),
      fetchSettings()
    ]);

    const booksData = await booksRes.json();
    if (booksData.success) books.value = booksData.books;

    const catsData = await catsRes.json();
    if (catsData.success) categories.value = catsData.categories;

    const statsData = await statsRes.json();
    if (statsData.success) stats.value = statsData.stats;
  } catch (err) {
    console.error('Data fetch error:', err);
  }
}

onMounted(() => {
  fetchAllData();
});

// Computed displayed books based on active filters
const displayedBooks = computed(() => {
  let list = [...books.value];

  // Category filter
  if (selectedCategory.value && selectedCategory.value !== 'all') {
    list = list.filter(b => b.category === selectedCategory.value || b.subCategory === selectedCategory.value);
  }

  // Search keyword filter
  if (searchKeyword.value && searchKeyword.value.trim()) {
    const term = searchKeyword.value.trim().toLowerCase();
    const type = searchType.value;

    list = list.filter(b => {
      if (type === 'book') return b.title && b.title.toLowerCase().includes(term);
      if (type === 'author') return b.author && b.author.toLowerCase().includes(term);
      if (type === 'publisher') return b.publisher && b.publisher.toLowerCase().includes(term);
      if (type === 'number') return b.bookNumber && b.bookNumber.toLowerCase().includes(term);
      return (
        (b.title && b.title.toLowerCase().includes(term)) ||
        (b.author && b.author.toLowerCase().includes(term)) ||
        (b.publisher && b.publisher.toLowerCase().includes(term)) ||
        (b.bookNumber && b.bookNumber.toLowerCase().includes(term)) ||
        (b.description && b.description.toLowerCase().includes(term))
      );
    });
  }

  // Special filter (new or featured)
  if (specialFilter.value === 'new') {
    list = list.filter(b => b.isNew);
  } else if (specialFilter.value === 'featured') {
    list = list.filter(b => b.featured);
  }

  return list;
});

const featuredBooks = computed(() => {
  return books.value.filter(b => b.featured);
});

const filterTitle = computed(() => {
  if (specialFilter.value === 'new') return 'جديد ترین کتب';
  if (specialFilter.value === 'featured') return 'اہم و منتخب کتب';
  if (selectedCategory.value !== 'all') return `کتب موضوع: ${selectedCategory.value}`;
  if (searchKeyword.value) return `تلاش کے نتائج: "${searchKeyword.value}"`;
  return '';
});

// Navigation actions
function goHome() {
  activeTab.value = 'home';
  resetFilters();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goBooks() {
  activeTab.value = 'books';
  resetFilters();
  scrollToSection('latest-books-section');
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

function handleCategorySelect(catName) {
  selectedCategory.value = catName;
  specialFilter.value = '';
  scrollToSection('latest-books-section');
}

function handleSearch({ keyword, type }) {
  searchKeyword.value = keyword;
  searchType.value = type;
  scrollToSection('latest-books-section');
}

function handleSpecialFilter(type) {
  specialFilter.value = type;
  selectedCategory.value = 'all';
  searchKeyword.value = '';
  scrollToSection('latest-books-section');
}

function resetFilters() {
  selectedCategory.value = 'all';
  searchKeyword.value = '';
  specialFilter.value = '';
}

// Book interactions
function openBookModal(book) {
  selectedBook.value = book;
  fetch(`/api/books/${book.id}/view`, { method: 'POST' }).then(() => {
    book.views = (book.views || 0) + 1;
    stats.value.totalViews++;
  }).catch(() => {});
}

function openReader(book) {
  selectedBook.value = null;
  readingBook.value = book;
  fetch(`/api/books/${book.id}/view`, { method: 'POST' }).then(() => {
    book.views = (book.views || 0) + 1;
    stats.value.totalViews++;
  }).catch(() => {});
}

function openReaderFromModal(book) {
  selectedBook.value = null;
  readingBook.value = book;
}

function downloadBook(book) {
  fetch(`/api/books/${book.id}/download`, { method: 'POST' }).then(() => {
    book.downloads = (book.downloads || 0) + 1;
    stats.value.totalDownloads++;
  }).catch(() => {});

  const link = document.createElement('a');
  link.href = `/api/pdfs/${encodeURIComponent(book.filename)}?download=1`;
  link.download = book.filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

async function handleScanFolder() {
  try {
    scanNotice.value = 'فولڈر اسکین ہو رہا ہے، براہ کرم انتظار کریں...';
    const res = await fetch('/api/scan', { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      scanNotice.value = data.message;
      fetchAllData();
      setTimeout(() => {
        scanNotice.value = '';
      }, 6000);
    }
  } catch (err) {
    scanNotice.value = 'خرابی: ' + err.message;
  }
}

function submitIssueReport() {
  issueSent.value = true;
  issueForm.value = { name: '', email: '', message: '' };
  setTimeout(() => {
    issueSent.value = false;
  }, 5000);
}
</script>
