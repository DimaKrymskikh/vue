<script setup lang="ts">
import Modal from '../Modal.vue';
import Spinner from '../Spinner.vue';
import ErrorsList from '../ErrorsList.vue';

defineProps<{
    password: String,
    isRequest: Boolean,
    hideAccountRemoveModal: (payload: MouseEvent) => void,
    handlerRemoveAccount: (payload: MouseEvent) => void,
    errors: Array<String>
}>();

const emit = defineEmits<{
    (e: 'update:password', password: string): void
}>();
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
                <input
                    type="password"
                    :value="password"
                    @input="$emit('update:password', ($event.target as HTMLInputElement)?.value)"
                    v-else
                />
            </label>
        </div>
        <ErrorsList class="w-full" :errors="errors" />
    </template>
</Modal>
</template>

