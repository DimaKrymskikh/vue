<script setup lang="ts">
import BreadCrumb from '../components/BreadCrumb.vue';

const linksList = [{
            link: '/',
            text: 'Главная страница'
        }, {
            text: 'Вход'
        }];
</script>

<template>
    <BreadCrumb :linksList="linksList" />
    <h1>Вход</h1>
</template>
