<script setup lang="ts">
import { inject, ref } from 'vue';
import { useRouter } from 'vue-router'
import BreadCrumb from '@/components/BreadCrumb.vue';
import Spinner from '@/components/Spinner.vue';
import ErrorsList from '@/components/ErrorsList.vue';
import InputLabel from '@/components/InputLabel.vue';
import type { App } from '@/stores/app';
import type { User } from '@/stores/user';

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
    const currentTarget = e.currentTarget as Element;
    
    if (currentTarget?.classList.contains('disabled')) {
        return;
    }
    
    const result = await app.request('login', 'POST',
        {
            login: inputLogin.value,
            password: inputPassword.value,
        },
        {app, user}
    );
    
    if (!result) {
        return;
    }
    
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
    
    <Spinner class="flex justify-center" :hSpinner="'h-96'" v-if="app.isRequest" />
    <template v-else>
        <InputLabel>
            Логин: 
            <input type="text" name="login" v-model="inputLogin" />
        </InputLabel>
        <InputLabel>
            Пароль:
            <input type="password" name="password" v-model="inputPassword" />
        </InputLabel>
        <div class="mb-3 w-1/3 pr-4 text-right">
            <button
                id="login-button"
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

        <ErrorsList class="w-1/3" :errors="errors" />
    </template>
</template>
