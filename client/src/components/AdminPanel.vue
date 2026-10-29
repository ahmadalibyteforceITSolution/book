<template>
  <div class="bg-gray-100 min-h-screen pb-16">
    <!-- Top Admin Bar -->
    <div class="bg-[#073a22] text-white py-4 px-6 border-b-2 border-[#d4af37] shadow-md sticky top-0 z-30">
      <div class="container mx-auto flex flex-wrap justify-between items-center gap-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-[#d4af37] text-[#073a22] flex items-center justify-center text-xl font-bold shadow">
            <i class="fa-solid fa-gauge-high"></i>
          </div>
          <div>
            <h1 class="text-xl font-bold font-serif flex items-center gap-2">
              <span>انتظامی پینل</span>
              <span class="text-xs bg-[#d4af37] text-[#073a22] px-2 py-0.5 rounded font-sans font-bold">Admin Panel</span>
            </h1>
            <p class="text-xs text-emerald-200">کتاب و سنت لائبریری - کتب کا مکمل انتظام اور فولڈر سنک</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button 
            @click="triggerFolderScan"
            :disabled="scanning"
            class="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 shadow disabled:opacity-50"
          >
            <i class="fa-solid fa-arrows-rotate" :class="scanning ? 'fa-spin' : ''"></i>
            <span>{{ scanning ? 'فولڈر اسکین ہو رہا ہے...' : '📁 فولڈر اسکین کریں (نئی پی ڈی ایف)' }}</span>
          </button>

          <button 
            @click="$emit('close-admin')"
            class="bg-[#d4af37] hover:bg-[#b89726] text-[#073a22] px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow"
          >
            <i class="fa-solid fa-arrow-right-from-bracket"></i>
            <span>لائبریری دیکھیں</span>
          </button>

          <button 
            @click="$emit('logout')"
            class="bg-red-600/90 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow"
            title="لاگ آؤٹ کریں"
          >
            <i class="fa-solid fa-power-off"></i>
            <span>لاگ آؤٹ</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Alert / Toast Message -->
    <div v-if="toastMessage" class="container mx-auto px-4 mt-4">
      <div 
        :class="toastType === 'success' ? 'bg-emerald-100 border-emerald-400 text-emerald-800' : 'bg-red-100 border-red-400 text-red-800'"
        class="border px-4 py-3 rounded-lg shadow-sm flex items-center justify-between animate-fade-in text-sm"
      >
        <span class="flex items-center gap-2 font-medium">
          <i class="fa-solid" :class="toastType === 'success' ? 'fa-circle-check text-emerald-600' : 'fa-circle-exclamation text-red-600'"></i>
          <span>{{ toastMessage }}</span>
        </span>
        <button @click="toastMessage = ''" class="text-gray-500 hover:text-gray-800"><i class="fa-solid fa-xmark"></i></button>
      </div>
    </div>

    <div class="container mx-auto px-4 mt-6 space-y-6">
      
      <!-- Stats Summary Cards -->
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
          <div class="w-12 h-12 rounded-lg bg-emerald-50 text-[#0c5332] flex items-center justify-center text-xl">
            <i class="fa-solid fa-book"></i>
          </div>
          <div>
            <span class="block text-2xl font-bold text-gray-800 en-font">{{ stats.totalBooks }}</span>
            <span class="text-xs text-gray-500 font-medium">کل کتابیں</span>
          </div>
        </div>

        <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
          <div class="w-12 h-12 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center text-xl">
            <i class="fa-solid fa-file-lines"></i>
          </div>
          <div>
            <span class="block text-2xl font-bold text-gray-800 en-font">{{ stats.totalPages }}</span>
            <span class="text-xs text-gray-500 font-medium">کل صفحات</span>
          </div>
        </div>

        <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
          <div class="w-12 h-12 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center text-xl">
            <i class="fa-solid fa-eye"></i>
          </div>
          <div>
            <span class="block text-2xl font-bold text-gray-800 en-font">{{ stats.totalViews }}</span>
            <span class="text-xs text-gray-500 font-medium">کل مشاہدات</span>
          </div>
        </div>

        <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
          <div class="w-12 h-12 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center text-xl">
            <i class="fa-solid fa-download"></i>
          </div>
          <div>
            <span class="block text-2xl font-bold text-gray-800 en-font">{{ stats.totalDownloads }}</span>
            <span class="text-xs text-gray-500 font-medium">کل ڈاؤن لوڈز</span>
          </div>
        </div>

        <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3 col-span-2 md:col-span-1">
          <div class="w-12 h-12 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center text-xl">
            <i class="fa-solid fa-hard-drive"></i>
          </div>
          <div>
            <span class="block text-2xl font-bold text-gray-800 en-font">{{ stats.totalSizeFormatted }}</span>
            <span class="text-xs text-gray-500 font-medium">پی ڈی ایف سائز</span>
          </div>
        </div>
      </div>

      <!-- Quick Action Tab buttons -->
      <div class="flex items-center justify-between flex-wrap gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
        <div class="flex items-center gap-2">
          <button 
            @click="activeAdminTab = 'list'"
            :class="activeAdminTab === 'list' ? 'bg-[#0c5332] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
            class="px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
          >
            <i class="fa-solid fa-table-list"></i>
            <span>کتب کی فہرست و ترمیم ({{ books.length }})</span>
          </button>

          <button 
            @click="activeAdminTab = 'add'"
            :class="activeAdminTab === 'add' ? 'bg-[#0c5332] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
            class="px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
          >
            <i class="fa-solid fa-plus-circle text-[#d4af37]"></i>
            <span>نئی کتاب شامل کریں</span>
          </button>

          <button 
            @click="activeAdminTab = 'cms'"
            :class="activeAdminTab === 'cms' ? 'bg-[#0c5332] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
            class="px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
          >
            <i class="fa-solid fa-sliders text-[#d4af37]"></i>
            <span>ویب سائٹ کا مواد تبدیل کریں (CMS)</span>
          </button>
        </div>

        <!-- Search Bar in Admin -->
        <div class="w-full sm:w-64 relative">
          <input 
            type="text" 
            v-model="adminSearch"
            placeholder="کتاب، مصنف یا نمبر تلاش کریں..."
            class="w-full text-xs px-3 py-2 pr-8 border border-gray-300 rounded-md outline-none focus:border-[#0c5332]"
          />
          <i class="fa-solid fa-magnifying-glass absolute right-2.5 top-2.5 text-gray-400 text-xs"></i>
        </div>
      </div>

      <!-- TAB 1: ADD BOOK FORM -->
      <div v-if="activeAdminTab === 'add'" class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 animate-fade-in">
        <div class="border-b border-gray-200 pb-3 mb-5 flex justify-between items-center">
          <div>
            <h2 class="text-lg font-bold text-[#0c5332] flex items-center gap-2">
              <i class="fa-solid fa-book-medical text-[#d4af37]"></i>
              <span>نئی اسلامی کتاب لائبریری میں شامل کریں</span>
            </h2>
            <p class="text-xs text-gray-500 mt-0.5">کتاب کی معلومات اور پی ڈی ایف فائل فراہم کیجیے</p>
          </div>
          <button @click="activeAdminTab = 'list'" class="text-xs text-gray-500 hover:text-gray-800">
            فہرست پر جائیں &larr;
          </button>
        </div>

        <form @submit.prevent="submitNewBook" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Book Title -->
            <div class="space-y-1">
              <label class="block text-xs font-bold text-gray-700">کتاب کا مکمل نام (اردو میں) *</label>
              <input 
                type="text" 
                v-model="newBook.title" 
                required 
                placeholder="مثلاً: بچوں کے لیے احادیث، نماز نبوی ﷺ، وغیرہ"
                class="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:border-[#0c5332] focus:ring-1 focus:ring-[#0c5332] outline-none"
              />
            </div>

            <!-- Author -->
            <div class="space-y-1">
              <label class="block text-xs font-bold text-gray-700">مصنف / مؤلف کا نام *</label>
              <input 
                type="text" 
                v-model="newBook.author" 
                required 
                placeholder="مثلاً: حافظ محمد اسلم، مولانا عبدالرحمن"
                class="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:border-[#0c5332] outline-none"
              />
            </div>

            <!-- Publisher -->
            <div class="space-y-1">
              <label class="block text-xs font-bold text-gray-700">ناشر / اشاعت کا ادارہ</label>
              <input 
                type="text" 
                v-model="newBook.publisher" 
                placeholder="مکتبہ دارالسلام، مکتبہ قدوسیہ، وغیرہ"
                class="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:border-[#0c5332] outline-none"
              />
            </div>

            <!-- Category -->
            <div class="space-y-1">
              <label class="block text-xs font-bold text-gray-700">موضوع / زمرہ *</label>
              <select 
                v-model="newBook.category"
                class="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:border-[#0c5332] outline-none bg-white"
              >
                <option value="حدیث و علوم حدیث">حدیث و علوم حدیث</option>
                <option value="قرآن و علوم قرآن">قرآن و علوم قرآن</option>
                <option value="عقیدہ و منہج">عقیدہ و منہج</option>
                <option value="عبادات و معاملات">عبادات و معاملات</option>
                <option value="سیرت و سوانح">سیرت و سوانح</option>
                <option value="اصلاح معاشرہ">اصلاح معاشرہ</option>
                <option value="تربیت اولاد">تربیت اولاد</option>
                <option value="بچوں کی کتب">بچوں کی کتب</option>
                <option value="دعائیں و اذکار">دعائیں و اذکار</option>
                <option value="متفرق کتب">متفرق کتب</option>
              </select>
            </div>

            <!-- SubCategory -->
            <div class="space-y-1">
              <label class="block text-xs font-bold text-gray-700">ذیلی موضوع (Sub-Category)</label>
              <input 
                type="text" 
                v-model="newBook.subCategory" 
                placeholder="مثلاً: آداب و اخلاق، صحابہ کرام، دعائیں"
                class="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:border-[#0c5332] outline-none"
              />
            </div>

            <!-- Book Number -->
            <div class="space-y-1">
              <label class="block text-xs font-bold text-gray-700">کتاب کا نمبر / کوڈ</label>
              <input 
                type="text" 
                v-model="newBook.bookNumber" 
                placeholder="#7975"
                class="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:border-[#0c5332] outline-none"
              />
            </div>

            <!-- Pages -->
            <div class="space-y-1">
              <label class="block text-xs font-bold text-gray-700">کل صفحات</label>
              <input 
                type="number" 
                v-model="newBook.pages" 
                placeholder="مثلاً: 64"
                class="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:border-[#0c5332] outline-none"
              />
            </div>

            <!-- PDF File Selection / Upload -->
            <div class="space-y-1">
              <label class="block text-xs font-bold text-gray-700">پی ڈی ایف فائل کا انتخاب کریں *</label>
              <input 
                type="file" 
                accept=".pdf"
                @change="handlePdfUpload"
                class="w-full text-xs text-gray-600 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-emerald-100 file:text-[#0c5332] hover:file:bg-emerald-200"
              />
              <p class="text-[10px] text-gray-400">یا فولڈر میں فائل ڈال کر "فولڈر اسکین" کریں</p>
            </div>
          </div>

          <!-- Description / Tabsarah -->
          <div class="space-y-1">
            <label class="block text-xs font-bold text-gray-700">تبصرہ و تعارف کتاب (Urdu Description)</label>
            <textarea 
              v-model="newBook.description"
              rows="3"
              placeholder="کتاب کا تفصیلی خلاصہ، موضوع، اہم ابواب اور قاری کے لیے افادیت..."
              class="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:border-[#0c5332] outline-none"
            ></textarea>
          </div>

          <!-- Flags -->
          <div class="flex items-center gap-6 pt-2 text-xs text-gray-700">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" v-model="newBook.isNew" class="w-4 h-4 text-[#0c5332] rounded" />
              <span class="font-bold">نئی کتاب (New Badge دکھائیں)</span>
            </label>

            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" v-model="newBook.featured" class="w-4 h-4 text-[#0c5332] rounded" />
              <span class="font-bold">اہم / منتخب کتاب (Featured میں دکھائیں)</span>
            </label>
          </div>

          <!-- Submit Buttons -->
          <div class="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
            <button 
              type="button" 
              @click="activeAdminTab = 'list'"
              class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-xs font-bold transition"
            >
              منسوخ کریں
            </button>

            <button 
              type="submit" 
              :disabled="submitting"
              class="btn-primary-custom px-6 py-2 text-xs shadow-md disabled:opacity-50"
            >
              <i class="fa-solid fa-check"></i>
              <span>{{ submitting ? 'محفوظ ہو رہی ہے...' : 'کتاب شامل کریں' }}</span>
            </button>
          </div>
        </form>
      </div>

      <!-- TAB 2: BOOKS TABLE & MANAGEMENT -->
      <div v-else-if="activeAdminTab === 'list'" class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-fade-in">
        <div class="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 flex-wrap gap-2">
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-list-check text-[#0c5332]"></i>
            <span class="font-bold text-sm text-gray-800">موجودہ کتب کا ریکارڈ (کل کتب: {{ filteredBooks.length }})</span>
          </div>
          <span class="text-xs text-gray-500">تمام پی ڈی ایف فائلیں آپ کے کمپیوٹر کے ورک اسپیس میں محفوظ ہیں</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-right text-xs">
            <thead class="bg-gray-100 text-gray-700 font-bold border-b border-gray-200">
              <tr>
                <th class="p-3 w-16 text-center">سرورق</th>
                <th class="p-3">کتاب کا نام و نمبر</th>
                <th class="p-3">مصنف و ناشر</th>
                <th class="p-3">موضوع / زمرہ</th>
                <th class="p-3 text-center">صفحات / سائز</th>
                <th class="p-3 text-center">مشاہدات</th>
                <th class="p-3 text-center w-36">کارروائی</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="b in filteredBooks" :key="b.id" class="hover:bg-emerald-50/40 transition">
                <!-- Cover -->
                <td class="p-2.5 text-center">
                  <img 
                    :src="'/api/covers/' + encodeURIComponent(b.cover || (b.filename.replace(/\.pdf$/i, '.jpg')))" 
                    :alt="b.title"
                    class="w-10 h-14 object-cover rounded shadow-sm mx-auto border border-gray-200 cursor-pointer"
                    @click="$emit('preview-book', b)"
                  />
                </td>

                <!-- Title & Book Number -->
                <td class="p-3">
                  <div class="font-bold text-gray-900 leading-snug line-clamp-1" :title="b.title">
                    {{ b.title }}
                  </div>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="bg-emerald-100 text-[#0c5332] text-[10px] font-bold px-2 py-0.5 rounded font-sans">
                      {{ b.bookNumber || ('#' + b.id) }}
                    </span>
                    <span class="text-gray-400 text-[10px] en-font truncate max-w-[150px]">{{ b.filename }}</span>
                  </div>
                </td>

                <!-- Author & Publisher -->
                <td class="p-3">
                  <span class="font-semibold text-gray-800 block truncate">{{ b.author }}</span>
                  <span class="text-gray-400 text-[11px] block truncate">{{ b.publisher }}</span>
                </td>

                <!-- Category -->
                <td class="p-3">
                  <span class="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-[11px] font-medium">
                    {{ b.category }}
                  </span>
                </td>

                <!-- Pages & Size -->
                <td class="p-3 text-center">
                  <span class="block font-bold text-gray-800 en-font">{{ b.pages }} ص</span>
                  <span class="text-gray-400 text-[10px] en-font">{{ b.sizeFormatted }}</span>
                </td>

                <!-- Views -->
                <td class="p-3 text-center">
                  <span class="font-bold text-emerald-700 en-font">{{ b.views || 0 }}</span>
                  <span class="block text-[10px] text-gray-400">مشاہدات</span>
                </td>

                <!-- Actions -->
                <td class="p-3 text-center space-x-1 space-x-reverse whitespace-nowrap">
                  <!-- Read -->
                  <button 
                    @click="$emit('read-book', b)"
                    class="p-1.5 bg-emerald-50 text-[#0c5332] hover:bg-emerald-100 rounded transition"
                    title="مطالعہ کریں"
                  >
                    <i class="fa-solid fa-book-open"></i>
                  </button>

                  <!-- Edit -->
                  <button 
                    @click="openEditModal(b)"
                    class="p-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded transition"
                    title="ترمیم کریں"
                  >
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>

                  <!-- Delete -->
                  <button 
                    @click="confirmDelete(b)"
                    class="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded transition"
                    title="حذف کریں"
                  >
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 3: WEBSITE CONTENT CMS (HEADER, BANNER, SECTIONS, FOOTER) -->
      <div v-else-if="activeAdminTab === 'cms'" class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 animate-fade-in space-y-6">
        <div class="border-b border-gray-200 pb-3 flex justify-between items-center">
          <div>
            <h2 class="text-lg font-bold text-[#0c5332] flex items-center gap-2">
              <i class="fa-solid fa-pen-ruler text-[#d4af37]"></i>
              <span>ویب سائٹ مواد اور ٹیکسٹ سیٹنگز (CMS Content Editor)</span>
            </h2>
            <p class="text-xs text-gray-500 mt-0.5">ہیڈر، بینر، تمام سیکشنز اور فوٹر کا مواد یہاں سے تبدیل کریں - فوری طور پر MongoDB میں محفوظ ہوگا</p>
          </div>
          <button @click="saveCmsSettings" :disabled="savingCms" class="btn-primary-custom px-5 py-2 text-xs shadow-md disabled:opacity-50">
            <i class="fa-solid fa-floppy-disk"></i>
            <span>{{ savingCms ? 'محفوظ ہو رہا ہے...' : 'سیٹنگز محفوظ کریں' }}</span>
          </button>
        </div>

        <form @submit.prevent="saveCmsSettings" class="space-y-6 text-xs">
          <!-- 1. HEADER SECTION -->
          <div class="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
            <h3 class="font-bold text-sm text-[#0c5332] flex items-center gap-2 border-b pb-2">
              <i class="fa-solid fa-window-maximize text-emerald-600"></i>
              <span>1. ہیڈر و برانڈنگ سیٹنگز (Header & Branding)</span>
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label class="block font-bold text-gray-700 mb-1">ویب سائٹ کا عنوان (Title):</label>
                <input type="text" v-model="cmsForm.siteTitle" class="w-full px-3 py-2 border rounded outline-none focus:border-[#0c5332]" />
              </div>
              <div>
                <label class="block font-bold text-gray-700 mb-1">بیج متن (Badge Text):</label>
                <input type="text" v-model="cmsForm.siteBadge" class="w-full px-3 py-2 border rounded outline-none focus:border-[#0c5332]" />
              </div>
              <div>
                <label class="block font-bold text-gray-700 mb-1">ذیلی ٹیگ لائن (Tagline):</label>
                <input type="text" v-model="cmsForm.siteTagline" class="w-full px-3 py-2 border rounded outline-none focus:border-[#0c5332]" />
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label class="block font-bold text-gray-700 mb-1">ٹاپ بار فون نمبر:</label>
                <input type="text" v-model="cmsForm.phone" class="w-full px-3 py-2 border rounded outline-none focus:border-[#0c5332]" />
              </div>
              <div>
                <label class="block font-bold text-gray-700 mb-1">ٹاپ بار ای میل:</label>
                <input type="text" v-model="cmsForm.email" class="w-full px-3 py-2 border rounded outline-none focus:border-[#0c5332]" />
              </div>
              <div>
                <label class="block font-bold text-gray-700 mb-1">ٹاپ بار عربی نوٹس:</label>
                <input type="text" v-model="cmsForm.topNotice" class="w-full px-3 py-2 border rounded outline-none focus:border-[#0c5332]" />
              </div>
            </div>
          </div>

          <!-- 2. HERO BANNER SECTION -->
          <div class="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
            <h3 class="font-bold text-sm text-[#0c5332] flex items-center gap-2 border-b pb-2">
              <i class="fa-solid fa-bullhorn text-amber-600"></i>
              <span>2. ہیرو بینر مواد (Hero Banner Content)</span>
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label class="block font-bold text-gray-700 mb-1">اوپری بیج ٹیگ لائن:</label>
                <input type="text" v-model="cmsForm.bannerTag" class="w-full px-3 py-2 border rounded outline-none focus:border-[#0c5332]" />
              </div>
              <div>
                <label class="block font-bold text-gray-700 mb-1">مرکزی عنوان (Heading):</label>
                <input type="text" v-model="cmsForm.bannerTitle" class="w-full px-3 py-2 border rounded outline-none focus:border-[#0c5332]" />
              </div>
              <div>
                <label class="block font-bold text-gray-700 mb-1">ہائی لائٹ لفظ (Highlight):</label>
                <input type="text" v-model="cmsForm.bannerHighlight" class="w-full px-3 py-2 border rounded outline-none focus:border-[#0c5332]" />
              </div>
              <div>
                <label class="block font-bold text-gray-700 mb-1">عنوان کا لاحقہ (Suffix):</label>
                <input type="text" v-model="cmsForm.bannerSuffix" class="w-full px-3 py-2 border rounded outline-none focus:border-[#0c5332]" />
              </div>
            </div>
            <div>
              <label class="block font-bold text-gray-700 mb-1">تفصیلی تعارفی پیراگراف (Hero Description):</label>
              <textarea v-model="cmsForm.bannerDescription" rows="2" class="w-full px-3 py-2 border rounded outline-none focus:border-[#0c5332]"></textarea>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label class="block font-bold text-gray-700 mb-1">کارڈ اوپر والا بیج:</label>
                <input type="text" v-model="cmsForm.bannerCardBadge" class="w-full px-3 py-2 border rounded outline-none focus:border-[#0c5332]" />
              </div>
              <div>
                <label class="block font-bold text-gray-700 mb-1">کارڈ عنوان:</label>
                <input type="text" v-model="cmsForm.bannerCardTitle" class="w-full px-3 py-2 border rounded outline-none focus:border-[#0c5332]" />
              </div>
              <div>
                <label class="block font-bold text-gray-700 mb-1">کارڈ ذیلی عنوان:</label>
                <input type="text" v-model="cmsForm.bannerCardSubtitle" class="w-full px-3 py-2 border rounded outline-none focus:border-[#0c5332]" />
              </div>
            </div>
          </div>

          <!-- 3. SECTIONS HEADINGS -->
          <div class="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
            <h3 class="font-bold text-sm text-[#0c5332] flex items-center gap-2 border-b pb-2">
              <i class="fa-solid fa-heading text-purple-600"></i>
              <span>3. سیکشنز کے عنوانات (Page Sections Headings)</span>
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-gray-700 mb-1">جدید کتب سیکشن کا عنوان:</label>
                <input type="text" v-model="cmsForm.latestBooksTitle" class="w-full px-3 py-2 border rounded outline-none focus:border-[#0c5332]" />
              </div>
              <div>
                <label class="block font-bold text-gray-700 mb-1">اہم و منتخب کتب کا عنوان:</label>
                <input type="text" v-model="cmsForm.featuredBooksTitle" class="w-full px-3 py-2 border rounded outline-none focus:border-[#0c5332]" />
              </div>
              <div>
                <label class="block font-bold text-gray-700 mb-1">موضوعاتی فہرست سیکشن کا عنوان:</label>
                <input type="text" v-model="cmsForm.categoriesSectionTitle" class="w-full px-3 py-2 border rounded outline-none focus:border-[#0c5332]" />
              </div>
              <div>
                <label class="block font-bold text-gray-700 mb-1">موضوعاتی سیکشن کی ذیلی تفصیل:</label>
                <input type="text" v-model="cmsForm.categoriesSectionSubtitle" class="w-full px-3 py-2 border rounded outline-none focus:border-[#0c5332]" />
              </div>
            </div>
          </div>

          <!-- 4. FOOTER & SOCIAL LINKS -->
          <div class="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
            <h3 class="font-bold text-sm text-[#0c5332] flex items-center gap-2 border-b pb-2">
              <i class="fa-solid fa-shoe-prints text-blue-600"></i>
              <span>4. فوٹر اور سوشل لنکس (Footer & Social Media)</span>
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-gray-700 mb-1">فوٹر تعارف کا عنوان:</label>
                <input type="text" v-model="cmsForm.footerAboutTitle" class="w-full px-3 py-2 border rounded outline-none focus:border-[#0c5332]" />
              </div>
              <div>
                <label class="block font-bold text-gray-700 mb-1">فوٹر فزیکل ایڈریس (پتہ):</label>
                <input type="text" v-model="cmsForm.footerAddress" class="w-full px-3 py-2 border rounded outline-none focus:border-[#0c5332]" />
              </div>
            </div>
            <div>
              <label class="block font-bold text-gray-700 mb-1">فوٹر تفصیلی تعارفی پیراگراف:</label>
              <textarea v-model="cmsForm.footerAboutDesc" rows="2" class="w-full px-3 py-2 border rounded outline-none focus:border-[#0c5332]"></textarea>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label class="block font-bold text-gray-700 mb-1">فوٹر رابطہ فون:</label>
                <input type="text" v-model="cmsForm.footerPhone" class="w-full px-3 py-2 border rounded outline-none focus:border-[#0c5332]" />
              </div>
              <div>
                <label class="block font-bold text-gray-700 mb-1">فوٹر ای میل ایڈریس:</label>
                <input type="text" v-model="cmsForm.footerEmail" class="w-full px-3 py-2 border rounded outline-none focus:border-[#0c5332]" />
              </div>
              <div>
                <label class="block font-bold text-gray-700 mb-1">کاپی رائٹ متن (Copyright):</label>
                <input type="text" v-model="cmsForm.copyrightText" class="w-full px-3 py-2 border rounded outline-none focus:border-[#0c5332]" />
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div>
                <label class="block font-bold text-gray-700 mb-1"><i class="fa-brands fa-facebook text-blue-600"></i> فیس بک لنک:</label>
                <input type="text" v-model="cmsForm.facebookUrl" class="w-full px-3 py-2 border rounded outline-none focus:border-[#0c5332]" />
              </div>
              <div>
                <label class="block font-bold text-gray-700 mb-1"><i class="fa-brands fa-youtube text-red-600"></i> یوٹیوب لنک:</label>
                <input type="text" v-model="cmsForm.youtubeUrl" class="w-full px-3 py-2 border rounded outline-none focus:border-[#0c5332]" />
              </div>
              <div>
                <label class="block font-bold text-gray-700 mb-1"><i class="fa-brands fa-whatsapp text-green-600"></i> واٹس ایپ لنک:</label>
                <input type="text" v-model="cmsForm.whatsappUrl" class="w-full px-3 py-2 border rounded outline-none focus:border-[#0c5332]" />
              </div>
            </div>
          </div>

          <!-- Bottom Save Button -->
          <div class="pt-4 border-t flex justify-end">
            <button type="submit" :disabled="savingCms" class="btn-primary-custom px-8 py-3 text-sm font-bold shadow-lg disabled:opacity-50">
              <i class="fa-solid fa-check"></i>
              <span>{{ savingCms ? 'ڈیٹا بیس میں محفوظ ہو رہا ہے...' : 'تمام مواد ڈیٹا بیس میں محفوظ کریں' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- EDIT BOOK MODAL -->
    <div v-if="editingBook" class="modal-overlay" @click.self="editingBook = null">
      <div class="bg-white rounded-xl shadow-2xl max-w-xl w-full p-6 animate-fade-in border border-gray-200">
        <div class="flex justify-between items-center border-b pb-3 mb-4">
          <h3 class="font-bold text-base text-[#0c5332] flex items-center gap-2">
            <i class="fa-solid fa-pen-to-square text-[#d4af37]"></i>
            <span>کتاب کی معلومات تبدیل کریں</span>
          </h3>
          <button @click="editingBook = null" class="text-gray-400 hover:text-gray-600"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <form @submit.prevent="saveEditBook" class="space-y-3 text-xs">
          <div>
            <label class="block font-bold text-gray-700 mb-1">کتاب کا نام:</label>
            <input type="text" v-model="editForm.title" class="w-full px-3 py-2 border rounded outline-none focus:border-[#0c5332]" required />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-gray-700 mb-1">مصنف:</label>
              <input type="text" v-model="editForm.author" class="w-full px-3 py-2 border rounded outline-none focus:border-[#0c5332]" required />
            </div>
            <div>
              <label class="block font-bold text-gray-700 mb-1">ناشر:</label>
              <input type="text" v-model="editForm.publisher" class="w-full px-3 py-2 border rounded outline-none focus:border-[#0c5332]" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-gray-700 mb-1">زمرہ / موضوع:</label>
              <input type="text" v-model="editForm.category" class="w-full px-3 py-2 border rounded outline-none focus:border-[#0c5332]" required />
            </div>
            <div>
              <label class="block font-bold text-gray-700 mb-1">ذیلی موضوع (SubCategory):</label>
              <input type="text" v-model="editForm.subCategory" class="w-full px-3 py-2 border rounded outline-none focus:border-[#0c5332]" />
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="block font-bold text-gray-700 mb-1">کتاب نمبر:</label>
              <input type="text" v-model="editForm.bookNumber" class="w-full px-3 py-2 border rounded outline-none focus:border-[#0c5332]" />
            </div>
            <div>
              <label class="block font-bold text-gray-700 mb-1">کل صفحات:</label>
              <input type="number" v-model="editForm.pages" class="w-full px-3 py-2 border rounded outline-none focus:border-[#0c5332]" />
            </div>
            <div>
              <label class="block font-bold text-gray-700 mb-1">فائل سائز لیبل:</label>
              <input type="text" v-model="editForm.sizeFormatted" class="w-full px-3 py-2 border rounded outline-none focus:border-[#0c5332]" />
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="block font-bold text-gray-700 mb-1">مشاہدات (Views):</label>
              <input type="number" v-model="editForm.views" class="w-full px-3 py-2 border rounded outline-none focus:border-[#0c5332]" />
            </div>
            <div>
              <label class="block font-bold text-gray-700 mb-1">ڈاؤن لوڈز (Downloads):</label>
              <input type="number" v-model="editForm.downloads" class="w-full px-3 py-2 border rounded outline-none focus:border-[#0c5332]" />
            </div>
            <div>
              <label class="block font-bold text-gray-700 mb-1">تاریخ شمولیت:</label>
              <input type="text" v-model="editForm.dateAdded" class="w-full px-3 py-2 border rounded outline-none focus:border-[#0c5332]" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-gray-700 mb-1">پی ڈی ایف فائل کا نام:</label>
              <input type="text" v-model="editForm.filename" class="w-full px-3 py-2 border rounded outline-none focus:border-[#0c5332]" />
            </div>
            <div>
              <label class="block font-bold text-gray-700 mb-1">سرورق کا نام (Cover Image):</label>
              <input type="text" v-model="editForm.cover" class="w-full px-3 py-2 border rounded outline-none focus:border-[#0c5332]" />
            </div>
          </div>

          <div>
            <label class="block font-bold text-gray-700 mb-1">تبصرہ و تعارف (Description):</label>
            <textarea v-model="editForm.description" rows="3" class="w-full px-3 py-2 border rounded outline-none focus:border-[#0c5332]"></textarea>
          </div>

          <div class="flex items-center gap-4 pt-2">
            <label class="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" v-model="editForm.isNew" class="w-3.5 h-3.5 text-[#0c5332]" />
              <span>نئی کتاب (New Badge)</span>
            </label>
            <label class="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" v-model="editForm.featured" class="w-3.5 h-3.5 text-[#0c5332]" />
              <span>منتخب کتاب (Featured Badge)</span>
            </label>
          </div>

          <div class="pt-4 border-t flex justify-end gap-2">
            <button type="button" @click="editingBook = null" class="px-4 py-2 bg-gray-200 rounded font-bold">منسوخ</button>
            <button type="submit" class="btn-primary-custom px-5 py-2 text-xs">تبدیلیاں ڈیٹا بیس میں محفوظ کریں</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  books: {
    type: Array,
    default: () => []
  },
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

const emit = defineEmits(['close-admin', 'logout', 'refresh-books', 'refresh-settings', 'read-book', 'preview-book']);

const activeAdminTab = ref('list');
const adminSearch = ref('');
const scanning = ref(false);
const submitting = ref(false);
const savingCms = ref(false);
const toastMessage = ref('');
const toastType = ref('success');

const cmsForm = ref({ ...props.settings });

watch(() => props.settings, (newVal) => {
  if (newVal && Object.keys(newVal).length > 0) {
    cmsForm.value = { ...newVal };
  }
}, { immediate: true, deep: true });

async function saveCmsSettings() {
  savingCms.value = true;
  try {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cmsForm.value)
    });
    const data = await res.json();
    if (data.success) {
      showToast(data.message || 'سیٹنگز اور مواد محفوظ ہو گیا!', 'success');
      emit('refresh-settings');
    } else {
      showToast(data.message || 'سیٹنگز محفوظ نہ ہو سکی', 'error');
    }
  } catch (err) {
    showToast('خرابی: ' + err.message, 'error');
  } finally {
    savingCms.value = false;
  }
}

const selectedPdfFile = ref(null);

const newBook = ref({
  title: '',
  author: '',
  publisher: 'مکتبہ کتاب و سنت',
  category: 'حدیث و علوم حدیث',
  subCategory: 'عام',
  bookNumber: '',
  pages: 0,
  description: '',
  isNew: true,
  featured: true
});

const editingBook = ref(null);
const editForm = ref({});

function handlePdfUpload(e) {
  if (e.target.files && e.target.files[0]) {
    selectedPdfFile.value = e.target.files[0];
    if (!newBook.value.title) {
      newBook.value.title = selectedPdfFile.value.name.replace(/\.pdf$/i, '');
    }
  }
}

const filteredBooks = computed(() => {
  if (!adminSearch.value.trim()) return props.books;
  const q = adminSearch.value.toLowerCase().trim();
  return props.books.filter(b => 
    (b.title && b.title.toLowerCase().includes(q)) ||
    (b.author && b.author.toLowerCase().includes(q)) ||
    (b.bookNumber && b.bookNumber.toLowerCase().includes(q)) ||
    (b.category && b.category.toLowerCase().includes(q))
  );
});

async function triggerFolderScan() {
  scanning.value = true;
  try {
    const res = await fetch('/api/scan', { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      showToast(data.message, 'success');
      emit('refresh-books');
    } else {
      showToast(data.message || 'اسکین میں خرابی', 'error');
    }
  } catch (err) {
    showToast('سرور سے رابطہ نہ ہو سکا: ' + err.message, 'error');
  } finally {
    scanning.value = false;
  }
}

async function submitNewBook() {
  submitting.value = true;
  try {
    const formData = new FormData();
    if (selectedPdfFile.value) {
      formData.append('pdf', selectedPdfFile.value);
    } else {
      // Must have filename if no file uploaded
      showToast('براہ کرم پی ڈی ایف فائل منتخب کریں', 'error');
      submitting.value = false;
      return;
    }

    formData.append('title', newBook.value.title);
    formData.append('author', newBook.value.author);
    formData.append('publisher', newBook.value.publisher);
    formData.append('category', newBook.value.category);
    formData.append('subCategory', newBook.value.subCategory);
    formData.append('bookNumber', newBook.value.bookNumber);
    formData.append('pages', newBook.value.pages || 0);
    formData.append('description', newBook.value.description);
    formData.append('isNew', newBook.value.isNew);
    formData.append('featured', newBook.value.featured);

    const res = await fetch('/api/books', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    if (data.success) {
      showToast('کتاب کامیابی سے لائبریری میں شامل ہو گئی ہے!', 'success');
      emit('refresh-books');
      activeAdminTab.value = 'list';
      // reset form
      newBook.value = {
        title: '',
        author: '',
        publisher: 'مکتبہ کتاب و سنت',
        category: 'حدیث و علوم حدیث',
        subCategory: 'عام',
        bookNumber: '',
        pages: 0,
        description: '',
        isNew: true,
        featured: true
      };
      selectedPdfFile.value = null;
    } else {
      showToast(data.message || 'کتاب شامل نہ ہو سکی', 'error');
    }
  } catch (err) {
    showToast('خرابی: ' + err.message, 'error');
  } finally {
    submitting.value = false;
  }
}

function openEditModal(book) {
  editingBook.value = book;
  editForm.value = { ...book };
}

async function saveEditBook() {
  try {
    const res = await fetch(`/api/books/${editingBook.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm.value)
    });
    const data = await res.json();
    if (data.success) {
      showToast('کتاب کی تبدیلیاں کامیابی سے محفوظ ہو گئیں!', 'success');
      editingBook.value = null;
      emit('refresh-books');
    } else {
      showToast(data.message || 'تبدیلی محفوظ نہ ہو سکی', 'error');
    }
  } catch (err) {
    showToast('خرابی: ' + err.message, 'error');
  }
}

async function confirmDelete(book) {
  if (confirm(`کیا آپ واقعی کتاب "${book.title}" کو لائبریری سے حذف کرنا چاہتے ہیں؟`)) {
    try {
      const res = await fetch(`/api/books/${book.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('کتاب حذف کر دی گئی ہے۔', 'success');
        emit('refresh-books');
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      showToast('خرابی: ' + err.message, 'error');
    }
  }
}

function showToast(msg, type = 'success') {
  toastMessage.value = msg;
  toastType.value = type;
  setTimeout(() => {
    toastMessage.value = '';
  }, 4000);
}
</script>
