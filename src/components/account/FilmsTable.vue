<script setup lang="ts">
import { inject, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { request } from '../../tools/request';
import FilmRemoveModal from './FilmRemoveModal.vue';
import type { App } from '../../stores/app';
import type { Films } from '../../stores/films';
import type { Pagination } from '../../stores/pagination';

const router = useRouter();
const route = useRoute();

const app = inject('app') as App;
const filmsAccount = inject('filmsAccount') as Films;
const paginationAccount = inject('paginationAccount') as Pagination;

const { requestAccount } = defineProps<{
    requestAccount: Function
}>();

const filmName = ref('');
const filmId = ref(0);
const isRequest = ref(false);
const isShowFilmRemoveModal = ref(false)
const removeFilmPassword = ref(null as unknown as Element);
const inputPassword = ref('');
const errors = ref([]);

const putFilms = async function(e: KeyboardEvent) {
    if(e.key.toLowerCase() !== "enter") {
        return;
    }
    // Если поиск ведётся на 1-й странице, то делаем прямой запрос методом requestAccount
    if (parseInt(route.params.pageId as string, 10) === 1) {
        await requestAccount();
    // иначе используем router.push
    } else {
        await router.push({name: 'account', params: {pageId: 1}});
    }
};

const handlerFilms = function(e: Event) {
    const target = e.target as Element;
    if(target?.classList.contains('removal-film')) {
        showFilmRemoveModal(target);
    }
};

const requestGetFilm = async function(filmId: string | null) {
    return  await request(app, `${app.basicUrl}/account/getFilm/${filmId}`, 'POST',
        JSON.stringify({
            token: app.token,
            aud: app.aud
        }),
        {},
        false
    );
};

const showFilmRemoveModal = async function(tag: Element) {
    isShowFilmRemoveModal.value = true;
    isRequest.value = true;
    errors.value = [];
    
    const result = await requestGetFilm(tag.getAttribute('data-film-id'));
    
    isRequest.value = false;
    filmId.value = result.id;
    filmName.value = result.title;
}

const hideFilmRemoveModal = function(e: Event) {
    const target = e.currentTarget as Element;
    if(target?.classList.contains('disabled') || target?.classList.contains('stop-event')) {
        return;
    }
    isShowFilmRemoveModal.value = false;
    inputPassword.value = '';
};

const requestRemoveFilm = async function(filmId: string | null) {
    return  await request(app, `${app.basicUrl}/userFilm/${filmId}`, 'DELETE',
        JSON.stringify({
            token: app.token,
            aud: app.aud,
            password: inputPassword.value
        }),
        {},
        false
    );
}

const handlerRemoveFilm = async function(e: Event) {
    e.stopPropagation();
    const target = e.currentTarget as Element;
    if(target?.classList.contains('disabled') || target?.classList.contains('stop-event')) {
        return;
    }
    isRequest.value = true;
    
    const result = await requestRemoveFilm(target.getAttribute('data-submit-id'));

    isRequest.value = false;
    if (result.errors.length === 0) {
        // Если на странице удалялся последний фильм, то используем router.push, чтобы обновить данные
        if (paginationAccount.getPageAfterRemoveFilm() !== paginationAccount.activePage) {
            await router.push({name: 'account', params: {pageId: paginationAccount.getPageAfterRemoveFilm()}});
        // Иначе (route.params.pageId === paginationAccount.activePage и router.push не обновит данные), делаем запрос
        } else {
            await requestAccount();
        }
        isShowFilmRemoveModal.value = false;
    } else {
        inputPassword.value = '';
        errors.value = result.errors;
    }
}
</script>

<template>
<table class="container" @click="handlerFilms">
    <caption>Показано {{paginationAccount.elementsNumberOnActivePage}} фильмов из {{paginationAccount.itemsNumberTotal}}</caption>
    <thead>
        <tr>
            <th>#</th>
            <th>Название</th>
            <th>Описание</th>
            <th>Язык</th>
            <th></th>
            <th></th>
        </tr>
        <tr>
            <th></th>
            <th><input type="text" class="form-control" v-model="filmsAccount.sortFilmTitle" @keyup="putFilms"></th>
            <th><input type="text" class="form-control" v-model="filmsAccount.sortFilmDescription" @keyup="putFilms"></th>
            <th></th>
            <th></th>
            <th></th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="(item) in filmsAccount.films">
            <td>{{item.n}}</td>
            <td>{{item.title}}</td>
            <td>{{item.description}}</td>
            <td>{{item.name}}</td>
            <td>
                <RouterLink :to="{name: 'filmCard', params: { filmId: item.id }}">
                    <img
                        class="m-auto"
                        src="@/assets/svg/eye.svg"
                        alt="Карточка фильма"
                        title="Карточка фильма">
                </Routerlink>
            </td>
            <td>
                <img class="removal-film m-auto"
                    :data-film-id="item.id"
                    src="@/assets/svg/trash.svg"
                    alt="Удаление фильма"
                    title="Удаление фильма">
            </td>
        </tr>
    </tbody>
</table>
<FilmRemoveModal
    v-if="isShowFilmRemoveModal"
    :isRequest="isRequest"
    :filmName="filmName"
    :filmId="filmId"
    :hideFilmRemoveModal="hideFilmRemoveModal"
    :handlerRemoveFilm="handlerRemoveFilm"
    :removeFilmPassword="removeFilmPassword"
    v-model:password="inputPassword"
    :errors="errors"
/>
</template>
