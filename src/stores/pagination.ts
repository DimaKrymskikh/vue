import { ref } from "vue";
import { defineStore } from "pinia";

export interface Pagination {
    activePage: number;
    itemsNumberOnPage: number;
    itemsNumberTotal: number;
    pagesNumber: number;
    firstButton: number;
    lastButton: number;
    elementsNumberOnActivePage: number;
    setData: Function;
    getPageAfterRemoveFilm: Function;
    [index: string]: any;
}

const paginationModel = function() {
    // Активная страница
    // По умолчанию нужно использовать 1 (а не 0), чтобы правильно определялась активная страница при первом посещении
    const activePage = 1;
    // Число элементов на странице
    const itemsNumberOnPage = 0;
    // Общее число элементов в списке
    const itemsNumberTotal = 0;
    // Число страниц в списке
    const pagesNumber = 0;
    // Номер первой кнопки 
    const firstButton = 0;
    // Номер последней кнопки 
    const lastButton = 0;
    // Число элементов на активной странице
    // Если активная страница - последняя страница, то elementsNumberOnActivePage может быть меньше itemsNumberOnPage
    const elementsNumberOnActivePage = 0;

    /**
     * Изменяет свойства пагинации
     * (Данные приходят с сервера, где реализуется логика вычисления свойств пагинации)
     */
    const setData = function(this: Pagination, data: Pagination) {
        for (let field in data) {
            if (!this.hasOwnProperty(field)) {
                continue;
            }
            this[field] = data[field];
        }
    };
    
    /**
     * Возвращает номер активной страницы после удаления фильма
     */
    const getPageAfterRemoveFilm = function(this: Pagination) {
        return this.elementsNumberOnActivePage - 1 ? this.activePage : this.activePage - 1;
    };
    
    return {
        activePage,
        itemsNumberOnPage,
        itemsNumberTotal,
        pagesNumber,
        firstButton,
        lastButton,
        elementsNumberOnActivePage,
        setData,
        getPageAfterRemoveFilm,
    };
}

export const paginationCatalogStore = defineStore("paginationCatalog", paginationModel);
export const paginationAccountStore = defineStore("paginationAccount", paginationModel);
