<script setup lang="ts">
defineProps({
    isHidden: Boolean,
    errorText: String
});
</script>

<template>
    <div class="mb-3">
        <label class="form-label">
            <slot></slot>
        </label>
        <span class="alert-input" :hidden="isHidden">{{errorText}}</span>
    </div>
</template>
