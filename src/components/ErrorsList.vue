<script setup lang="ts">
defineProps({
    errors: Array<String>
});
</script>

<template>
    <div class="list-group"  :hidden="!errors?.length">
        <p class="list-group-item list-group-item-action list-group-item-danger" v-for="error in errors">{{error}}</p>
    </div>
</template>

