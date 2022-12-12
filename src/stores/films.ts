import { ref } from "vue";
import { defineStore } from "pinia";

interface Film {
    n: number;
    title: string;
    description: string;
    name: string;
    isAvailable: boolean;
    [index: string]: any;
}

export interface Films {
    films: Array<Film>;
    sortFilmTitle: string;
    sortFilmDescription: string;
    setData: Function;
    setSortFilmTitle: Function;
    setSortFilmDescription: Function;
}

export const useFilmsStore = defineStore("films", () => {
    // Массив объектов (список фильмов), свойства которых определяет сервер
    const films = ref([] as Array<Film>);
    // Фильтр по названию фильма
    const sortFilmTitle = ref('' as string);
    // Фильтр по описанию фильма
    const sortFilmDescription = ref('' as string);
    // Обновляет список фильмов
    const setData = function(this: Films, data: Array<Film>) {
        this.films = data;
    };
    // Изменяет фильтр по названию фильма
    const setSortFilmTitle = function(this: Films, text: string) {
        this.sortFilmTitle = text;
    };
    // Изменяет фильтр по описанию фильма
    const setSortFilmDescription = function(this: Films, text: string) {
        this.sortFilmDescription = text;
    };
    
    return { films, sortFilmTitle, sortFilmDescription, setData, setSortFilmTitle, setSortFilmDescription }
});
