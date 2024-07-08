import { createRouter, createWebHistory } from "vue-router";

import HomeView from "./pages/index.vue";
import MovieView from "./pages/MovieView.vue";

const routes = [
  { path: "/", component: HomeView },
  { path: "/:id", component: MovieView, props: true },
];

const router = createRouter({
  routes,
  history: createWebHistory(),
});

export default router;
