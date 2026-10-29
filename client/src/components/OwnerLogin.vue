<template>
  <div class="min-h-screen bg-gradient-to-br from-[#073a22] via-[#0c5332] to-[#073a22] flex items-center justify-center p-4">
    <!-- Geometric Background Texture -->
    <div class="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="loginPattern" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M25 0 L50 25 L25 50 L0 25 Z" fill="none" stroke="#d4af37" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#loginPattern)"/>
      </svg>
    </div>

    <!-- Login Card -->
    <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative z-10 border-2 border-[#d4af37]/40 animate-fade-in">
      <!-- Logo & Branding -->
      <div class="text-center mb-6">
        <div class="w-20 h-20 mx-auto rounded-2xl bg-white p-2 shadow-lg border border-[#d4af37]/50 flex items-center justify-center mb-3">
          <img src="/logo.png" alt="Urdu E-Books" class="w-full h-full object-contain" />
        </div>
        <h1 class="text-2xl font-bold text-[#0c5332] font-serif">مالک لاگ ان پورٹل</h1>
        <p class="text-xs text-gray-500 mt-1">صرف ویب سائٹ ایڈمنسٹریٹر کے لیے محفوظ رسائی</p>
      </div>

      <!-- Error Alert -->
      <div v-if="errorMessage" class="mb-4 bg-red-50 border border-red-300 text-red-700 px-3.5 py-2.5 rounded-lg text-xs flex items-center gap-2">
        <i class="fa-solid fa-triangle-exclamation text-red-500 text-sm"></i>
        <span>{{ errorMessage }}</span>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-4 text-xs">
        <div>
          <label class="block font-bold text-gray-700 mb-1">یوزر نیم (Username):</label>
          <div class="relative">
            <input 
              type="text" 
              v-model="username" 
              required
              placeholder="admin"
              class="w-full px-3.5 py-2.5 pr-9 border border-gray-300 rounded-lg focus:border-[#0c5332] focus:ring-1 focus:ring-[#0c5332] outline-none transition"
            />
            <i class="fa-solid fa-user absolute right-3 top-3 text-gray-400"></i>
          </div>
        </div>

        <div>
          <label class="block font-bold text-gray-700 mb-1">پاس ورڈ (Password):</label>
          <div class="relative">
            <input 
              :type="showPassword ? 'text' : 'password'" 
              v-model="password" 
              required
              placeholder="••••••••"
              class="w-full px-3.5 py-2.5 pr-9 pl-9 border border-gray-300 rounded-lg focus:border-[#0c5332] focus:ring-1 focus:ring-[#0c5332] outline-none transition"
            />
            <i class="fa-solid fa-lock absolute right-3 top-3 text-gray-400"></i>
            <button 
              type="button" 
              @click="showPassword = !showPassword"
              class="absolute left-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <i class="fa-solid" :class="showPassword ? 'fa-eye-slash' : 'fa-eye'"></i>
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          :disabled="loading"
          class="w-full btn-primary-custom justify-center py-2.5 text-sm font-bold shadow-md disabled:opacity-50 mt-2"
        >
          <i class="fa-solid fa-right-to-bracket"></i>
          <span>{{ loading ? 'تصدیق ہو رہی ہے...' : 'لاگ ان کریں' }}</span>
        </button>
      </form>

      <!-- Back Link -->
      <div class="mt-6 pt-4 border-t border-gray-200 text-center">
        <a 
          href="/" 
          class="text-xs text-emerald-800 hover:text-[#0c5332] hover:underline font-semibold flex items-center justify-center gap-1.5"
        >
          <i class="fa-solid fa-arrow-left"></i>
          <span>لائبریری کی عوامی ویب سائٹ پر جائیں</span>
        </a>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['login-success']);

const username = ref('');
const password = ref('');
const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref('');

async function handleLogin() {
  loading.value = true;
  errorMessage.value = '';

  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    });

    const data = await res.json();
    if (data.success) {
      sessionStorage.setItem('owner_authenticated', 'true');
      emit('login-success');
    } else {
      errorMessage.value = data.message || 'یوزر نیم یا پاس ورڈ غلط ہے!';
    }
  } catch (err) {
    // Fallback client check if offline or network hiccup
    if (username.value.trim() === 'admin' && password.value === 'admin123') {
      sessionStorage.setItem('owner_authenticated', 'true');
      emit('login-success');
    } else {
      errorMessage.value = 'لاگ ان کی معلومات درست نہیں ہیں!';
    }
  } finally {
    loading.value = false;
  }
}
</script>
