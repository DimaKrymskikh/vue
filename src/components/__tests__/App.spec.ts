import { beforeEach, describe, it, expect, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";

import router from "../../router";
import App from "../../App.vue";


describe("App", () => {
    
    const wrapperOptions = {
        global: {
            provide: {
                app: {
                    isRequest: false,
                    basicUrl: 'test',
                    isGuest: true
                },
                paginationCatalog: {
                    activePage: 2
                },
                paginationAccount: {
                    activePage: 1
                },
            },
            plugins: [router]
        }
    };
    
    it("Проверка меню для неаутентифицированного пользователя", async () => {
        const wrapper = mount(App, wrapperOptions);
        const mainNav = wrapper.find('#main-nav');
        
        /**
        * Проверка наличия вкладок меню: название вкладки и ссылка
        */
        // Вкладка главной страницы (svg, нет текста)
        expect(mainNav.find('#house-svg').isVisible()).toBe(true);
        expect(mainNav.find('a[href="/"').isVisible()).toBe(true);
        expect(mainNav.text()).toContain('Каталог');
        // paginationCatalog.activePage = 2
        expect(mainNav.find('a[href="/catalog/2').exists()).toBe(true);
        expect(mainNav.text()).not.toContain('ЛК');
        // paginationAccount.activePage = 1
        expect(mainNav.find('a[href="/account/1').exists()).toBe(false);
        expect(mainNav.text()).toContain('Вход');
        expect(mainNav.find('a[href="/login').exists()).toBe(true);
        expect(mainNav.text()).not.toContain('Выход');
        expect(mainNav.find('a[href="/logout').exists()).toBe(false);
    });
    
    it("Проверка меню для аутентифицированного пользователя", () => {
        // Делаем пользователя аутентифицированным
        wrapperOptions.global.provide.app.isGuest = false;
        const wrapper = mount(App, wrapperOptions);
        const mainNav = wrapper.find('#main-nav');
        
        expect(mainNav.find('#house-svg').isVisible()).toBe(true);
        expect(mainNav.find('a[href="/"').isVisible()).toBe(true);
        expect(mainNav.text()).toContain('Каталог');
        expect(mainNav.find('a[href="/catalog/2').exists()).toBe(true);
        expect(mainNav.text()).toContain('ЛК');
        expect(mainNav.find('a[href="/account/1').exists()).toBe(true);
        expect(mainNav.text()).not.toContain('Вход');
        expect(mainNav.find('a[href="/login').exists()).toBe(false);
        expect(mainNav.text()).toContain('Выход');
        expect(mainNav.find('a[href="/logout').exists()).toBe(true);
    });
});
