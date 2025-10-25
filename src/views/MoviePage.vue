<template>
  <div class="bg-[#0e0e0e] min-h-screen text-gray-200 font-sans">
    <!-- HEADER (sama seperti punyamu) -->
<header class="bg-[#1c1c1c] shadow-md text-white fixed w-full z-50 border-b border-[#00aaff]">
      <main class="max-w-6xl mx-auto flex justify-between items-center px-4 py-3">
        <h1 class="text-3xl font-extrabold">
          <span class="text-white">LYNXX</span><span class="text-[#00aaff]">ANIME</span>
        </h1>

        <!-- MENU -->
        <nav class="hidden md:flex items-center space-x-6 text-sm font-semibold">
          <a href="/" class="hover:text-[#00aaff]  text-white ">HOME</a>
          <a href="/allanime" class="hover:text-[#00aaff]">ANIME LIST</a>
          <!-- <a href="#" class="hover:text-[#00aaff]">JADWAL RILIS</a> -->
          <a href="/movie" class="bg-[#00aaff] rounded-sm px-3 py-1 ">MOVIE ANIME</a>
          <!-- <a href="#" class="hover:text-[#00aaff]">GENRE LIST</a> -->
        </nav>

        <!-- SEARCH -->
        <div class="hidden md:flex bg-white rounded-sm overflow-hidden">
          <input
            v-model="search"
            @keyup.enter="searchAnime"
            type="text"
            placeholder="Search Anime ..."
            class="text-black px-3 py-1 outline-none w-56"
          />
          <button
            @click="searchAnime"
            class="bg-[#00aaff] px-3 hover:bg-[#0090e0] text-white text-sm"
          >
            🔍
          </button>
        </div>

        <!-- MOBILE MENU -->
        <button @click="menuOpen = !menuOpen" class="md:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </main>

      <!-- MENU MOBILE -->
      <transition name="fade">
        <nav v-if="menuOpen" class="bg-[#111] border-t border-[#00aaff] text-sm flex flex-col space-y-3 p-4 md:hidden">
          <a href="/" class="">HOME</a>
          <a href="/allanime">ANIME LIST</a>
          <a href="/movie" class="text-[#00aaff]">MOVIE ANIME</a>
          <div class="flex bg-white rounded-sm overflow-hidden">
            <input
              v-model="search"
              @keyup.enter="searchAnime"
              placeholder="Cari anime..."
              class="text-black px-3 py-1 outline-none w-full"
            />
            <button @click="searchAnime" class="bg-[#00aaff] px-3 hover:bg-[#0090e0] text-white text-sm">🔍</button>
          </div>
        </nav>
      </transition>
    </header>

    <!-- MAIN CONTENT -->
    <main class="max-w-6xl mx-auto pt-28 px-3">
      <div class="bg-[#00aaff] text-black text-center font-semibold py-2 rounded-sm">
        Situs resmi <span class="font-bold">LynxxAnime.best</span> — selain dari ini adalah situs palsu.
      </div>

      <!-- MOVIE SECTION -->
      <section class="mt-6 bg-[#1a1a1a] p-4 rounded-md shadow">
        <h2 class="bg-[#00aaff] text-black font-bold text-sm px-3 py-2 rounded-sm">
          Movie Anime
        </h2>

        <div v-if="loading" class="text-center flex justify-center py-10 ">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 items-center animate-spin"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
          </div>

        <div
          v-else
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3 mt-4"
        >
          <div
            v-for="(item, i) in latestData"
            :key="i"
            @click="openLatest(item.slug)"
            class="cursor-pointer bg-[#111] border border-gray-700 hover:border-[#00aaff] transition rounded-sm overflow-hidden"
          >
            <div class="relative">
              <img
                :src="item.poster"
                class="w-full h-48 object-cover"
                @error="(e) => (e.target.src = '/fallback.jpg')"
              />
              <div
                class="absolute top-1 left-1 bg-black/70 text-white text-[10px] px-1 rounded-sm"
              >
                Release: {{ item.release || '?' }}
              </div>
            </div>
            <div class="px-2 py-2 text-center">
              <h3 class="text-xs font-semibold truncate">{{ item.title }}</h3>
            </div>
          </div>
        </div>

        <!-- PAGINATION BUTTON -->
        <div class="text-center mt-6" v-if="!loadingMore">
          <button
            @click="loadMore"
            class="bg-[#00aaff] text-black font-semibold px-5 py-2 rounded hover:bg-[#0090e0] transition"
          >
            Load More
          </button>
        </div>
        <div v-else class="text-center mt-6 text-gray-400">
          Loading more...
        </div>
      </section>
    </main>

    <!-- FOOTER -->
    <footer class="text-center py-5 text-gray-400 text-sm border-t border-gray-700 mt-10">
      © 2025 <span class="text-[#00aaff]">LynxxAnime</span> — Semua Hak Dilindungi.
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import axios from "axios"
import { useRouter } from "vue-router"

const router = useRouter()
const menuOpen = ref(false)
const latestData = ref([])
const page = ref(1)
const loading = ref(true)
const loadingMore = ref(false)
const errorMsg = ref("")

async function getData() {
  try {
    const res = await axios.get(`https://www.sankavollerei.com/anime/stream/movie/page/${page.value}`)
    const newData = res.data.data || []

    // Jika ini halaman pertama → replace
    if (page.value === 1) {
      latestData.value = newData
    } else {
      // Jika load more → tambahkan ke list lama
      latestData.value = [...latestData.value, ...newData]
    }
  } catch (e) {
    console.error(e)
    errorMsg.value = "Gagal memuat data anime."
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

function openLatest(slug) {
  if (!slug) return
  router.push(`/anime/stream/episode/${slug}`)
}

function loadMore() {
  page.value++
  loadingMore.value = true
  getData()
}

onMounted(() => {
  getData()
})
</script>
