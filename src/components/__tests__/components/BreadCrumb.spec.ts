import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";

import BreadCrumb from "../../../components/BreadCrumb.vue";
import router from "../../../router";

describe("BreadCrumb", () => {
    it("Монтирование компоненты", () => {
        const wrapper = mount(BreadCrumb, {
            props: {
                linksList: [{
                    link: '/',
                    text: 'Главная страница'
                }, {
                    link: {name: 'account', params: { pageId: 7 }},
                    text: 'Личный кабинет'
                }, {
                    text: 'Карточка фильма'
                }]
            },
            global: {
                plugins: [router]
            }
        });
       
        const li = wrapper.findAll('li');
        // Присутствует ссылка на 'Главную страницу'
        expect(li[0].exists()).toBe(true);
        expect(li[0].find('a[href="/"').exists()).toBe(true);
        expect(li[0].text()).toBe('Главная страница');
        // Присутствует ссылка в ЛК
        expect(li[1].exists()).toBe(true);
        expect(li[1].find('a[href="/account/7"').exists()).toBe(true);
        expect(li[1].text()).toBe('Личный кабинет');
        // 'Карточка фильма' - данная страница
        expect(li[2].exists()).toBe(true);
        expect(li[2].find('a').exists()).toBe(false);
        expect(li[2].text()).toBe('Карточка фильма');
        // Других элементов в хлебных крошках нет
        expect(li.length).toBe(3);
    });
});
