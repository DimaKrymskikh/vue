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
    isHiddenPagination: Function;
    [index: string]: any;
}

const paginationModel = function() {
    // Активная страница
    const activePage = ref(0 as number);
    // Число элементов на странице
    const itemsNumberOnPage = ref(0 as number);
    // Общее число элементов в списке
    const itemsNumberTotal = ref(0 as number);
    // Число страниц в списке
    const pagesNumber = ref(0 as number);
    // Номер первой кнопки 
    const firstButton = ref(0 as number);
    // Номер последней кнопки 
    const lastButton = ref(0 as number);
    // Число элементов на активной странице
    // Если активная страница - последняя страница, то elementsNumberOnActivePage может быть меньше itemsNumberOnPage
    const elementsNumberOnActivePage = ref(0 as number);

    /**
     * Изменяет свойства пагинации
     * (Данные приходят с сервера, где реализуется логика вычисления свойств пагинации)
     * @param {Object} data - Новые свойства пагинации
     * @returns {void}
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
     * Возвращает номер страницы, который будет отдан на сервер после удаления фильма
     * @returns {int}
     */
    const getPageAfterRemoveFilm = function(this: Pagination) {
        return this.elementsNumberOnActivePage - 1 ? this.activePage : this.activePage - 1;
    };

    /**
     * Если нет элементов в списке, то возвращает true, чтобы скрыть пагинацию на странице
     * @returns {Boolean}
     */
    const isHiddenPagination = function(this: Pagination) {
        return !this.itemsNumberTotal;
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
        isHiddenPagination
    };
}

export const paginationCatalogStore = defineStore("paginationCatalog", paginationModel);
export const paginationAccountStore = defineStore("paginationAccount", paginationModel);
