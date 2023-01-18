<script setup lang="ts">
import { inject } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import BreadCrumb from '../components/BreadCrumb.vue';
import Spinner from '../components/Spinner.vue';
import type { App } from '../stores/app';
import type { Film } from '../stores/film';
import type { Pagination } from '../stores/pagination';

const paginationAccount = inject('paginationAccount') as Pagination;

const linksList = [{
                link: '/',
                text: 'Главная страница'
            }, {
                link: {name: 'account', params: { pageId: paginationAccount.activePage }},
                text: 'Личный кабинет'
            }, {
                text: 'Карточка фильма'
            }];
        
const app = inject('app') as App;
const filmCard = inject('filmCard') as Film;

const router = useRouter();
const route = useRoute();
    
async function requestFilmCard() {
    await app.request(`account/filmCard/${route.params.filmId}`, 'POST', {}, {film: filmCard});
};

requestFilmCard();
</script>

<template>
    <BreadCrumb :linksList="linksList" />
    
    <Spinner class="flex justify-center" :hSpinner="'h-96'" v-if="app.isRequest" />
    <template v-else>
        <h1>{{filmCard.title}}</h1>
        <div class="flex">
            <div class="w-1/4 pr-4">
                <h3>Основная информация</h3>
            </div>
            <div class="w-1/2 px-4">
                <h3>Описание</h3>
            </div>
            <div class="w-1/4 pl-4">
                <h3>Актёры</h3>
            </div>
        </div>

        <div class="flex">
            <div class="w-1/4 pr-4">
                <div>Фильм вышел в {{filmCard.releaseYear}} году</div>
                <div>Язык фильма: {{filmCard.language}}</div>
            </div>
            <div class="w-1/2 px-4">
                <div>{{filmCard.description}}</div>
            </div>
            <div class="w-1/4 pl-4">
                <div v-for="(actorName) in filmCard.actorNames">{{actorName}}</div>
            </div>
        </div>
    </template>
</template>
