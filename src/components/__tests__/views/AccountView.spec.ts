import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import type { Mock } from "vitest";

import { setActivePinia, createPinia } from 'pinia';
import AccountView from '@/views/AccountView.vue';
import BreadCrumb from '@/components/BreadCrumb.vue';
import FilmsTable from '@/components/account/FilmsTable.vue';
import AccountRemoveModal from '@/components/account/AccountRemoveModal.vue';
import PaginationNav from '@/components/PaginationNav.vue';
import Dropdown from '@/components/Dropdown.vue';
import Spinner from '@/components/Spinner.vue';
import router from "@/router";
import { useAppStore } from '@/stores/app';
import { useUserStore } from '@/stores/user';
import { filmsAccountStore } from '@/stores/films';
import { paginationAccountStore } from '@/stores/pagination';
import { accountPage } from '../data/films';

import axios, { AxiosError } from 'axios';
vi.mock('axios');

describe("AccountView", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });
    afterEach(async () => {
        await (axios as any as Mock).mockClear();
    });
    
    it("Монтирование компоненты", async () => {
        // Запрос при монтировании компоненты
        await (axios as any as Mock).mockResolvedValue(accountPage);
        
        // Пока компонента не создана, запрос не отправляется
        expect(axios).toHaveBeenCalledTimes(0);
        // Определяем provide
        const app = useAppStore();
        const user = useUserStore();
        user.login = 'TestLogin';
        const filmsAccount = filmsAccountStore();
        const paginationAccount = paginationAccountStore();
        
        // Создаём компоненту
        const wrapper = mount(AccountView, {
            global: {
                provide: { app, user, filmsAccount, paginationAccount },
                plugins: [router]
            }
        });
        
        // Заголовок и хлебные крошки всегда присутствую на странице
        const h1 = wrapper.get('h1');
        const breadCrumb = wrapper.getComponent(BreadCrumb);
        // Проверяем их наличие до загрузки фильмов
        expect(wrapper.get('h1').text()).toBe('TestLogin. Личный кабинет');
        expect(breadCrumb.isVisible()).toBe(true);
        // Имеется ссылка на главную страницу
        const breadCrumbLi = breadCrumb.findAll('li');
        expect(breadCrumbLi[0].text()).toBe("Главная страница");
        expect(breadCrumbLi[0].get('a[href="/"]').isVisible()).toBe(true);
        // Хлебные крошки указывают, что открыта страница "Аккаунт"
        expect(breadCrumbLi[1].text()).toBe("Аккаунт");
        expect(breadCrumbLi[1].find('a').exists()).toBe(false);
        
        // Кнопка "Удалить аккаунт" отсутствует
        expect(wrapper.find('button.bg-red-100').exists()).toBe(false);
        // Модальное окно для удаления аккаунта отсутствует
        expect(wrapper.findComponent(AccountRemoveModal).exists()).toBe(false);
        
        // Крутится спиннер
        expect(wrapper.findComponent(Spinner).exists()).toBe(true);
        // Выбор числа фильмов отсутствует
        expect(wrapper.findComponent(Dropdown).exists()).toBe(false);
        // Таблица фильмов отсутствует
        expect(wrapper.findComponent(FilmsTable).exists()).toBe(false);
        // Пагинация отсутствует
        expect(wrapper.findComponent(PaginationNav).exists()).toBe(false);
        
        // Данные загрузились
        await flushPromises();
        // Запрос был отправлен 1 раз
        expect(axios).toHaveBeenCalledTimes(1);
        // Спиннер исчез
        expect(wrapper.findComponent(Spinner).exists()).toBe(false);
        
        // Появился выбор числа фильмов
        const dropdown = wrapper.findComponent(Dropdown)
        expect(dropdown.exists()).toBe(true);
        expect(dropdown.text()).toBe('Число фильмов на странице');
        
        // Появилась таблица фильмов
        const filmsTable = wrapper.findComponent(FilmsTable);
        expect(filmsTable.exists()).toBe(true);
        // Проверяем заголовок к таблице фильмов
        const caption = filmsTable.get('caption');
        expect(caption.isVisible()).toBe(true);
        expect(caption.text()).toBe('Показано 6 фильмов из 46');
        
        // Появилась пагинация
        const pagination = wrapper.getComponent(PaginationNav)
        expect(pagination.isVisible()).toBe(true);
        const aPagination = pagination.findAll('a');
        // Проверяем кнопки пагинации
        // Ссылка на первую страницу доступна
        expect(aPagination[0].text()).toBe('«');
        expect(aPagination[0].classes('disabled')).toBe(false);
        // 1 страница
        expect(aPagination[1].text()).toBe('1');
        expect(aPagination[1].classes('active')).toBe(false);
        // 2 страница 
        expect(aPagination[2].text()).toBe('2');
        expect(aPagination[2].classes('active')).toBe(false);
        // 3 страница - активная страница
        expect(aPagination[3].text()).toBe('3');
        expect(aPagination[3].classes('active')).toBe(true);
        // Ссылка на последнюю страницу заблокирована 
        expect(aPagination[4].text()).toBe('»');
        expect(aPagination[4].classes('disabled')).toBe(true);
        // Других кнопок нет
        expect(aPagination.length).toBe(5);

        // Заголовок и хлебные крошки присутствуют
        expect(h1.text()).toBe("TestLogin. Личный кабинет");
        expect(breadCrumb.isVisible()).toBe(true);
        
        // Появилась кнопка "Удалить аккаунт"
        expect(wrapper.find('button.bg-red-100').exists()).toBe(true);
        expect(wrapper.find('button.bg-red-100').text()).toBe('Удалить аккаунт');
        // Модальное окно для удаления аккаунта по-прежнему отсутствует
        expect(wrapper.findComponent(AccountRemoveModal).exists()).toBe(false);
        
        // Кликаем по кнопке "Удалить аккаунт"
        await wrapper.find('button.bg-red-100').trigger('click');
        // Появляется модальное окно для удаления аккаунта
        expect(wrapper.findComponent(AccountRemoveModal).exists()).toBe(true);
        
        // Кликаем 2-й раз по кнопке "Удалить аккаунт"
        await wrapper.find('button.bg-red-100').trigger('click');
        // Исчезает модальное окно для удаления аккаунта
        expect(wrapper.findComponent(AccountRemoveModal).exists()).toBe(false);
    });
});
