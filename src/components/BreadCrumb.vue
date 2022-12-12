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
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <template v-for="(item) in linksList">
                <li class="breadcrumb-item active" v-if="item.link === undefined">
                    {{item.text}}
                </li>
                <li class="breadcrumb-item" v-else>
                    <RouterLink :to="item.link">{{item.text}}</RouterLink>
                </li>
            </template>
        </ol>
    </nav>
    
</template>
