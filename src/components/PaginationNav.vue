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
    if (parent.className.toLowerCase().trim() === 'page-item') {
        tag = parent;
    } else {
        return;
    }

    await request(pagination, tag.getAttribute('data-page'));
}

</script>

<template>
    <nav class="pagination-container" @click="turnPage">
        <ul class="pagination justify-content-center">
            <li class="page-item" :class="disabledFirstActivePage" :data-page="1">
                <span class="page-link">&laquo;</span>
            </li>
            <template v-for="n in buttons">
                <li class="page-item" :class="pagination.activePage === n ? 'active' : ''" :data-page="n">
                    <span class="page-link">{{n}}</span>
                </li>
            </template>
            <li class="page-item" :class="disabledLastActivePage" :data-page="pagination.pagesNumber">
                <span class="page-link">&raquo;</span>
            </li>
        </ul>
    </nav>
</template>