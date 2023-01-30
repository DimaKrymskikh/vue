<script setup lang="ts">
import { inject } from 'vue';
import { RouterLink, RouterView } from "vue-router";
import HouseSvg from '@/components/svg/HouseSvg.vue';
import ForbiddenModal from '@/components/ForbiddenModal.vue';
import AlertAuthentication from '@/components/AlertAuthentication.vue';
import type { App } from '@/stores/app';
import type { Pagination } from '@/stores/pagination';

const app = inject('app') as App;
const paginationCatalog = inject('paginationCatalog') as Pagination;
const paginationAccount = inject('paginationAccount') as Pagination;

// Запрос при загрузке приложения
(async function() {
    await app.request(`init/${app.aud}`, 'GET', null, {app});
})();
</script>

<template>
    <nav id="main-nav" class="bg-orange-300 shadow shadow-orange-200">
        <div class="lg:container">
            <ul class="flex flex-row">
                <li class="px-2 h-12 flex">
                    <RouterLink class="self-center" to="/">
                        <HouseSvg />
                    </RouterLink>
                </li>
                <li class="nav-tab">
                    <RouterLink class="nav-link small-caps" :to="{name: 'catalog', params: { pageId: paginationCatalog.activePage }}">каталог</RouterLink>
                </li>
                <li class="nav-tab" v-if="!app.isGuest">
                    <RouterLink class="nav-link small-caps" :to="{name: 'account', params: { pageId: paginationAccount.activePage }}">лк</RouterLink>
                </li>
                <li class="nav-tab" v-if="app.isGuest">
                    <RouterLink class="nav-link small-caps" to="/login">вход</RouterLink>
                </li>
                <li class="nav-tab" v-if="!app.isGuest">
                    <RouterLink class="nav-link small-caps" to="/logout">выход</RouterLink>
                </li>
            </ul>
        </div>
    </nav>

    <main class="lg:container">
        <AlertAuthentication v-if="app.isGuest"/>
        <RouterView />
    </main>
    
    <ForbiddenModal :message="app.errorMessage" v-if="app.isForbidden" />
</template>
