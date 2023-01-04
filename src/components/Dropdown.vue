<script setup lang="ts">
import { ref } from 'vue';

const { changeNumber } = defineProps<{
    buttonName: string,         /* Текст кнопки */
    itemsNumberOnPage: number,  /* Выбранное число в списке */
    changeNumber: Function      /* Изменяет число элементов на странице */
}>();

// Массив значений для выпадающего списка
const options = [10, 20, 50, 100]; 
// Нужно ли показывать выпадающий список. При монтировании компоненты список скрыт
const isShowList = ref(false);

// Показывает/Скрывает выпадающий список
const toggleShowList = function() {
    isShowList.value = !isShowList.value
}

// Изменяет число элементов на странице
const handlerSelect = function(e: Event) {
    const target = e.target as Element;
    if (target?.classList.contains('select')) {
        return;
    }
    toggleShowList();
    changeNumber(parseInt(target.getAttribute('data-number') as string, 10));
}
</script>

<template>
    <div class="relative">
        <button
            class="bg-orange-200 text-orange-500 px-6 py-2 hover:bg-orange-300 hover:text-orange-700 rounded-lg"
            @click="toggleShowList"
        >
            {{buttonName}}
        </button>
        <ul
            class="absolute w-1/6 bg-white"
            @click="handlerSelect"
            v-if="isShowList"
        >
            <li
                class="text-center border-b"
                :class="n === itemsNumberOnPage ? 'select bg-orange-100 cursor-not-allowed' : 'cursor-pointer'"
                v-for="n in options"
                :data-number="n"
            >
                {{n}}
            </li>
        </ul>
    </div>
</template>
