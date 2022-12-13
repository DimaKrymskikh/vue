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
                link: '/login',
                text: 'Вход'
            }, {
                text: 'Регистрация'
            }];

const app = inject('app') as App;
const user = inject('user') as User;

let login = '';
let password = '';
let verification = '';
const errors = ref([]);

const router = useRouter();
        
async function handlerRegistration(e: Event) {
    e.preventDefault();

    const result = await request(app, `${app.basicUrl}/register`, 'POST',
        JSON.stringify({
            login,
            password,
            verification,
            token: app.token,
            aud: app.aud
        }),
        {app, user}
    );
   
    if (!result.errors.length) {
        router.push({ name: 'home' });
    } else {
        errors.value = result.errors;
        verification = '';
        password = '';
    }
}
</script>

<template>
    <BreadCrumb :linksList="linksList" />
    <h1>Регистрация</h1>
    
    <Spinner v-if="app.isRequest" />
    <template v-else>
        <form id="register" action="" method="post">
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
                <label class="form-label">Подтверждение пароля: 
                    <input type="password" class="form-control" name="verification" v-model="verification" />
                </label>
            </div>
            <div class="mb-3">
                <button type="submit" class="btn btn-primary" @click="handlerRegistration">Зарегистрироваться</button>
            </div>
        </form>

        <ErrorsList :errors="errors" />
    </template>
</template>
