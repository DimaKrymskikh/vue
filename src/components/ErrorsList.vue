<script setup lang="ts">
defineProps({
    errors: Array<String>
});
</script>

<template>
    <div class="w-1/3 font-sans"  :hidden="!errors?.length">
        <div class="text-red-500 bg-red-100 rounded-lg p-2 mb-2" v-for="error in errors">{{error}}</div>
    </div>
</template>
