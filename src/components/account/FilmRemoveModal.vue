<script setup lang="ts">
import { inject, ref } from 'vue';
import { useRouter } from 'vue-router';
import Modal from '../Modal.vue';
import Spinner from '../Spinner.vue';
import ErrorsList from '../ErrorsList.vue';
import type { App } from '../../stores/app';
import type { Pagination } from '../../stores/pagination';

const router = useRouter();

const app = inject('app') as App;
const paginationAccount = inject('paginationAccount') as Pagination;

const { removeFilmId, toggleShowFilmRemoveModal, requestAccount } = defineProps<{
    removeFilmId: Number,
    toggleShowFilmRemoveModal: Function,
    requestAccount: Function
}>();

// Выполняется ли запрос. При монтировке компоненты выполняется запрос
const isRequest = ref(true);
// Величина поля для пароля
const inputPassword = ref('');
// Сообщение об ошибке из-за неправильно введённого пароля
const errors = ref([]);
// Название удаляемого фильма
const removeFilmName = ref('');

// Запрос для получения названия фильма, который собираются удалить
(async function() {
    const result = await app.request(`account/getFilm/${removeFilmId}`, 'POST', {}, {}, false);
    
    isRequest.value = false;
    // Имя удаляемого фильма
    removeFilmName.value = result.title;
})();

// Скрывает модальное окно для удаления фильма
const hideFilmRemoveModal = function(e: Event) {
    const target = e.currentTarget as Element;
    // Если выполняется запрос, то закрыть модальное окно нельзя
    if(target?.classList.contains('disabled') || target?.classList.contains('stop-event')) {
        return;
    }
    toggleShowFilmRemoveModal();
};

// Обработчик удаления фильма
const handlerRemoveFilm = async function(e: Event) {
    e.stopPropagation();
    const target = e.currentTarget as Element;
    // Блокируем повторное удаление фильма
    if(target?.classList.contains('disabled')) {
        return;
    }
    isRequest.value = true;
    
    // Запрос на удаления фильма
    const result = await app.request(`userFilm/${removeFilmId}`, 'DELETE',
        {
            password: inputPassword.value
        },
        {},
        false
    );

    isRequest.value = false;
    // Если пароль введён верно
    if (result.errors.length === 0) {
        // Если на странице удалялся последний фильм, то используем router.push, чтобы обновить данные
        if (paginationAccount.getPageAfterRemoveFilm() !== paginationAccount.activePage) {
            await router.push({name: 'account', params: {pageId: paginationAccount.getPageAfterRemoveFilm()}});
        // Иначе (route.params.pageId === paginationAccount.activePage и router.push не обновит данные), делаем запрос
        } else {
            await requestAccount();
        }
        toggleShowFilmRemoveModal();
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
    :headerTitle="'Подтверждение удаления фильма'"
    :handlerSubmit="handlerRemoveFilm"
    :hideModal="hideFilmRemoveModal"
>
    <template v-slot:body>
        Вы действительно хотите удалить фильм 
        <Spinner :hSpinner="'h-4'" class="inline-block" v-if="isRequest"/>
        <span id="remove-film-name" v-else>{{removeFilmName}}</span>?
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
