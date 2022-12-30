<script setup lang="ts">
import { inject } from 'vue';
import { RouterLink, RouterView } from "vue-router";
import HouseSvg from './components/svg/HouseSvg.vue';
import { request } from './tools/request';
import type { App } from './stores/app';
import type { Pagination } from './stores/pagination';

const app = inject('app') as App;
const paginationCatalog = inject('paginationCatalog') as Pagination;
const paginationAccount = inject('paginationAccount') as Pagination;

(async function() {
    await request(app, `${app.basicUrl}/init/${app.aud}`, 'GET', null, {app});
})();
</script>

<template>
    <nav class="bg-orange-300 shadow shadow-orange-200">
        <div class="lg:container">
            <ul class="flex flex-row">
                <li class="px-2 h-10 flex">
                    <RouterLink class="self-center" to="/">
                        <HouseSvg />
                    </RouterLink>
                </li>
                <li class="nav-tab">
                    <RouterLink class="nav-link" :to="{name: 'catalog', params: { pageId: paginationCatalog.activePage }}">Каталог</RouterLink>
                </li>
                <li class="nav-tab" v-if="!app.isGuest">
                    <RouterLink class="nav-link" :to="{name: 'account', params: { pageId: paginationAccount.activePage }}">ЛК</RouterLink>
                </li>
                <li class="nav-tab" v-if="app.isGuest">
                    <RouterLink class="nav-link" to="/login">Вход</RouterLink>
                </li>
                <li class="nav-tab" v-if="!app.isGuest">
                    <RouterLink class="nav-link" to="/logout">Выход</RouterLink>
                </li>
            </ul>
        </div>
    </nav>
    
    <main class="lg:container">
        <RouterView />
    </main>
</template>
