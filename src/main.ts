import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "./assets/main.scss";

import { useAppStore } from './stores/app';
import { useUserStore } from './stores/user';
import { filmsCatalogStore, filmsAccountStore } from './stores/films';
import { paginationCatalogStore, paginationAccountStore } from './stores/pagination';
import { filmCardStore } from './stores/film';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.provide('app', useAppStore());
app.provide('user', useUserStore());
app.provide('filmsCatalog', filmsCatalogStore());
app.provide('filmsAccount', filmsAccountStore());
app.provide('paginationCatalog', paginationCatalogStore());
app.provide('paginationAccount', paginationAccountStore());
app.provide('filmCard', filmCardStore());

app.mount("#app");

router.beforeEach((to, from) => {
    // Если токен не получен и осуществляется переход не на главную страницу (например, нажаты клавиши Ctrl+F5),
    // то переходим на главную страницу
    if (useAppStore().token === '' && to.name !== 'home') {
        router.push({ name: 'home' });
    }
});
