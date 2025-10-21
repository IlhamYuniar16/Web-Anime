<template>
  <div class="bg-[#0b0b0b] text-gray-200 min-h-screen font-sans">
    <!-- HEADER -->
    <header class="bg-[#1a1a1a] border-b border-[#00aaff] text-white shadow-md">
      <main class="flex justify-between items-center p-4 max-w-6xl mx-auto">
        <h1 class="font-extrabold text-2xl cursor-pointer" @click="router.push('/')">
          <span class="text-white">LYNXX</span><span class="text-[#00aaff]">ANIME</span>
        </h1>

        <div class="flex gap-6 items-center">
          <div class="flex items-center bg-white rounded-sm overflow-hidden">
            <input
              v-model="search"
              type="text"
              placeholder="Cari Anime..."
              class="outline-none text-black px-3 py-1 w-48"
            />
            <button @click="searchAnime" class="bg-[#00aaff] px-3 text-white hover:bg-[#0090e0]">
              🔍
            </button>
          </div>
        </div>
      </main>

      <nav class="bg-[#141414] text-sm text-gray-300 font-semibold flex justify-center space-x-6 py-2">
        <a href="/" class="hover:text-[#00aaff]">HOME</a>
        <a href="/allanime" class="hover:text-[#00aaff]">ANIME LIST</a>
        <a href="/movie" class="hover:text-[#00aaff]">MOVIE ANIME</a>
      </nav>
    </header>

    <!-- MAIN CONTENT -->
    <main class="max-w-5xl mx-auto mt-10 p-4">
      <section v-if="loading" class="text-center text-gray-400 py-10">
        Memuat data...
      </section>

      <section v-else-if="errorMsg" class="text-center text-red-500 py-10">
        {{ errorMsg }}
      </section>

      <section v-else class="bg-[#1a1a1a] border border-[#2b2b2b] rounded-sm shadow-md overflow-hidden">
        <!-- TITLE BAR -->
        <div class="bg-[#00aaff] px-4 py-2 font-bold text-black">
          {{ comic.title }}
        </div>

        <!-- INFO -->
        <div class="flex justify-between px-4 py-2 border-b border-gray-700 text-sm text-gray-400">
          <p>📅 Posted by {{ comic.creator || 'admin' }}</p>
          <p>🕒 Release {{ comic.released_time || '00:00 am' }}</p>
        </div>

        <!-- EPISODE CONTROLS -->
        <div class="px-4 py-2 border-b border-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <select
            v-model="selectedEpisode"
            @change="goToEpisode(selectedEpisode)"
            class="bg-[#141414] border border-gray-600 text-sm px-2 py-1 rounded-md"
          >
            <option disabled value="">Pilih Episode Lainnya</option>
            <option v-for="(ep, index) in comic.episodes" :key="index" :value="ep.eps_slug">
              {{ ep.eps_title }}
            </option>
          </select>

          <div class="flex gap-2 text-xs font-semibold">
            <button
              v-if="comic.prev_eps_slug && comic.prev_eps_slug !== '-'"
              @click="goToEpisode(comic.prev_eps_slug)"
              class="bg-[#222] hover:bg-[#333] border border-gray-700 px-3 py-1 rounded text-gray-300"
            >
              ⬅ Previous Eps.
            </button>

            <button
              v-if="comic.next_eps_slug && comic.next_eps_slug !== '-'"
              @click="goToEpisode(comic.next_eps_slug)"
              class="bg-[#222] hover:bg-[#333] border border-gray-700 px-3 py-1 rounded text-gray-300"
            >
              Next Eps. ➡
            </button>

            <button
              @click="router.push('/anime/stream/movie/page/1')"
              class="bg-[#00aaff] hover:bg-[#0090e0] text-black px-3 py-1 rounded"
            >
              See All Episodes
            </button>
          </div>
        </div>

        <!-- VIDEO PLAYER -->
        <div class="p-4">
          <iframe
            v-if="comic.stream_url"
            :src="comic.stream_url"
            class="w-full aspect-video border border-gray-700"
            frameborder="0"
            allowfullscreen
          ></iframe>
          <div v-else class="text-center text-gray-500 py-20">Video tidak tersedia.</div>
        </div>

        <!-- MIRROR BUTTONS -->
        <div class="flex flex-wrap gap-2 px-4 py-3 border-t border-gray-700">
          <button class="bg-[#2b92d6] hover:bg-[#237dbb] text-black font-semibold px-4 py-1 rounded">
            Mirror 360p
          </button>
          <button class="bg-[#00aaff] hover:bg-[#0090e0] text-black font-semibold px-4 py-1 rounded">
            Mirror 480p
          </button>
          <button class="bg-[#c23c3c] hover:bg-[#a93232] text-white font-semibold px-4 py-1 rounded">
            Mirror 720p
          </button>
          <button class="bg-[#d93d3d] hover:bg-[#b83333] text-white font-semibold px-4 py-1 rounded">
            CINEMA OFF
          </button>
        </div>
      </section>
    </main>

    <!-- FOOTER -->
    <footer class="text-center text-gray-500 py-5 text-sm mt-10 border-t border-gray-700">
      © 2025 <span class="text-[#00aaff] font-semibold">LynxxAnime</span> — All Rights Reserved.
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const slug = ref(route.params.slug);

const comic = ref({});
const loading = ref(true);
const errorMsg = ref("");
const selectedEpisode = ref("");
const search = ref("");


async function getComicDetail() {
  loading.value = true;
  errorMsg.value = "";
  try {
    const res = await axios.get(`https://www.sankavollerei.com/anime/stream/episode/${slug.value}`);
    const data = res.data;
    comic.value = {
      title: data.title,
      creator: data.creator,
      synopsis: data.synopsis,
      poster: data.poster,
      stream_url: data.stream_url,
      prev_eps_slug: data.prev_eps_slug,
      next_eps_slug: data.next_eps_slug,
      episodes: data.episodes || [],
    };
    selectedEpisode.value = slug.value;
  } catch (err) {
    console.error(err);
    errorMsg.value = "Gagal memuat detail anime.";
  } finally {
    loading.value = false;
  }
}

function goToEpisode(newSlug) {
  if (!newSlug) return;
  slug.value = newSlug;
  router.push(`/anime/stream/episode/${newSlug}`);
}

watch(
  () => route.params.slug,
  (newSlug) => {
    slug.value = newSlug;
    getComicDetail();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
);

function searchAnime() {
  if (!search.value.trim()) return;
  router.push(`/search?query=${encodeURIComponent(search.value)}`);
}

onMounted(() => {
  getComicDetail();
});
</script>
