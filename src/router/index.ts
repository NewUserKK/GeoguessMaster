import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import Home from "@/views/Home.vue";
import Game from "@/views/Game.vue";
import CreateMap from "@/views/CreateMap.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/:catchAll(.*)",
    redirect: "/",
  },
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/game",
    name: "game",
    component: Game,
  },
  {
    path: "/createMap",
    name: "createMap",
    component: CreateMap,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
