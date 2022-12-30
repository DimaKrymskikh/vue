<script setup lang="ts">
import { inject, computed } from 'vue';
import { RouterLink } from "vue-router";
import type { RouteRecordName } from 'vue-router';
import type { App } from '../stores/app';
import type { Pagination } from '../stores/pagination';

const { pagination } = defineProps<{
    pagination: Pagination,
    routeName: RouteRecordName
}>();

const app = inject('app') as App;

const buttons = computed(() => {
    const arr = [];
    for(let i = pagination.firstButton; i <= pagination.lastButton; i++) {
        arr.push(i);
    }

    return arr;
});
</script>

<template>
    <nav class="font-sans m-2" v-if="pagination.pagesNumber > 1">
        <ul class="flex justify-center">
            <RouterLink
                class="page-item mx-1 border text-center rounded-l-xl"
                :class="pagination.activePage === 1 ? 'disabled' : 'border-orange-300 text-orange-700 bg-orange-100 hover:text-orange-800 hover:bg-orange-200 cursor-pointer'"
                :to="{name: routeName, params: { pageId: 1 }}"
            >
                <span class="block w-8 p-1">&laquo;</span>
            </RouterLink>
            <template v-for="n in buttons">
                <RouterLink 
                    class="page-item mx-1 border text-center border-orange-300"
                    :class="pagination.activePage === n ? 'active' : 'text-orange-700 bg-orange-100 hover:text-orange-800 hover:bg-orange-200 cursor-pointer'"
                    :to="{name: routeName, params: { pageId: n }}"
                >
                    <span class="block w-8 p-1">{{n}}</span>
                </RouterLink>
            </template>
            <RouterLink
                class="page-item mx-1 border text-center rounded-r-xl"
                :class="pagination.activePage === pagination.pagesNumber ? 'disabled' : 'border-orange-300 text-orange-700 bg-orange-100 hover:text-orange-800 hover:bg-orange-200 cursor-pointer'"
                :to="{name: routeName, params: { pageId: pagination.pagesNumber }}"
            >
                <span class="block w-8 p-1">&raquo;</span>
            </RouterLink>
        </ul>
    </nav>
</template>
