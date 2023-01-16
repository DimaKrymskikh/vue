import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";

import { setActivePinia, createPinia } from 'pinia';
import PaginationNav from "../../../components/PaginationNav.vue";
import router from "../../../router";
import { paginationCatalogStore } from '../../../stores/pagination';

describe("PaginationNav", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });
    
    it("Пагинация отсутствует: pagesNumber = 0", () => {
        const paginationCatalog = paginationCatalogStore();
        
        const wrapper = mount(PaginationNav, {
            props: {
                pagination: paginationCatalog,
                routeName: 'catalog'
            },
            global: {
                plugins: [router]
            }
        });
        
        expect(paginationCatalog.pagesNumber).toBe(0);
        expect(wrapper.html()).toBe('<!--v-if-->');
    });
    
    it("Пагинация отсутствует: pagesNumber = 1", () => {
        const paginationCatalog = paginationCatalogStore();
        paginationCatalog.pagesNumber = 1;
        
        const wrapper = mount(PaginationNav, {
            props: {
                pagination: paginationCatalog,
                routeName: 'catalog'
            },
            global: {
                plugins: [router]
            }
        });
        
        expect(paginationCatalog.pagesNumber).toBe(1);
        expect(wrapper.html()).toBe('<!--v-if-->');
    });
    
    it("Монтирование компоненты: все кнопки", () => {
        const paginationCatalog = paginationCatalogStore();
        paginationCatalog.pagesNumber = 25;
        paginationCatalog.firstButton = 3;
        paginationCatalog.lastButton = 7;
        paginationCatalog.activePage = 5;
        
        const wrapper = mount(PaginationNav, {
            props: {
                pagination: paginationCatalog,
                routeName: 'catalog'
            },
            global: {
                plugins: [router]
            }
        });
        
        const a = wrapper.findAll('a');
        expect(a.length).toBe(7);
        // Ссылка на первую страницу
        expect(a[0].text()).toBe('«');
        expect(a[0].attributes('href')).toBe('/catalog/1');
        expect(a[0].classes('disabled')).toBe(false);
        // Набор кнопок
        expect(a[1].text()).toBe('3');
        expect(a[1].attributes('href')).toBe('/catalog/3');
        expect(a[1].classes('active')).toBe(false);
        
        expect(a[2].text()).toBe('4');
        expect(a[2].attributes('href')).toBe('/catalog/4');
        expect(a[2].classes('active')).toBe(false);
        // Активная кнопка
        expect(a[3].text()).toBe('5');
        expect(a[3].attributes('href')).toBe('/catalog/5');
        expect(a[3].classes('active')).toBe(true);
        
        expect(a[4].text()).toBe('6');
        expect(a[4].attributes('href')).toBe('/catalog/6');
        expect(a[4].classes('active')).toBe(false);
        
        expect(a[5].text()).toBe('7');
        expect(a[5].attributes('href')).toBe('/catalog/7');
        expect(a[5].classes('active')).toBe(false);
        // Ссылка на последнюю страницу
        expect(a[6].text()).toBe('»');
        expect(a[6].attributes('href')).toBe('/catalog/25');
        expect(a[6].classes('disabled')).toBe(false);
    });
    
    it("Монтирование компоненты: две цифровых кнопки", () => {
        const paginationCatalog = paginationCatalogStore();
        paginationCatalog.pagesNumber = 2;
        paginationCatalog.firstButton = 1;
        paginationCatalog.lastButton = 2;
        paginationCatalog.activePage = 2;
        
        const wrapper = mount(PaginationNav, {
            props: {
                pagination: paginationCatalog,
                routeName: 'catalog'
            },
            global: {
                plugins: [router]
            }
        });
        
        const a = wrapper.findAll('a');
        expect(a.length).toBe(4);
        // Ссылка на первую страницу
        expect(a[0].text()).toBe('«');
        expect(a[0].attributes('href')).toBe('/catalog/1');
        expect(a[0].classes('disabled')).toBe(false);
        // Не активная кнопка
        expect(a[1].text()).toBe('1');
        expect(a[1].attributes('href')).toBe('/catalog/1');
        expect(a[1].classes('active')).toBe(false);
        // Активная кнопка
        expect(a[2].text()).toBe('2');
        expect(a[2].attributes('href')).toBe('/catalog/2');
        expect(a[2].classes('active')).toBe(true);
        // Ссылка на последнюю страницу
        expect(a[3].text()).toBe('»');
        expect(a[3].attributes('href')).toBe('/catalog/2');
        expect(a[3].classes('disabled')).toBe(true);
    });
});
