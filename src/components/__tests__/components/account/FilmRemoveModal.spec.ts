import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import type { Mock } from "vitest";
import type { VueWrapper } from "@vue/test-utils";

import { setActivePinia, createPinia } from 'pinia';
import FilmRemoveModal from '@/components/account/FilmRemoveModal.vue';
import Spinner from '@/components/Spinner.vue';
import ErrorsList from '@/components/ErrorsList.vue';
import router from "@/router";
import { useAppStore } from '@/stores/app';
import { paginationAccountStore } from '@/stores/pagination';
import { removeFilm, notErrors, wrongPasswordError } from '../../data/resolve';
import { errorTokenTimeout } from '../../data/reject';

import axios, { AxiosError } from 'axios';
vi.mock('axios');

/**
* Модальное окно открыто. Введён пароль. Нажата кнопка "Да"
*/
const openModal = async function(wrapper: VueWrapper) {
    // Модальное окно для удаления фильма открыто
    await flushPromises();
    expect(axios).toHaveBeenCalledTimes(1);
    // Присутствует название фильма
    expect(wrapper.text()).toContain('Вы действительно хотите удалить фильм Wonderland Christmas');
    // Присутствует пустое поле для пароля
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
    expect((wrapper.find('input[type="password"]').element  as HTMLInputElement).value).toBe('');
    // Отсутствует спиннер 
    expect(wrapper.findComponent(Spinner).exists()).toBe(false);
    // Сообщения об ошибке отсутствуют
    expect(wrapper.findComponent(ErrorsList).attributes('hidden')).toBe('');
    // Вводим пароль
    await wrapper.find('input[type="password"]').setValue('TestPassword');
    expect((wrapper.find('input[type="password"]').element  as HTMLInputElement).value).toBe('TestPassword');
    // Находим кнопку "Да"
    const buttons = wrapper.findAll('button');
    expect(buttons.length).toBe(3);
    expect(buttons[2].text()).toBe('Да');

    // Кликаем по кнопке "Да"
    await buttons[2].trigger('click');
}

describe("catalog/FilmsTable", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });
    afterEach(async () => {
        await (axios as any as Mock).mockClear();
    });
    
    it("Монтирование компоненты: resolve", async () => {
        // Определяем provide
        const app = useAppStore();
        const paginationAccount = paginationAccountStore();
        
        // Задаём mock-функции
        const appRequst = vi.spyOn(app, 'request');
        await (axios as any as Mock).mockResolvedValueOnce(removeFilm);
        
        // Создаём компоненту
        const wrapper = mount(FilmRemoveModal, {
            props: {
                removeFilmId: 985,
                requestAccount: vi.fn(),
                toggleShowFilmRemoveModal: vi.fn()
            },
            global: {
                provide: { app, paginationAccount },
                plugins: [router]
            }
        });
        
        // В начальный момент отсутствует название фильма
        expect(wrapper.text()).toContain('Вы действительно хотите удалить фильм');
        expect(wrapper.text()).not.toContain('Wonderland Christmas');
        // Крутиться спиннер
        expect(wrapper.findComponent(Spinner).exists()).toBe(true);
        // Поле для пароля отсутствует
        expect(wrapper.find('input[type="password"]').exists()).toBe(false);
        // app.request вызывается один раз с правильными параметрами
        expect(appRequst).toHaveBeenCalledTimes(1);
        expect(appRequst).toHaveBeenLastCalledWith('account/getFilm/985', 'POST', {}, {}, false);
        // Завершаем промисы
        await flushPromises();
        expect(axios).toHaveBeenCalledTimes(1);
        // Появляется название фильма
        expect(wrapper.text()).toContain('Вы действительно хотите удалить фильм Wonderland Christmas');
        // Спиннер пропадает
        expect(wrapper.findComponent(Spinner).exists()).toBe(false);
        // Появляется поле для пароля
        expect(wrapper.find('input[type="password"]').exists()).toBe(true);
    });
    
    it("Монтирование компоненты: reject", async () => {
        // Определяем provide
        const app = useAppStore();
        const paginationAccount = paginationAccountStore();
        
        // Задаём mock-функции
        const appRequst = vi.spyOn(app, 'request');
        await (axios as any as Mock).mockRejectedValueOnce(errorTokenTimeout());
        
        // Создаём компоненту
        const wrapper = mount(FilmRemoveModal, {
            props: {
                removeFilmId: 985,
                requestAccount: vi.fn(),
                toggleShowFilmRemoveModal: vi.fn()
            },
            global: {
                provide: { app, paginationAccount },
                plugins: [router]
            }
        });
        
        // В начальный момент отсутствует название фильма
        expect(wrapper.text()).toContain('Вы действительно хотите удалить фильм');
        expect(wrapper.text()).not.toContain('Wonderland Christmas');
        // Крутиться спиннер
        expect(wrapper.findComponent(Spinner).exists()).toBe(true);
        // Поле для пароля отсутствует
        expect(wrapper.find('input[type="password"]').exists()).toBe(false);
        // app.request вызывается один раз с правильными параметрами
        expect(appRequst).toHaveBeenCalledTimes(1);
        expect(appRequst).toHaveBeenLastCalledWith('account/getFilm/985', 'POST', {}, {}, false);
        
        // Завершаем промисы
        await flushPromises();
        expect(axios).toHaveBeenCalledTimes(1);
        // Ошибка зафиксирована в app
        expect(app.isForbidden).toBe(true);
        expect(app.errorMessage).toBe('Статус[401]: Время токена истекло');
    });
    
    it("Удаление фильма: пароль введён правильно и paginationAccount.getPageAfterRemoveFilm() === paginationAccount.activePage", async () => {
        // Определяем provide
        const app = useAppStore();
        const paginationAccount = paginationAccountStore();
        paginationAccount.activePage = 2;
        // Соответствие случаю paginationAccount.getPageAfterRemoveFilm() === paginationAccount.activePage
        paginationAccount.elementsNumberOnActivePage = 2
        
        // Задаём mock-функции
        const appRequst = vi.spyOn(app, 'request');
        await (axios as any as Mock)
            .mockResolvedValueOnce(removeFilm)
            .mockResolvedValueOnce(notErrors);
        const requestAccount = vi.fn();
        const routerPush = vi.spyOn(router, 'push');
        
        // Создаём компоненту
        const wrapper = mount(FilmRemoveModal, {
            props: {
                removeFilmId: 985,
                requestAccount,
                toggleShowFilmRemoveModal: vi.fn()
            },
            global: {
                provide: { app, paginationAccount },
                plugins: [router]
            }
        });
        
        // Модальное окно для удаления фильма открыто
        await openModal(wrapper);
        
        // app.request вызывается второй раз с правильными параметрами (первый раз вызывается при открытии модального окна)
        expect(appRequst).toHaveBeenCalledTimes(2);
        expect(appRequst).toHaveBeenLastCalledWith('userFilm/985', 'DELETE', {password: 'TestPassword'}, {}, false);
        // Функции requestAccount и router.push ещё не вызывались
        expect(requestAccount).toHaveBeenCalledTimes(0);
        expect(routerPush).toHaveBeenCalledTimes(0);
        // Получаем ответ сервера
        await flushPromises();
        expect(axios).toHaveBeenCalledTimes(2);
        // Вызывается функция requestAccount (реализован случай paginationAccount.getPageAfterRemoveFilm() === paginationAccount.activePage)
        expect(requestAccount).toHaveBeenCalledTimes(1);
        // Метод router.push не вызывается
        expect(routerPush).toHaveBeenCalledTimes(0);
    });
    
    it("Удаление фильма: пароль введён правильно и paginationAccount.getPageAfterRemoveFilm() !== paginationAccount.activePage", async () => {
        // Определяем provide
        const app = useAppStore();
        const paginationAccount = paginationAccountStore();
        // Будет удалён последний фильм на 2-й странице (2-я страница - последняя страница)
        paginationAccount.activePage = 2;
        paginationAccount.elementsNumberOnActivePage = 1
        
        // Задаём mock-функции
        const appRequst = vi.spyOn(app, 'request');
        await (axios as any as Mock)
            .mockResolvedValueOnce(removeFilm)
            .mockResolvedValueOnce(notErrors);
        const requestAccount = vi.fn();
        const routerPush = vi.spyOn(router, 'push');
        
        // Создаём компоненту
        const wrapper = mount(FilmRemoveModal, {
            props: {
                removeFilmId: 985,
                requestAccount,
                toggleShowFilmRemoveModal: vi.fn()
            },
            global: {
                provide: { app, paginationAccount },
                plugins: [router]
            }
        });
        
        // Модальное окно для удаления фильма открыто
        await openModal(wrapper);
        
        // app.request вызывается второй раз с правильными параметрами (первый раз вызывается при открытии модального окна)
        expect(appRequst).toHaveBeenCalledTimes(2);
        expect(appRequst).toHaveBeenLastCalledWith('userFilm/985', 'DELETE', {password: 'TestPassword'}, {}, false);
        // Функции requestAccount и router.push ещё не вызывались
        expect(requestAccount).toHaveBeenCalledTimes(0);
        expect(routerPush).toHaveBeenCalledTimes(0);
        // Получаем ответ сервера
        await flushPromises();
        expect(axios).toHaveBeenCalledTimes(2);
        // Функция requestAccount не вызывается (реализован случай paginationAccount.getPageAfterRemoveFilm() !== paginationAccount.activePage)
        expect(requestAccount).toHaveBeenCalledTimes(0);
        // Переход со 2-й на 1-вую страницу методом router.push
        expect(routerPush).toHaveBeenCalledTimes(1);
        expect(routerPush).toHaveBeenLastCalledWith({name: 'account', params: {pageId: 1}});
    });
    
    it("Удаление фильма: неверный пароль", async () => {
        // Определяем provide
        const app = useAppStore();
        const paginationAccount = paginationAccountStore();
        
        // Задаём mock-функции
        const appRequst = vi.spyOn(app, 'request');
        await (axios as any as Mock)
            .mockResolvedValueOnce(removeFilm)
            .mockResolvedValueOnce(wrongPasswordError);
        
        // Создаём компоненту
        const wrapper = mount(FilmRemoveModal, {
            props: {
                removeFilmId: 985,
                requestAccount: vi.fn(),
                toggleShowFilmRemoveModal: vi.fn()
            },
            global: {
                provide: { app, paginationAccount },
                plugins: [router]
            }
        });

        // Модальное окно для удаления фильма открыто
        await openModal(wrapper);
        
        // app.request вызывается второй раз с правильными параметрами (первый раз вызывается при открытии модального окна)
        expect(appRequst).toHaveBeenCalledTimes(2);
        expect(appRequst).toHaveBeenLastCalledWith('userFilm/985', 'DELETE', {password: 'TestPassword'}, {}, false);
        // Получаем ответ сервера
        await flushPromises();
        expect(axios).toHaveBeenCalledTimes(2);
        // Появляется сообщение об ошибке
        expect(wrapper.findComponent(ErrorsList).attributes('hidden')).toBe(undefined);
        expect(wrapper.findComponent(ErrorsList).text()).toBe('Попробуйте ввести пароль ещё раз');
    });
    
    it("Удаление фильма: reject", async () => {
        // Определяем provide
        const app = useAppStore();
        const paginationAccount = paginationAccountStore();
        
        // Задаём mock-функции
        const appRequst = vi.spyOn(app, 'request');
        await (axios as any as Mock)
            .mockResolvedValueOnce(removeFilm)
            .mockRejectedValueOnce(errorTokenTimeout());
        
        // Создаём компоненту
        const wrapper = mount(FilmRemoveModal, {
            props: {
                removeFilmId: 985,
                requestAccount: vi.fn(),
                toggleShowFilmRemoveModal: vi.fn()
            },
            global: {
                provide: { app, paginationAccount },
                plugins: [router]
            }
        });

        // Модальное окно для удаления фильма открыто
        await openModal(wrapper);
        
        // app.request вызывается второй раз с правильными параметрами (первый раз вызывается при открытии модального окна)
        expect(appRequst).toHaveBeenCalledTimes(2);
        expect(appRequst).toHaveBeenLastCalledWith('userFilm/985', 'DELETE', {password: 'TestPassword'}, {}, false);
        // Получаем ответ сервера
        await flushPromises();
        expect(axios).toHaveBeenCalledTimes(2);
        // Ошибка зафиксирована в app
        expect(app.isForbidden).toBe(true);
        expect(app.errorMessage).toBe('Статус[401]: Время токена истекло');
    });
});
