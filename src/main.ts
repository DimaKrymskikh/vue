import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "./assets/main.scss";

import { useAppStore } from './stores/app';
import { useUserStore } from './stores/user';
import { filmsCatalogStore, filmsAccountStore } from './stores/films';
import { paginationCatalogStore, paginationAccountStore } from './stores/pagination';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.provide('app', useAppStore());
app.provide('user', useUserStore());
app.provide('filmsCatalog', filmsCatalogStore());
app.provide('filmsAccount', filmsAccountStore());
app.provide('paginationCatalog', paginationCatalogStore());
app.provide('paginationAccount', paginationAccountStore());

app.mount("#app");
