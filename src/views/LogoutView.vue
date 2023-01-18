<script setup lang="ts">
import { inject, ref } from 'vue';
import { useRouter } from 'vue-router'
import Spinner from '../components/Spinner.vue';
import type { App } from '../stores/app';
import type { User } from '../stores/user';

const app = inject('app') as App;
const user = inject('user') as User;

const router = useRouter();

(async function() {
    await app.request('logout', 'POST', {}, {app, user});
    router.push({ name: 'home' });
})();
</script>

<template>
    <Spinner class="flex justify-center" :hSpinner="'h-96'" v-if="app.isRequest" />
</template>
