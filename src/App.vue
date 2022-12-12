<script setup lang="ts">
import { inject } from 'vue';
import { RouterLink, RouterView } from "vue-router";
import { request } from './tools/request';
import type { App } from './stores/app';

const app = inject('app') as App;

(async function() {
    await request(app, `${app.basicUrl}/init/${app.aud}`, 'GET', null, {app});
})();
</script>

<template>
    <nav class="navbar navbar-expand-lg bg-mystyle">
        <div class="container">
            <div id="nav-home">
                <RouterLink class="navbar-brand" to="/">
                    <img src="@/assets/svg/house.svg" alt="Домашняя страница">
                </RouterLink>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
            </div>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li id="nav-catalog" class="nav-item">
                        <RouterLink class="nav-link nav-span" to="/catalog">Каталог</RouterLink>
                    </li>
                    <li id="nav-account" class="nav-item" v-if="!app.isGuest">
                        <RouterLink class="nav-link nav-span" to="/account">ЛК</RouterLink>
                    </li>
                    <li id="nav-login" class="nav-item" v-if="app.isGuest">
                        <RouterLink class="nav-link nav-span" to="/login">Вход</RouterLink>
                    </li>
                    <li id="nav-logout" class="nav-item" v-if="!app.isGuest">
                        <RouterLink class="nav-link nav-span" to="/logout">Выход</RouterLink>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    
    <main class="container">
        <RouterView />
    </main>
</template>
