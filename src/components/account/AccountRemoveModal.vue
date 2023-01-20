<script setup lang="ts">
import { inject, ref } from 'vue';
import { useRouter } from 'vue-router';
import Modal from '@/components/Modal.vue';
import Spinner from '@/components/Spinner.vue';
import ErrorsList from '@/components/ErrorsList.vue';
import type { App } from '@/stores/app';
import type { User } from '@/stores/user';

const router = useRouter();

const app = inject('app') as App;
const user = inject('user') as User;

const { toggleShowAccountRemoveModal } = defineProps<{
    toggleShowAccountRemoveModal: Function
}>();

// Выполняется ли запрос. При монтировке компоненты запрос не выполняется
const isRequest = ref(false);
// Величина поля для пароля
const inputPassword = ref('');
// Сообщение об ошибке из-за неправильно введённого пароля
const errors = ref([]);

// Скрывает модальное окно для удаления аккаунта
const hideAccountRemoveModal = function(e: Event) {
    const target = e.currentTarget as Element;
    // Если выполняется запрос, то закрыть модальное окно нельзя
    if(target?.classList.contains('disabled') || target?.classList.contains('stop-event')) {
        return;
    }
    toggleShowAccountRemoveModal();
};

// Обработчик удаления аккаунта
const handlerRemoveAccount = async function(e: Event) {
    const target = e.currentTarget as Element;
    // Блокируем повторное удаление аккаунта
    if(target?.classList.contains('disabled')) {
        return;
    }
    errors.value = [];
    isRequest.value = true;
    
    // Запрос на удаление аккаунта
    const result = await app.request('account', 'DELETE',
        {
            password: inputPassword.value,
        },
        {app, user},
        false
    );

    isRequest.value = false;
    
    if (!result) {
        return;
    }
    
    // Если пароль введён верно, то переходим на главную страницу
    if (result.errors.length === 0) {
        await router.push({name: 'home'});
    // Если пароль введён неверно
    } else {
        inputPassword.value = '';
        errors.value = result.errors;
    }
}
</script>

<template>
<Modal
    :modalId="'film-remove-modal'"
    :isRequest="isRequest"
    :headerTitle="'Подтверждение удаления аккаунта'"
    :handlerSubmit="handlerRemoveAccount"
    :hideModal="hideAccountRemoveModal"
>
    <template v-slot:body>
        Вы действительно хотите удалить свой аккаунт?
        <div class="mb-3">
            <label>Введите пароль: 
                <Spinner :hSpinner="'h-8'" class="flex justify-center" v-if="isRequest"/>
                <input type="password" v-model="inputPassword" v-else/>
            </label>
        </div>
        <ErrorsList class="w-full" :errors="errors" />
    </template>
</Modal>
</template>
