<script setup lang="ts">
import { inject, ref } from 'vue';
import { useRouter } from 'vue-router'
import BreadCrumb from '../components/BreadCrumb.vue';
import Spinner from '../components/Spinner.vue';
import ErrorsList from '../components/ErrorsList.vue';
import InputLabel from '../components/InputLabel.vue';
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

const inputLogin = ref('');
const inputPassword = ref('');
const errors = ref([]);

const router = useRouter();
        
async function handlerLogin(e: Event) {
    e.preventDefault();
    
    const result = await request(app, `${app.basicUrl}/login`, 'POST',
        JSON.stringify({
            login: inputLogin.value,
            password: inputPassword.value,
            token: app.token,
            aud: app.aud
        }),
        {app, user}
    );
    
    if (!result.errors.length) {
        router.push({ name: 'home' });
    } else {
        errors.value = result.errors;
        inputPassword.value = '';
    }
}
</script>

<template>
<BreadCrumb :linksList="linksList" />
    <h1>Вход</h1>
    
    <Spinner v-if="app.isRequest" />
    <template v-else>
        <InputLabel>
            Логин: 
            <input type="text" class="form-control" v-model="inputLogin" />
        </InputLabel>
        <InputLabel>
            Пароль:
            <input type="password" class="form-control" v-model="inputPassword" />
        </InputLabel>
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
