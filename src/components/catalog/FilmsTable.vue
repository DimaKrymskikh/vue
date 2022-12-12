<script setup lang="ts">
import { inject } from 'vue';
import type { App } from '../../stores/app';
import type { Films } from '../../stores/films';
import type { Pagination } from '../../stores/pagination';

const app = inject('app') as App;
const filmsCatalog = inject('filmsCatalog') as Films;
const paginationCatalog = inject('paginationCatalog') as Pagination;
</script>

<template>
<table id="films-table" class="table table-striped table-hover  caption-top table-bordered">
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
                    <img src="@/assets/svg/check-circle.svg" alt="Домашняя страница" data-film-id="item.id">
                </td>
                <td v-else>
                    <span class="spinner-border spinner-border-sm visually-hidden"></span>
                    <img class="add-film" src="@/assets/svg/plus-circle.svg" alt="Домашняя страница" data-film-id="item.id">
                </td>
            </template>
        </tr>
    </tbody>
</table>
</template>
