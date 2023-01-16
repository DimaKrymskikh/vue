import { ref } from "vue";
import { defineStore } from "pinia";

export interface Film {
    filmId?: number;
    title?: string;
    description?: string;
    releaseYear?: number;
    actorNames?: Array<string>;
    language?: string;
    [index: string]: any;
}

const filmModel = function() {
    // id фильма
    let filmId;
    // Название
    let title;
    // Описание фильма
    let description;
    // Год выхода фильма
    let releaseYear;
    // Список актёров
    let actorNames;
    // Язык, на котором снят фильм
    let language;

    /**
     * Изменяет свойства фильма
     * @param {Object} data
     * @returns {void}
     */
    const setData = function(this: Film, data: Film) {
        for (let field in data) {
            if (!this.hasOwnProperty(field)) {
                continue;
            }
            this[field] = data[field];
        }
    };
    
    return {
        filmId,
        title,
        description,
        releaseYear,
        actorNames,
        language,
        setData
    };
}

export const filmCardStore = defineStore("filmCard", filmModel);
