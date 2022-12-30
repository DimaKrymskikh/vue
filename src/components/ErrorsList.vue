<script setup lang="ts">
defineProps({
    errors: Array<String>
});
</script>

<template>
    <div class="font-sans"  :hidden="!errors?.length">
        <div class="text-red-700 bg-red-100 rounded-lg px-6 py-2 mb-2 border border-red-500" v-for="error in errors">{{error}}</div>
    </div>
</template>
