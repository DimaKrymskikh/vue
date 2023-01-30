import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";

import { setActivePinia, createPinia } from 'pinia';
import router from "@/router";
import App from "@/App.vue";
import ForbiddenModal from '@/components/ForbiddenModal.vue';
import AlertAuthentication from '@/components/AlertAuthentication.vue';
import { useAppStore } from '@/stores/app';
import { paginationCatalogStore, paginationAccountStore } from '@/stores/pagination';

describe("App", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });
    
    it("Проверка меню для неаутентифицированного пользователя", () => {
        const app = useAppStore();
        const paginationCatalog = paginationCatalogStore();
        const paginationAccount = paginationAccountStore();
        
        paginationCatalog.activePage = 2;
        paginationAccount.activePage = 1;
        
        const wrapper = mount(App, {
            global: {
                provide: { app, paginationCatalog, paginationAccount },
                plugins: [router]
            }
        });
        const mainNav = wrapper.find('#main-nav');
        
        /**
        * Проверка наличия вкладок меню: название вкладки и ссылка
        */
        // Вкладка главной страницы (svg, нет текста)
        expect(mainNav.find('#house-svg').isVisible()).toBe(true);
        expect(mainNav.find('a[href="/"').isVisible()).toBe(true);
        expect(mainNav.text()).toContain('каталог');
        // paginationCatalog.activePage = 2
        expect(mainNav.find('a[href="/catalog/2').exists()).toBe(true);
        expect(mainNav.text()).not.toContain('лк');
        // paginationAccount.activePage = 1
        expect(mainNav.find('a[href="/account/1').exists()).toBe(false);
        expect(mainNav.text()).toContain('вход');
        expect(mainNav.find('a[href="/login').exists()).toBe(true);
        expect(mainNav.text()).not.toContain('выход');
        expect(mainNav.find('a[href="/logout').exists()).toBe(false);
        
        // Баннер с призывом залогиниться присутствует
        expect(wrapper.findComponent(AlertAuthentication).exists()).toBe(true);
        // Модальное окно ошибок отсутствует
        expect(wrapper.findComponent(ForbiddenModal).exists()).toBe(false);
    });
    
    it("Проверка меню для аутентифицированного пользователя", () => {
        const app = useAppStore();
        const paginationCatalog = paginationCatalogStore();
        const paginationAccount = paginationAccountStore();
        
        // Делаем пользователя аутентифицированным
        app.isGuest = false;
        paginationCatalog.activePage = 4;
        paginationAccount.activePage = 7;
        
        const wrapper = mount(App, {
            global: {
                provide: { app, paginationCatalog, paginationAccount },
                plugins: [router]
            }
        });
        const mainNav = wrapper.find('#main-nav');
        
        expect(mainNav.find('#house-svg').isVisible()).toBe(true);
        expect(mainNav.find('a[href="/"').isVisible()).toBe(true);
        expect(mainNav.text()).toContain('каталог');
        expect(mainNav.find('a[href="/catalog/4').exists()).toBe(true);
        expect(mainNav.text()).toContain('лк');
        expect(mainNav.find('a[href="/account/7').exists()).toBe(true);
        expect(mainNav.text()).not.toContain('вход');
        expect(mainNav.find('a[href="/login').exists()).toBe(false);
        expect(mainNav.text()).toContain('выход');
        expect(mainNav.find('a[href="/logout').exists()).toBe(true);
        
        // Баннер с призывом залогиниться отсутствует
        expect(wrapper.findComponent(AlertAuthentication).exists()).toBe(false);
        // Модальное окно ошибок отсутствует
        expect(wrapper.findComponent(ForbiddenModal).exists()).toBe(false);
    });
    
    it("Проверка наличия модального окна ошибок", () => {
        const app = useAppStore();
        const paginationCatalog = paginationCatalogStore();
        const paginationAccount = paginationAccountStore();
        
        // Перехвачена ошибка
        app.isForbidden = true;
        
        const wrapper = mount(App, {
            global: {
                provide: { app, paginationCatalog, paginationAccount },
                plugins: [router]
            }
        });
        // Модальное окно ошибок присутствует
        expect(wrapper.findComponent(ForbiddenModal).exists()).toBe(true);
    });
});
