<template>
  <div class="bg-[#0e0e0e] min-h-screen text-gray-200 font-sans">
    <!-- HEADER -->
    <header class="bg-[#1c1c1c] shadow-md text-white fixed w-full z-50 border-b border-[#00aaff]">
      <main class="max-w-6xl mx-auto flex justify-between items-center px-4 py-3">
        <h1 class="text-3xl font-extrabold">
          <span class="text-white">LYNXX</span><span class="text-[#00aaff]">ANIME</span>
        </h1>

        <nav class="hidden md:flex items-center space-x-6 text-sm font-semibold">
          <a href="/" class="px-3 py-1 bg-[#00aaff] text-white rounded-sm">HOME</a>
          <a href="/allanime" class="hover:text-[#00aaff]">ANIME LIST</a>
          <a href="/movie" class="hover:text-[#00aaff]">MOVIE ANIME</a>
        </nav>

        <!-- SEARCH DESKTOP -->
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

        <!-- MOBILE MENU TOGGLE -->
        <button @click="menuOpen = !menuOpen" class="md:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </main>

      <!-- MOBILE MENU -->
      <transition name="fade">
        <nav v-if="menuOpen" class="bg-[#111] border-t border-[#00aaff] text-sm flex flex-col space-y-3 p-4 md:hidden">
          <a href="/" class="text-[#00aaff]">HOME</a>
          <a href="/allanime">ANIME LIST</a>
          <a href="/movie">MOVIE ANIME</a>
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
      <!-- INFO BOX -->
      <div class="bg-[#00aaff] text-black text-center font-semibold py-2 rounded-sm">
        Situs resmi <span class="font-bold">LynxxAnime.best</span> — selain dari ini adalah situs palsu.
      </div>

      <!-- HASIL PENCARIAN -->
      <section v-if="searchResults.length > 0" class="mt-6 bg-[#1a1a1a] p-4 rounded-md shadow">
        <div class="flex justify-between items-center">
          <h2 class="bg-[#00aaff] text-black font-bold text-sm px-3 py-2 rounded-sm">
            Hasil Pencarian untuk: "{{ search }}"
          </h2>
          <button @click="clearSearch" class="text-[#00aaff] text-sm hover:underline">✖ Bersihkan</button>
        </div>

        <div v-if="loading" class="text-center py-10">Loading...</div>
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3 mt-4">
          <div
            v-for="(item, i) in searchResults"
            :key="i"
            @click="openAnime(item.slug)"
            class="cursor-pointer bg-[#111] border border-gray-700 hover:border-[#00aaff] transition rounded-sm overflow-hidden"
          >
            <div class="px-2 py-2 text-center">
              <h3 class="text-xs font-semibold truncate">{{ item.title }}</h3>
            </div>
          </div>
        </div>
      </section>

      <!-- DEFAULT CONTENT -->
      <template v-else>
        <section class="mt-6 bg-[#1a1a1a] p-4 rounded-md shadow">
          <h2 class="bg-[#00aaff] text-black font-bold text-sm px-3 py-2 rounded-sm">
            On-going Anime
          </h2>

          <div v-if="loading" class="text-center py-10">Loading...</div>
          <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3 mt-4">
            <div
              v-for="(item, i) in latestData.slice(0,12)"
              :key="i"
              @click="openLatest(item.slug)"
              class="cursor-pointer bg-[#111] border border-gray-700 hover:border-[#00aaff] transition rounded-sm overflow-hidden"
            >
              <div class="relative">
                <img
                  :src="item.poster"
                  class="w-full h-48 object-cover"
                  @error="(e)=>e.target.src='/fallback.jpg'"
                />
                <div class="absolute top-1 left-1 bg-black/70 text-white text-[10px] px-1 rounded-sm">
                  Episode {{ item.episode || '?' }}
                </div>
              </div>
              <div class="px-2 py-2 text-center">
                <h3 class="text-xs font-semibold truncate">{{ item.title }}</h3>
              </div>
            </div>
          </div>
        </section>

        <section class="mt-8 bg-[#1a1a1a] p-4 rounded-md shadow">
          <h2 class="bg-[#00aaff] text-black font-bold text-sm px-3 py-2 rounded-sm">
            Complete Anime
          </h2>

          <div v-if="loading" class="text-center py-10">Loading...</div>
          <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3 mt-4">
            <div
              v-for="(item, i) in recomData.slice(0,12)"
              :key="i"
              @click="openAnime(item.slug)"
              class="cursor-pointer bg-[#111] border border-gray-700 hover:border-[#00aaff] transition rounded-sm overflow-hidden"
            >
              <img
                :src="item.poster"
                class="w-full h-48 object-cover"
                @error="(e)=>e.target.src='/fallback.jpg'"
              />
              <div class="px-2 py-2 text-center">
                <h3 class="text-xs font-semibold truncate">{{ item.title }}</h3>
              </div>
            </div>
          </div>
        </section>
      </template>
    </main>

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
const loading = ref(true)
const menuOpen = ref(false)
const search = ref("")
const searchResults = ref([])
const latestData = ref([])
const recomData = ref([])

async function getData() {
  try {
    const [latest, popular] = await Promise.all([
      axios.get("https://www.sankavollerei.com/anime/stream/latest"),
      axios.get("https://www.sankavollerei.com/anime/stream/popular"),
    ])
    latestData.value = latest.data.data || []
    recomData.value = popular.data.data || []
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function searchAnime() {
  if (!search.value.trim()) return
  loading.value = true
  searchResults.value = []
  try {
    const res = await axios.get(
      `https://www.sankavollerei.com/anime/stream/search/${encodeURIComponent(search.value)}`
    )
    searchResults.value = res.data.data || []
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

function clearSearch() {
  search.value = ""
  searchResults.value = []
}

function openLatest(slug) {
  if (!slug) return
  router.push(`/anime/stream/episode/${slug}`)
}

function openAnime(slug) {
  if (!slug) return
  router.push(`/anime/stream/anime/${slug}`)
}

onMounted(() => {
  getData()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
