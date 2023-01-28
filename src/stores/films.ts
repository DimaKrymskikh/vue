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
}

const filmsModel = function() {
    // Массив объектов (список фильмов), свойства которых определяет сервер
    const films = [] as Array<Film>;
    // Фильтр по названию фильма
    const sortFilmTitle = '';
    // Фильтр по описанию фильма
    const sortFilmDescription = '';
    // Обновляет список фильмов
    const setData = function(this: Films, data: Array<Film>) {
        this.films = data;
    };
    
    return { 
        films,
        sortFilmTitle,
        sortFilmDescription,
        setData
    };
}

export const filmsCatalogStore = defineStore("filmsCatalog", filmsModel);
export const filmsAccountStore = defineStore("filmsAccount", filmsModel);
