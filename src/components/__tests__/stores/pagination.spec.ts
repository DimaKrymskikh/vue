import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";

import { setActivePinia, createPinia } from 'pinia';
import { paginationCatalogStore, paginationAccountStore } from "../../../stores/pagination";
import type { Pagination } from '../../../stores/pagination';

describe("Хранилище pagination", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });
    
    it("Применение setData", () => {
        const paginationCatalog = paginationCatalogStore();
        const paginationAccount = paginationAccountStore();
        // Дефолтные значения
        // paginationCatalog
        expect(paginationCatalog.activePage).toBe(1);
        expect(paginationCatalog.itemsNumberOnPage).toBe(0);
        expect(paginationCatalog.itemsNumberTotal).toBe(0);
        expect(paginationCatalog.pagesNumber).toBe(0);
        expect(paginationCatalog.firstButton).toBe(0);
        expect(paginationCatalog.lastButton).toBe(0);
        expect(paginationCatalog.elementsNumberOnActivePage).toBe(0);
        // paginationAccount
        expect(paginationAccount.activePage).toBe(1);
        expect(paginationAccount.itemsNumberOnPage).toBe(0);
        expect(paginationAccount.itemsNumberTotal).toBe(0);
        expect(paginationAccount.pagesNumber).toBe(0);
        expect(paginationAccount.firstButton).toBe(0);
        expect(paginationAccount.lastButton).toBe(0);
        expect(paginationAccount.elementsNumberOnActivePage).toBe(0);
        
        // Изменяем paginationCatalog
        paginationCatalog.setData({
            activePage: 5,
            itemsNumberOnPage: 20,
            itemsNumberTotal: 1000,
            pagesNumber: 50,
            firstButton: 3,
            lastButton: 7,
            elementsNumberOnActivePage: 20
        } as Pagination);
        // Изменяем paginationAccount
        paginationAccount.setData({
            activePage: 3,
            itemsNumberOnPage: 20,
            itemsNumberTotal: 44,
            pagesNumber: 3,
            firstButton: 1,
            lastButton: 3,
            elementsNumberOnActivePage: 4
        } as Pagination);
        
        // Получаем разные хранилища
        // paginationCatalog
        expect(paginationCatalog.activePage).toBe(5);
        expect(paginationCatalog.itemsNumberOnPage).toBe(20);
        expect(paginationCatalog.itemsNumberTotal).toBe(1000);
        expect(paginationCatalog.pagesNumber).toBe(50);
        expect(paginationCatalog.firstButton).toBe(3);
        expect(paginationCatalog.lastButton).toBe(7);
        expect(paginationCatalog.elementsNumberOnActivePage).toBe(20);
        // paginationAccount
        expect(paginationAccount.activePage).toBe(3);
        expect(paginationAccount.itemsNumberOnPage).toBe(20);
        expect(paginationAccount.itemsNumberTotal).toBe(44);
        expect(paginationAccount.pagesNumber).toBe(3);
        expect(paginationAccount.firstButton).toBe(1);
        expect(paginationAccount.lastButton).toBe(3);
        expect(paginationAccount.elementsNumberOnActivePage).toBe(4);
    });
    
    it("getPageAfterRemoveFilm", () => {
        const paginationCatalog = paginationCatalogStore();
        // Активная страница остаётся прежней
        paginationCatalog.activePage = 3;
        paginationCatalog.elementsNumberOnActivePage = 8;
        expect(paginationCatalog.getPageAfterRemoveFilm()).toBe(3);
        // Активная страница изменяется
        paginationCatalog.elementsNumberOnActivePage = 1;
        expect(paginationCatalog.getPageAfterRemoveFilm()).toBe(2);
    });
});
