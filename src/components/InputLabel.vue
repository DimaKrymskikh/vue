<script setup lang="ts">
defineProps({
    isHidden: Boolean,
    errorText: String
});
</script>

<template>
    <div class="flex">
        <div class="mb-4 w-1/3 pr-4">
            <label>
                <slot></slot>
            </label>
        </div>
        <div class="mb-4 w-2/3 pl-4 text-red-500 font-sans text-xs">
            <span :hidden="isHidden">{{errorText}}</span>
        </div>
    </div>
</template>
