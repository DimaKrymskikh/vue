<script setup lang="ts">
import { inject } from 'vue';
import { request } from '../../tools/request';
import type { App } from '../../stores/app';
import type { Films } from '../../stores/films';
import type { Pagination } from '../../stores/pagination';

const app = inject('app') as App;
const filmsAccount = inject('filmsAccount') as Films;
const paginationAccount = inject('paginationAccount') as Pagination;

const { requestAccount } = defineProps<{
    requestAccount: Function
}>();

const putFilms = async function(e: KeyboardEvent) {
        if(e.key.toLowerCase() !== "enter") {
            return;
        }
        await requestAccount(paginationAccount, 1);
}
</script>

<template>
    <div class="table-responsive">
        <table id="personal-films-table" class="table table-striped table-hover  caption-top table-bordered">
            <caption>Показано {{paginationAccount.elementsNumberOnActivePage}} фильмов из {{paginationAccount.itemsNumberTotal}}</caption>
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Название</th>
                    <th scope="col">Описание</th>
                    <th scope="col">Язык</th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                </tr>
                <tr scope="col">
                    <th scope="col"></th>
                    <th scope="col"><input type="text" class="form-control" v-model="filmsAccount.sortFilmTitle" @keyup="putFilms"></th>
                    <th scope="col"><input type="text" class="form-control" v-model="filmsAccount.sortFilmDescription" @keyup="putFilms"></th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item) in filmsAccount.films">
                    <th scope="row">{{item.n}}</th>
                    <td>{{item.title}}</td>
                    <td>{{item.description}}</td>
                    <td>{{item.name}}</td>
                    <td>
                        <RouterLink :to="{name: 'filmCard', params: { filmId: item.id }}">
                            <img
                                src="@/assets/svg/eye.svg"
                                alt="Карточка фильма"
                                title="Карточка фильма">
                        </Routerlink>
                    </td>
                    <td>
                        <img class="removal-film"
                            data-film-id="${item.id}"
                            src="@/assets/svg/trash.svg"
                            alt="Удаление фильма"
                            title="Удаление фильма">
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
