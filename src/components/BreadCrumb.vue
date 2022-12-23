<script setup lang="ts">
import { RouterLink } from "vue-router";
import type { RouteLocationRaw } from "vue-router";

interface Link {
    link?: RouteLocationRaw;
    text: string;
};

defineProps({
    linksList: Array<Link>
});
    
</script>

<template>
    <nav class="mb-4">
        <ol class="flex">
            <template v-for="(item) in linksList">
                <li class="text-gray-400 py-2" v-if="item.link === undefined">
                    {{item.text}}
                </li>
                <li class="text-orange-700 py-2 hover:text-orange-900 after:content-['/'] after:px-2 after:text-orange-900" v-else>
                    <RouterLink :to="item.link">{{item.text}}</RouterLink>
                </li>
            </template>
        </ol>
    </nav>
    
</template>
