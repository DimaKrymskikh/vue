<script setup lang="ts">
import { inject } from 'vue';
import FilmsTable from '../components/catalog/FilmsTable.vue';
import BreadCrumb from '../components/BreadCrumb.vue';
import PaginationNav from '../components/PaginationNav.vue';
import Spinner from '../components/Spinner.vue';
import { request } from '../tools/request';

import type { RouteLocationRaw } from "vue-router";
import type { App } from '../stores/app';
import type { Films } from '../stores/films';
import type { Pagination } from '../stores/pagination';

const linksList = [{
            link: '/' as RouteLocationRaw,
            text: 'Главная страница'
        }, {
            text: 'Каталог'
        }];

const app = inject('app') as App;
const filmsCatalog = inject('filmsCatalog') as Films;
const paginationCatalog = inject('paginationCatalog') as Pagination;

const requestCatalog = async function(pagination: Pagination, page?: number) {
    let pageOnServer = arguments.length === 2 ? page : pagination.activePage;
    let itemsNumberOnPage = typeof pagination === "object" ? pagination.itemsNumberOnPage : pagination;
    
    // Запрос на сервер для получения списка фильмов и параметров пагинации
    return await request(app, `${app.basicUrl}/film/${pageOnServer}/${itemsNumberOnPage}`, 'POST',
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

requestCatalog(paginationCatalog);
</script>

<template>
    <BreadCrumb :linksList="linksList" />
    <h1>Каталог</h1>
    
    <Spinner v-if="app.isRequest" />
    <template v-else>
        <FilmsTable :requestCatalog="requestCatalog" />
        <PaginationNav :pagination="paginationCatalog" :request="requestCatalog" />
    </template>
</template>
