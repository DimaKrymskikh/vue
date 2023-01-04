<script setup lang="ts">
import { inject, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import FilmsTable from '../components/catalog/FilmsTable.vue';
import BreadCrumb from '../components/BreadCrumb.vue';
import PaginationNav from '../components/PaginationNav.vue';
import Dropdown from '../components/Dropdown.vue';
import Spinner from '../components/Spinner.vue';
import { request } from '../tools/request';

import type { RouteLocationRaw } from "vue-router";
import type { App } from '../stores/app';
import type { Films } from '../stores/films';
import type { Pagination } from '../stores/pagination';

const router = useRouter();
const route = useRoute();

// Список для хлебных крошек
const linksList = [{
            link: '/' as RouteLocationRaw,
            text: 'Главная страница'
        }, {
            text: 'Каталог'
        }];

const app = inject('app') as App;
const filmsCatalog = inject('filmsCatalog') as Films;
const paginationCatalog = inject('paginationCatalog') as Pagination;

// Запрос на получение списка фильмов
const requestCatalog = async function() {
    // Запрос на сервер для получения списка фильмов и параметров пагинации
    await request(app, `${app.basicUrl}/film/${route.params.pageId}/${paginationCatalog.itemsNumberOnPage}`, 'POST',
        JSON.stringify({
            token: app.token,
            aud: app.aud,
            sortFilmTitle: filmsCatalog.sortFilmTitle,
            sortFilmDescription: filmsCatalog.sortFilmDescription
        }),
        {
            films: filmsCatalog,
            pagination: paginationCatalog
        }
    );
};

// Осуществляет переход на 1-ю страницу
// router.push не может выполнить переход с 1-й страницы на 1-ю после изменения списка фильмов
const goToFirstPage = async function() {
    // Если находились на 1-й странице, то используем requestCatalog
    if (parseInt(route.params.pageId as string, 10) === 1) {
        await requestCatalog();
    // Если находились не на 1-й странице, то используем router.push
    } else {
        await router.push({name: 'catalog', params: {pageId: 1}});
    }
}

// Изменяет число фильмов на странице
const changeNumberOfFilmsOnPage = function(newNumber: number) {
    // Сохраняем новое число фильмов на странице в хранилище paginationCatalog
    paginationCatalog.itemsNumberOnPage = newNumber;
    // Получаем данные с сервера для 1-й страницы
    goToFirstPage();
}

// Получаем данные при монтировании компоненты
requestCatalog();

// Отслеживаем пагинацию
watch(
    () => route.params.pageId,
    requestCatalog
);
</script>

<template>
    <BreadCrumb :linksList="linksList" />
    <h1>Каталог</h1>
    
    <Spinner class="flex justify-center" :hSpinner="'h-96'" v-if="app.isRequest" />
    <template v-else>
        <Dropdown
            class="mb-2"
            :itemsNumberOnPage="paginationCatalog.itemsNumberOnPage"
            :changeNumber="changeNumberOfFilmsOnPage"
            :buttonName="'Число фильмов на странице'"/>
        <FilmsTable :requestCatalog="requestCatalog" :goToFirstPage="goToFirstPage"/>
        <PaginationNav :routeName="'catalog'" :pagination="paginationCatalog"/>
    </template>
</template>
