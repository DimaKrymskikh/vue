<script setup lang="ts">
import { inject, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import FilmRemoveModal from '@/components/account/FilmRemoveModal.vue';
import type { Films } from '@/stores/films';
import type { Pagination } from '@/stores/pagination';

const router = useRouter();
const route = useRoute();

const filmsAccount = inject('filmsAccount') as Films;
const paginationAccount = inject('paginationAccount') as Pagination;

const { requestAccount, goToFirstPage } = defineProps<{
    requestAccount: Function,
    goToFirstPage: Function
}>();

// Отслеживает открытие модального окна для удаления фильма
const isShowFilmRemoveModal = ref(false);
// Содержит id удаляемого фильма
const removeFilmId = ref(0);

// Фильтрует фильмы 
// Запрос отправляется нажатием на клавишу "Enter"
const putFilms = async function(e: KeyboardEvent) {
    if(e.key.toLowerCase() !== "enter") {
        return;
    }
    goToFirstPage();
};

// Отслеживает события таблицы фильмов
const handlerFilms = function(e: Event) {
    const target = e.target as Element;
    // Показывает модальное окно для удаления фильма
    if(target?.classList.contains('removal-film')) {
        removeFilmId.value = target.getAttribute('data-film-id') as any as number;
        toggleShowFilmRemoveModal();
    }
};

// Открывает/Закрывает модальное окно для удаления фильма
const toggleShowFilmRemoveModal = function() {
    isShowFilmRemoveModal.value = !isShowFilmRemoveModal.value
}

</script>

<template>
<div class="flex justify-between">
    <h2>Список доступных фильмов</h2>
</div>

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
                <img 
                    class="removal-film m-auto"
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
    :toggleShowFilmRemoveModal="toggleShowFilmRemoveModal"
    :removeFilmId="removeFilmId"
    :requestAccount="requestAccount"
/>
</template>
