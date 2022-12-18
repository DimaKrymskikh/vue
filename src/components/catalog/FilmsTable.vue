<script setup lang="ts">
import { inject } from 'vue';
import { request } from '../../tools/request';
import type { App } from '../../stores/app';
import type { Films } from '../../stores/films';
import type { Pagination } from '../../stores/pagination';

const app = inject('app') as App;
const filmsCatalog = inject('filmsCatalog') as Films;
const paginationCatalog = inject('paginationCatalog') as Pagination;

const requestAddFilm = async function(filmId: number) {
    return await request(app, `${app.basicUrl}/userFilm/${filmId}`, 'POST',
        JSON.stringify({
            token: app.token,
            aud: app.aud
        }),
        {},
        false
    );
};

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
    const spinner = tag.parentNode?.querySelector('.spinner-border') as Element;
    tag.classList.add('visually-hidden');
    spinner.classList.remove('visually-hidden');

    if (await requestAddFilm(tagDataFilmId)) {
        spinner.classList.add('visually-hidden');
        checkCircle.classList.remove('visually-hidden');
    }
}
</script>

<template>
<table id="films-table" class="table table-striped table-hover  caption-top table-bordered" @click="handlerAddFilm">
    <caption>Показано {{paginationCatalog.elementsNumberOnActivePage}} фильмов из {{paginationCatalog.itemsNumberTotal}}</caption>
    <thead>
        <tr>
            <th scope="col">#</th>
            <th scope="col">Название</th>
            <th scope="col">Описание</th>
            <th scope="col">Язык</th>
            <th scope="col" v-if="!app.isGuest"></th>
        </tr>
        <tr scope="col">
            <th scope="col"></th>
            <th scope="col"><input type="text" id="sort-film-title" class="form-control"  v-model="filmsCatalog.sortFilmTitle"></th>
            <th scope="col"><input type="text" id="sort-film-description" class="form-control" v-model="filmsCatalog.sortFilmDescription"></th>
            <th scope="col"></th>
            <th scope="col" v-if="!app.isGuest"></th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="(item) in filmsCatalog.films">
            <th scope="row">{{item.n}}</th>
            <td>{{item.title}}</td>
            <td>{{item.description}}</td>
            <td>{{item.name}}</td>
            <template v-if="!app.isGuest">
                <td v-if="item.isAvailable">
                    <img src="@/assets/svg/check-circle.svg" alt="check-circle">
                </td>
                <td v-else>
                    <span class="spinner-border spinner-border-sm visually-hidden"></span>
                    <img class="add-film" src="@/assets/svg/plus-circle.svg" alt="plus-circle" :data-film-id="item.id">
                    <img class="check-circle visually-hidden" src="@/assets/svg/check-circle.svg" alt="check-circle">
                </td>
            </template>
        </tr>
    </tbody>
</table>
</template>
