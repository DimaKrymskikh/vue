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
    
    const currentTarget = e.currentTarget as Element;
    
    if (currentTarget?.classList.contains('disabled')) {
        return;
    }
    
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
    
    <Spinner :hSpinner="'h-96'" v-if="app.isRequest" />
    <template v-else>
        <InputLabel>
            Логин: 
            <input type="text" v-model="inputLogin" />
        </InputLabel>
        <InputLabel>
            Пароль:
            <input type="password" v-model="inputPassword" />
        </InputLabel>
        <div class="mb-3 w-1/3 text-right">
            <button 
                class="p-1 w-36 rounded-lg"
                :class="inputLogin === '' || inputPassword === '' ? 'disabled' : 'bg-orange-300 text-orange-700 hover:bg-orange-200 text-orange-600'"
                @click="handlerLogin"
            >
                Вход
            </button>
        </div>

        <div class="mb-4">
            Не зарегистрированы?
            <RouterLink class="ml-2 text-orange-700 hover:text-orange-900" to="/register">
                Регистрация
            </RouterLink>
        </div>

        <ErrorsList :errors="errors" />
    </template>
</template>
