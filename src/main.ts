import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "./assets/main.scss";

import { useAppStore } from './stores/app';
import { useUserStore } from './stores/user'
import { useFilmsStore } from './stores/films';
import { usePaginationStore } from './stores/pagination';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.provide('app', useAppStore());
app.provide('user', useUserStore());
app.provide('filmsCatalog', useFilmsStore());
app.provide('filmsAccount', useFilmsStore());
app.provide('paginationCatalog', usePaginationStore());
app.provide('paginationAccount', usePaginationStore());

app.mount("#app");
