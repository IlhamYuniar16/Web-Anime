import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/anime/stream/anime/:slug",
      name: "MangaDetail",
      component: () => import("@/views/MangaDetail.vue"),
    },
    {
      path: "/anime/stream/episode/:slug",
      name: "chapter",
      component: () => import("../views/ReadView.vue"),
    },
    {
      path: "/allanime",
      name: "manhwa",
      component: () => import("../views/AllAnime.vue"),
    },
    {
      path: "/movie",
      name: "movie",
      component: () => import("../views/MoviePage.vue"),
    },
  ],
});

export default router;
