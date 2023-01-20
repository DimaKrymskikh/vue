<script setup lang="ts">
import { inject, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import FilmsTable from '@/components/account/FilmsTable.vue';
import AccountRemoveModal from '@/components/account/AccountRemoveModal.vue';
import BreadCrumb from '@/components/BreadCrumb.vue';
import PaginationNav from '@/components/PaginationNav.vue';
import Dropdown from '@/components/Dropdown.vue';
import Spinner from '@/components/Spinner.vue';

import type { RouteLocationRaw } from "vue-router";
import type { App } from '@/stores/app';
import type { User } from '@/stores/user';
import type { Films } from '@/stores/films';
import type { Pagination } from '@/stores/pagination';

const router = useRouter();
const route = useRoute();

// Список для хлебных крошек
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

// Отслеживает открытие модального окна для удаления аккаунта
const isShowAccountRemoveModal = ref(false)

// Запрос на получение списка фильмов
const requestAccount = async function() {
    // Запрос на сервер для получения списка фильмов и параметров пагинации
    await app.request(`account/index/${route.params.pageId}/${paginationAccount.itemsNumberOnPage}`, 'POST',
        {
            sortFilmTitle: filmsAccount.sortFilmTitle,
            sortFilmDescription: filmsAccount.sortFilmDescription
        },
        {
            films: filmsAccount,
            pagination: paginationAccount
        }
    );
};

// Осуществляет переход на 1-ю страницу
// router.push не может выполнить переход с 1-й страницы на 1-ю после изменения списка фильмов
const goToFirstPage = async function() {
    // Если находились на 1-й странице, то используем requestCatalog
    if (parseInt(route.params.pageId as string, 10) === 1) {
        await requestAccount();
    // Если находились не на 1-й странице, то используем router.push
    } else {
        await router.push({name: 'account', params: {pageId: 1}});
    }
}

// Изменяет число фильмов на странице
const changeNumberOfFilmsOnPage = function(newNumber: number) {
    // Сохраняем новое число фильмов на странице в хранилище paginationAccount
    paginationAccount.itemsNumberOnPage = newNumber;
    // Получаем данные с сервера для 1-й страницы
    goToFirstPage();
}

// Открывает/Закрывает модальное окно для удаления аккаунта
const toggleShowAccountRemoveModal = function() {
    isShowAccountRemoveModal.value = !isShowAccountRemoveModal.value
}

// Получаем данные при монтировании компоненты
requestAccount();

// Отслеживаем пагинацию
watch(
    () => route.params.pageId,
    requestAccount
);
</script>

<template>
<BreadCrumb :linksList="linksList" />
<h1>{{user.login}}. Личный кабинет</h1>

<Spinner class="flex justify-center" :hSpinner="'h-96'" v-if="app.isRequest" />
<template v-else>
    <div class="flex justify-between">
        <Dropdown
            class="mb-2"
            :itemsNumberOnPage="paginationAccount.itemsNumberOnPage"
            :changeNumber="changeNumberOfFilmsOnPage"
            :buttonName="'Число фильмов на странице'"/>
        <button
            class="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-300 hover:text-red-900 rounded-lg"
            @click="toggleShowAccountRemoveModal"
        >
            Удалить аккаунт
        </button>
    </div>
    <FilmsTable :requestAccount="requestAccount" :goToFirstPage="goToFirstPage"/>
    <PaginationNav :routeName="'account'" :pagination="paginationAccount"/>
    <AccountRemoveModal
        v-if="isShowAccountRemoveModal"
        :toggleShowAccountRemoveModal="toggleShowAccountRemoveModal"
    />
</template>
</template>
