<script setup lang="ts">
import { inject, ref } from 'vue';
import { useRouter } from 'vue-router'
import Spinner from '../components/Spinner.vue';
import { request } from '../tools/request';
import type { App } from '../stores/app';
import type { User } from '../stores/user';

const app = inject('app') as App;
const user = inject('user') as User;

const router = useRouter();

(async function() {
    
    await request(app, `${app.basicUrl}/logout`, 'POST',
        JSON.stringify({
            token: app.token,
            aud: app.aud
        }),
        {app, user}
    );
    
    router.push({ name: 'home' });
})();
</script>

<template>
    <Spinner v-if="app.isRequest" />
</template>

