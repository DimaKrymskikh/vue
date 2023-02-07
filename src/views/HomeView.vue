<script setup lang="ts">
import { inject } from 'vue';
import BreadCrumb from '../components/BreadCrumb.vue';
import Spinner from '../components/Spinner.vue';
import type { App } from '../stores/app';

const linksList = [{
            text: 'Главная страница'
        }];

const app = inject('app') as App;

const title = 'Главная страница';
document.title = title;
</script>

<template>
    <BreadCrumb :linksList="linksList" />
    <h1>{{title}}</h1>
    <Spinner class="flex justify-center" :hSpinner="'h-96'" v-if="app.isRequest" />
</template>
