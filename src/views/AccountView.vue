<script setup lang="ts">
import { inject } from 'vue';
import { useRouter } from 'vue-router'
import FilmsTable from '../components/account/FilmsTable.vue';
import BreadCrumb from '../components/BreadCrumb.vue';
import PaginationNav from '../components/PaginationNav.vue';
import Spinner from '../components/Spinner.vue';
import { request } from '../tools/request';

import type { RouteLocationRaw } from "vue-router";
import type { App } from '../stores/app';
import type { User } from '../stores/user';
import type { Films } from '../stores/films';
import type { Pagination } from '../stores/pagination';

const linksList = [{
            link: '/' as RouteLocationRaw,
            text: 'Главная страница'
        }, {
            text: 'Аккаунт'
        }];
    
const app = inject('app') as App;
const user = inject('user') as User;
const filmsAccount = inject('filmsAccount') as Films;
const paginationAccount = inject('paginationAccount') as Pagination;

const router = useRouter();

const requestAccount = async function(pagination: Pagination, page?: number) {
    let pageOnServer = arguments.length === 2 ? page : pagination.activePage;
    let itemsNumberOnPage = typeof pagination === "object" ? pagination.itemsNumberOnPage : pagination;
    
    return await request(app, `${app.basicUrl}/account/index/${pageOnServer}/${itemsNumberOnPage}`, 'POST',
        JSON.stringify({
            token: app.token,
            aud: app.aud,
            sortFilmTitle: filmsAccount.sortFilmTitle,
            sortFilmDescription: filmsAccount.sortFilmDescription
        }),
        {
            films: filmsAccount,
            pagination: paginationAccount
        }
    );
};

requestAccount(paginationAccount);
</script>

<template>
    <BreadCrumb :linksList="linksList" />
    <h1>{{user.login}}. Личный кабинет</h1>
    <h2>Список доступных фильмов</h2>
    
    <Spinner v-if="app.isRequest" />
    <template v-else>
        <FilmsTable :requestAccount="requestAccount" />
        <PaginationNav :pagination="paginationAccount" :request="requestAccount" />
    </template>
</template>
