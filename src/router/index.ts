import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CatalogView from "../views/CatalogView.vue";
import AccountView from "../views/AccountView.vue";
import LoginView from "../views/LoginView.vue";
import LogoutView from "../views/LogoutView.vue";
import RegisterView from "../views/RegisterView.vue";
import FilmCardView from "../views/FilmCardView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/catalog/:pageId",
      name: "catalog",
      component: CatalogView,
    },
    {
      path: "/account/:pageId",
      name: "account",
      component: AccountView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/logout",
      name: "logout",
      component: LogoutView,
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView
    },
    {
      path: "/filmCard/:filmId",
      name: "filmCard",
      component: FilmCardView
    },
  ],
});

export default router;
