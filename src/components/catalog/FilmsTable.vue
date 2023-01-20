<script setup lang="ts">
import { inject, ref } from 'vue';
import Spinner from '@/components/Spinner.vue';
import type { App } from '@/stores/app';
import type { Films } from '@/stores/films';
import type { Pagination } from '@/stores/pagination';

const app = inject('app') as App;
const filmsCatalog = inject('filmsCatalog') as Films;
const paginationCatalog = inject('paginationCatalog') as Pagination;

const { requestCatalog, goToFirstPage } = defineProps<{
    requestCatalog: Function,
    goToFirstPage: Function
}>();

// Обработчик манипуляций с таблицей фильмов
const handlerAddFilm = async function(e: Event) {
    const target = e.target as Element;
    const isTargetAddFilm = target.classList.contains("add-film");
    
    let tag;
    // Клик должен быть по картинке 'plus-circle.svg'
    if (target && isTargetAddFilm) {
        tag = target;
    } else {
        return;
    }
    
    const tagParent = tag.parentNode as Element;
    const checkCircle = tagParent.querySelector('.check-circle') as Element;

    const tagDataFilmId = tag.getAttribute('data-film-id') as unknown as number;
    const spinner = tag.parentNode?.querySelector('.spinner') as Element;
    tag.classList.add('hidden');
    spinner.classList.remove('hidden');

    // Запрос, добавляющий фильм с id=filmId в список пользователя
    await app.request(`userFilm/${tagDataFilmId}`, 'POST', {}, {}, false);
    
    spinner.classList.add('hidden');
    checkCircle.classList.remove('hidden');
}

// Фильтрует фильмы 
// Запрос отправляется нажатием на клавишу "Enter"
const putFilms = async function(e: KeyboardEvent) {
    if(e.key.toLowerCase() !== "enter") {
        return;
    }
    goToFirstPage();
}
</script>

<template>
<table class="container" @click="handlerAddFilm">
    <caption>Показано {{paginationCatalog.elementsNumberOnActivePage}} фильмов из {{paginationCatalog.itemsNumberTotal}}</caption>
    <thead>
        <tr>
            <th>#</th>
            <th>Название</th>
            <th>Описание</th>
            <th>Язык</th>
            <th v-if="!app.isGuest"></th>
        </tr>
        <tr>
            <th></th>
            <th><input type="text" v-model="filmsCatalog.sortFilmTitle" @keyup="putFilms"></th>
            <th><input type="text" v-model="filmsCatalog.sortFilmDescription" @keyup="putFilms"></th>
            <th></th>
            <th v-if="!app.isGuest"></th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="(item) in filmsCatalog.films">
            <td>{{item.n}}</td>
            <td>{{item.title}}</td>
            <td>{{item.description}}</td>
            <td>{{item.name}}</td>
            <template v-if="!app.isGuest">
                <td v-if="item.isAvailable">
                    <img class="m-auto" src="@/assets/svg/check-circle.svg" alt="check-circle">
                </td>
                <td v-else>
                    <Spinner :hSpinner="'h-4'" class="spinner flex justify-center m-auto hidden" />
                    <img class="add-film m-auto" src="@/assets/svg/plus-circle.svg" alt="plus-circle" :data-film-id="item.id">
                    <img class="check-circle m-auto hidden" src="@/assets/svg/check-circle.svg" alt="check-circle">
                </td>
            </template>
        </tr>
    </tbody>
</table>
</template>
