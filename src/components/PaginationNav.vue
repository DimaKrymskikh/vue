<script setup lang="ts">
import { inject, computed } from 'vue';
import type { App } from '../stores/app';
import type { Pagination } from '../stores/pagination';

const { pagination, request } = defineProps<{
    pagination: Pagination,
    request: Function
}>();

const app = inject('app') as App;

const disabledFirstActivePage = computed(() => pagination.activePage === 1 ? 'disabled' : '');
const disabledLastActivePage = computed(() => pagination.activePage === pagination.pagesNumber ? 'disabled' : '');

const buttons = computed(() => {
    const arr = [];
    for(let i = pagination.firstButton; i <= pagination.lastButton; i++) {
        arr.push(i);
    }

    return arr;
});

async function turnPage (e: Event) {
    const target = e.target as Element;
    const parent = target?.parentNode as Element;
    let tag;
    if (parent.classList.contains('page-item') && !parent.classList.contains('active') && !parent.classList.contains('disabled')) {
        tag = parent;
    } else {
        return;
    }

    await request(pagination, tag.getAttribute('data-page'));
}

</script>

<template>
    <nav class="font-sans m-2" @click="turnPage" v-if="pagination.pagesNumber > 1">
        <ul class="flex justify-center">
            <li
                class="page-item mx-1 border text-center rounded-l-xl"
                :class="pagination.activePage === 1 ? 'disabled' : 'border-orange-300 text-orange-700 bg-orange-100 hover:text-orange-800 hover:bg-orange-200 cursor-pointer'"
                :data-page="1"
            >
                <span class="block w-8 p-1">&laquo;</span>
            </li>
            <template v-for="n in buttons">
                <li 
                    class="page-item mx-1 border text-center border-orange-300"
                    :class="pagination.activePage === n ? 'active' : 'text-orange-700 bg-orange-100 hover:text-orange-800 hover:bg-orange-200 cursor-pointer'"
                    :data-page="n"
                >
                    <span class="block w-8 p-1">{{n}}</span>
                </li>
            </template>
            <li
                class="page-item mx-1 border text-center rounded-r-xl"
                :class="pagination.activePage === pagination.pagesNumber ? 'disabled' : 'border-orange-300 text-orange-700 bg-orange-100 hover:text-orange-800 hover:bg-orange-200 cursor-pointer'"
                :data-page="pagination.pagesNumber"
            >
                <span class="block w-8 p-1">&raquo;</span>
            </li>
        </ul>
    </nav>
</template>
