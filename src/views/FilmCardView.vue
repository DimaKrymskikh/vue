<script setup lang="ts">
import { inject } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import BreadCrumb from '../components/BreadCrumb.vue';
import Spinner from '../components/Spinner.vue';
import { request } from '../tools/request';
import type { App } from '../stores/app';
import type { Film } from '../stores/film';

const linksList = [{
                link: '/',
                text: 'Главная страница'
            }, {
                link: '/account',
                text: 'Личный кабинет'
            }, {
                text: 'Карточка фильма'
            }];
        
const app = inject('app') as App;
const filmCard = inject('filmCard') as Film;

const router = useRouter();
const route = useRoute();
    
async function requestFilmCard() {
    await request(app, `${app.basicUrl}/account/filmCard/${route.params.filmId}`, 'POST',
        JSON.stringify({
            token: app.token,
            aud: app.aud
        }),
        {film: filmCard}
    );
};

if (app.token !== '') {
    requestFilmCard();
} else {
    router.push({ name: 'home' });
}

</script>

<template>
    <BreadCrumb :linksList="linksList" />
    
    <Spinner v-if="app.isRequest" />
    <template v-else>
        <h1>{{filmCard.title}}</h1>
        <div class="row">
            <div class="col">
                <h4>Основная информация</h4>
            </div>
            <div class="col">
                <h4>Описание</h4>
            </div>
            <div class="col">
                <h4>Актёры</h4>
            </div>
        </div>

        <div class="row">
            <div class="col">
                <div>Фильм вышел в {{filmCard.releaseYear}} году</div>
                <div>Язык фильма: {{filmCard.language}}</div>
            </div>
            <div class="col">
                <div>{{filmCard.description}}</div>
            </div>
            <div class="col">
                <div v-for="(actorName) in filmCard.actorNames">{{actorName}}</div>
            </div>
        </div>
    </template>
</template>
