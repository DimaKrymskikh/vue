<script setup lang="ts">
import { inject, reactive, ref, computed } from 'vue';
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
                link: '/login',
                text: 'Вход'
            }, {
                text: 'Регистрация'
            }];

const app = inject('app') as App;
const user = inject('user') as User;

const inputLogin = ref('');
const login = computed(() => {
    let text = inputLogin.value;
    let isLogin = user.testLogin(text);
    let isHidden = text === '' || isLogin;
    let loginError = user.getErrorsListLogin(text);
    
    return {
        text,
        isLogin,
        isHidden,
        loginError
    }
});

const inputPassword = ref('');
const password = computed(() => {
    let text = inputPassword.value;
    let isPassword = user.testPassword(text);
    let isHidden = text === '' || isPassword;
    let passwordError = user.getErrorsListPassword(text);
    
    return {
        text,
        isPassword,
        isHidden,
        passwordError
    }
});

const inputVerification = ref('');
const verification = computed(() => {
    let text = inputVerification.value;
    let isEmpty = text === '';
    let isVerification = text === inputPassword.value;
    let isHidden = isEmpty || isVerification;
    
    return {
        text,
        isVerification,
        isHidden
    }
});

const errors = ref([]);

const router = useRouter();

const verificationError = "Нет совпадения";
        
async function handlerRegistration(e: Event) {
    e.preventDefault();
    
    const currentTarget = e.currentTarget as Element;
    
    if (currentTarget?.classList.contains('disabled')) {
        return;
    }

    const result = await request(app, `${app.basicUrl}/register`, 'POST',
        JSON.stringify({
            login: login.value.text,
            password: password.value.text,
            verification: verification.value.text,
            token: app.token,
            aud: app.aud
        }),
        {app, user}
    );
   
    if (!result.errors.length) {
        router.push({ name: 'home' });
    } else {
        errors.value = result.errors;
        inputVerification.value = '';
        inputPassword.value = '';
    }
}
</script>

<template>
    <BreadCrumb :linksList="linksList" />
    <h1>Регистрация</h1>
    
    <Spinner :hSpinner="'h-96'" v-if="app.isRequest" />
    <template v-else>
        <InputLabel :isHidden="login.isHidden" :errorText="login.loginError">
            Логин:
            <input type="text" v-model="inputLogin" />
        </InputLabel>
        <InputLabel :isHidden="password.isHidden" :errorText="password.passwordError">
            Пароль:
            <input type="password" v-model="inputPassword" />
        </InputLabel>
        <InputLabel :isHidden="verification.isHidden" :errorText="verificationError">
            Подтверждение пароля:
            <input type="password" v-model="inputVerification" />
        </InputLabel>
        <div class="mb-3 w-1/3 text-right">
            <button
                class="p-1 w-48 rounded-lg"
                :class="login.isLogin && password.isPassword && verification.isVerification ? 'bg-orange-300 text-orange-700 hover:bg-orange-200 text-orange-600' : 'disabled'"
                @click="handlerRegistration"
            >
                Зарегистрироваться
            </button>
        </div>

        <ErrorsList :errors="errors" />
    </template>
</template>
