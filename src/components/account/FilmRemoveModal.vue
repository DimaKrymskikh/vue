<script setup lang="ts">
import Modal from '../Modal.vue';
import Spinner from '../Spinner.vue';
import ErrorsList from '../ErrorsList.vue';

defineProps<{
    password: String,
    isRequest: Boolean,
    filmName: String,
    filmId: Number,
    hideFilmRemoveModal: (payload: MouseEvent) => void,
    handlerRemoveFilm: (payload: MouseEvent) => void,
    removeFilmPassword: Element,
    errors: Array<String>
}>();

defineEmits<{(e: 'update', password: string): void}>();
</script>

<template>
<Modal
    :modalId="'film-remove-modal'"
    :isRequest="isRequest"
    :headerTitle="'Подтверждение удаления фильма'"
    :submitId="filmId"
    :handlerSubmit="handlerRemoveFilm"
    :hideModal="hideFilmRemoveModal"
>
    <template v-slot:body>
        Вы действительно хотите удалить фильм 
        <Spinner :hSpinner="'h-4'" class="inline-block" v-if="isRequest"/>
        <span id="remove-film-name" v-else>{{filmName}}</span>?
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
