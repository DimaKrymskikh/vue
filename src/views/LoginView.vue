<script setup lang="ts">
import { inject, ref } from 'vue';
import { useRouter } from 'vue-router'
import BreadCrumb from '../components/BreadCrumb.vue';
import Spinner from '../components/Spinner.vue';
import ErrorsList from '../components/ErrorsList.vue';
import { request } from '../tools/request';
import type { App } from '../stores/app';
import type { User } from '../stores/user';

const linksList = [{
            link: '/',
            text: 'Главная страница'
        }, {
            text: 'Вход'
        }];

const app = inject('app') as App;
const user = inject('user') as User;

let login = '';
let password = '';
const errors = ref([]);

const router = useRouter();
        
async function handlerLogin(e: Event) {
    e.preventDefault();
    
    const result = await request(app, `${app.basicUrl}/login`, 'POST',
        JSON.stringify({
            login,
            password,
            token: app.token,
            aud: app.aud
        }),
        {app, user}
    );
    
    if (!result.errors.length) {
        router.push({ name: 'home' });
    } else {
        errors.value = result.errors;
        password = '';
    }
}
</script>

<template>
    <BreadCrumb :linksList="linksList" />
    <h1>Вход</h1>
    
    <Spinner v-if="app.isRequest" />
    <template v-else>
        <div class="mb-3">
            <label class="form-label">Логин: 
                <input type="text" class="form-control" name="login" v-model="login" />
            </label>
        </div>
        <div class="mb-3">
            <label class="form-label">Пароль:
                <input type="password" class="form-control" name="password" v-model="password" />
            </label>
        </div>
        <div class="mb-3">
            <button class="btn btn-primary" @click="handlerLogin">Вход</button>
        </div>

        <p>
            <RouterLink class="btn btn-link" to="/register">
                Регистрация
            </RouterLink>
        </p>

        <ErrorsList :errors="errors" />
    </template>
</template>
