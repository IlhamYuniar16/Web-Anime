<template>
  <div class="bg-[#0b0b0b] text-gray-200 min-h-screen font-sans">
    <header class="bg-[#1a1a1a] border-b border-[#00aaff] text-white shadow-md">
      <main class="flex justify-between items-center p-4 max-w-6xl mx-auto">
        <h1 class="font-extrabold text-2xl">
          <span class="text-white">LYNXX</span><span class="text-[#00aaff]">ANIME</span>
        </h1>

        <div class="flex gap-6 items-center">
          <div class="flex items-center bg-white rounded-sm overflow-hidden">
            <input
              v-model="search"
              type="text"
              placeholder="Search..."
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
    <main class="max-w-5xl mx-auto mt-10 p-4">
      <section v-if="loading" class="text-center text-gray-400 py-10">
        Loading...
      </section>

      <section v-else-if="errorMsg" class="text-center text-red-500 py-10">
        {{ errorMsg }}
      </section>

      <section v-else class="bg-[#1a1a1a] border border-[#2b2b2b] rounded-sm shadow-md overflow-hidden">
        <div class="bg-[#00aaff] px-4 py-2 font-bold text-black">
          {{ comic.title }} Subtitle Indonesia
        </div>

        <!-- INFO SECTION -->
        <div class="p-4 border-b border-gray-700">
          <div class="flex flex-col sm:flex-row gap-6">
            <img
              :src="comic.thumb"
              alt="poster"
              class="w-48 h-64 object-cover border border-gray-700"
            />

            <div class="flex-1">
              <h2 class="text-xl font-bold mb-3 text-white">Streaming {{ comic.title }} Sub Indo</h2>

              <table class="text-sm text-gray-300">
                <tbody>
                  <tr><td class="pr-3 py-1">Judul</td><td>: {{ comic.title }}</td></tr>
                  <tr><td class="pr-3 py-1">Japanese</td><td>: {{ comic.japanese || '-' }}</td></tr>
                  <tr><td class="pr-3 py-1">Skor</td><td>: {{ comic.score || '?' }}</td></tr>
                  <tr><td class="pr-3 py-1">Studio</td><td>: {{ comic.studio || '-' }}</td></tr>
                  <tr><td class="pr-3 py-1">Total Episode</td><td>: {{ comic.episode?.length || '?' }}</td></tr>
                  <tr><td class="pr-3 py-1">Durasi</td><td>: {{ comic.duration || '24 Menit' }}</td></tr>
                  <tr><td class="pr-3 py-1">Tanggal Rilis</td><td>: {{ comic.released || '-' }}</td></tr>
                  <tr><td class="pr-3 py-1">Genre</td><td>: {{ comic.genre.join(', ') }}</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- SINOPSIS -->
          <div class="mt-6 text-gray-300 text-sm leading-relaxed text-justify border-t border-gray-700 pt-4">
            {{ comic.description }}
          </div>
        </div>

        <!-- EPISODE LIST -->
        <div>
          <div class="bg-[#5148d6] text-black font-bold px-4 py-2 border-t border-gray-800">
            {{ comic.title }} Batch
          </div>
          <div
            class="flex justify-between px-4 py-2 bg-[#2b2b2b] text-sm border-b border-gray-700 hover:bg-[#3a3a3a] cursor-pointer"
          >
            <span>{{ comic.title }} [BATCH] Subtitle Indonesia</span>
            <span>17 Mei 2021</span>
          </div>

          <div class="bg-[#5148d6] text-black font-bold px-4 py-2 border-t border-gray-800">
            {{ comic.title }} Episode List (Link Download Episode + Streaming)
          </div>

          <div
            v-for="(ch, i) in comic.episode"
            :key="i"
            @click="openChapter(ch.eps_slug)"
            class="flex justify-between items-center px-4 py-2 bg-[#1a1a1a] text-sm border-b border-gray-700 hover:bg-[#222] cursor-pointer"
          >
            <span>{{ ch.eps_title }} Subtitle Indonesia</span>
            <span class="text-gray-400 text-xs">{{ ch.date || '??' }}</span>
          </div>
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
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const slug = route.params.slug;

const comic = ref({});
const loading = ref(true);
const errorMsg = ref("");
const search = ref("");

async function getComicDetail() {
  try {
    const res = await axios.get(
      `https://www.sankavollerei.com/anime/stream/anime/${slug}`
    );
    const data = res.data;
    comic.value = {
      title: data.title,
      description: data.synopsis,
      thumb: data.poster,
      episode: data.episodes,
      genre: data.genres || [],
      studio: data.studio,
      score: data.score,
      released: data.released,
      japanese: data.title_japanese,
      duration: data.duration,
    };
  } catch (err) {
    console.error(err);
    errorMsg.value = "Gagal memuat detail anime.";
  } finally {
    loading.value = false;
  }
}

function openChapter(slug) {
  if (!slug) return;
  const cleanLink = slug.replace(/^\/chapter\//, "").replace(/^\/+/, "");
  router.push(`/anime/stream/episode/${cleanLink}`);
}

function searchAnime() {
  if (!search.value.trim()) return;
  router.push(`/search?query=${encodeURIComponent(search.value)}`);
}

onMounted(() => {
  getComicDetail();
});
</script>
