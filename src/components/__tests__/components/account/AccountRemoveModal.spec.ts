import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import type { Mock } from "vitest";
import type { VueWrapper } from "@vue/test-utils";

import { setActivePinia, createPinia } from 'pinia';
import AccountRemoveModal from '@/components/account/AccountRemoveModal.vue';
import Spinner from '@/components/Spinner.vue';
import ErrorsList from '@/components/ErrorsList.vue';
import router from "@/router";
import { useAppStore } from '@/stores/app';
import { useUserStore } from '@/stores/user';
import { removeAccount, wrongPasswordError } from '../../data/resolve';
import { errorTokenTimeout } from '../../data/reject';
import type { App } from '@/stores/app';
import type { User } from '@/stores/user';

import axios from 'axios';
vi.mock('axios');

/**
* Задаём аутентифицированного пользователя
*/
const setLoginUser = function(app: App, user: User) {
    app.token = 'LoginToken';
    app.isGuest = false;
    expect(app.token).toBe('LoginToken');
    expect(app.isGuest).toBe(false);
    user.login = 'TestLogin';
    expect(user.login).toBe('TestLogin');
}

/**
* Модальное окно открыто. Введён пароль. Нажата кнопка "Да"
*/
const openModal = async function(wrapper: VueWrapper) {
    // Сообщения об ошибке отсутствуют
    expect(wrapper.findComponent(ErrorsList).attributes('hidden')).toBe('');
    // Отсутствует спиннер 
    expect(wrapper.findComponent(Spinner).exists()).toBe(false);
    // Заполняем поле пароля
    const inputPassword = wrapper.get('input[type="password"]');
    expect(inputPassword.isVisible()).toBe(true);
    await inputPassword.setValue('TestPassword')
    expect((inputPassword.element as HTMLInputElement).value).toBe('TestPassword');
    // Находим кнопку "Да"
    const buttons = wrapper.findAll('button');
    expect(buttons.length).toBe(3);
    expect(buttons[2].text()).toBe('Да');
    // Кликаем по кнопке "Да"
    await buttons[2].trigger('click');
    // Появляется спиннер 
    expect(wrapper.findComponent(Spinner).exists()).toBe(true);
}

const getWrapper = function(app: App, user: User) {
    return mount(AccountRemoveModal, {
            props: {
                toggleShowAccountRemoveModal: vi.fn()
            },
            global: {
                provide: { app, user },
                plugins: [router]
            }
        });
}

describe("account/AccountRemoveModal", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });
    afterEach(async () => {
        await (axios as any as Mock).mockClear();
    });
    
    it("Монтирование компоненты", () => {
        // Определяем provide
        const app = useAppStore();
        const user = useUserStore();
        
        // Создаём компоненту
        const wrapper = getWrapper(app, user);
        
        // Присутствую ключевые надписи
        expect(wrapper.text()).toContain('Подтверждение удаления аккаунта');
        expect(wrapper.text()).toContain('Вы действительно хотите удалить свой аккаунт?');
        // Поле для пароля пустое
        const inputPassword = wrapper.get('input[type="password"]');
        expect(inputPassword.isVisible()).toBe(true);
        expect((inputPassword.element as HTMLInputElement).value).toBe('');
    });
    
    it("Удаление аккаунта: пароль введён верно", async () => {
        // Определяем provide
        const app = useAppStore();
        const user = useUserStore();
        setLoginUser(app, user);
        
        // Задаём mock-функции
        const appRequst = vi.spyOn(app, 'request');
        await (axios as any as Mock).mockResolvedValueOnce(removeAccount);
        
        // Создаём компоненту
        const wrapper = getWrapper(app, user);
        
        await openModal(wrapper);
        
        // app.request вызывается с правильными параметрами
        expect(appRequst).toHaveBeenCalledTimes(1);
        expect(appRequst).toHaveBeenLastCalledWith('account', 'DELETE', {password: 'TestPassword'}, {app, user}, false);
        // Получаем ответ сервера
        await flushPromises();
        expect(axios).toHaveBeenCalledTimes(1);
        // Состояние проекта отвечает неаутентифицированному пользователю
        expect(app.token).toBe('LogoutToken');
        expect(app.isGuest).toBe(true);
        expect(user.login).toBe('')
    });
    
    it("Удаление аккаунта: неверный пароль", async () => {
        // Определяем provide
        const app = useAppStore();
        const user = useUserStore();
        setLoginUser(app, user);
        
        // Задаём mock-функции
        const appRequst = vi.spyOn(app, 'request');
        await (axios as any as Mock).mockResolvedValueOnce(wrongPasswordError);
        
        // Создаём компоненту
        const wrapper = getWrapper(app, user);
        
        await openModal(wrapper);
        
        // app.request вызывается с правильными параметрами
        expect(appRequst).toHaveBeenCalledTimes(1);
        expect(appRequst).toHaveBeenLastCalledWith('account', 'DELETE', {password: 'TestPassword'}, {app, user}, false);
        // Получаем ответ сервера
        await flushPromises();
        expect(axios).toHaveBeenCalledTimes(1);
        // Появляется сообщение об ошибке
        expect(wrapper.findComponent(ErrorsList).attributes('hidden')).toBe(undefined);
        expect(wrapper.findComponent(ErrorsList).text()).toBe('Попробуйте ввести пароль ещё раз');
    });
    
    it("Удаление аккаунта: reject", async () => {
        // Определяем provide
        const app = useAppStore();
        const user = useUserStore();
        setLoginUser(app, user);
        
        // Задаём mock-функции
        const appRequst = vi.spyOn(app, 'request');
        await (axios as any as Mock).mockRejectedValueOnce(errorTokenTimeout());
        
        // Создаём компоненту
        const wrapper = getWrapper(app, user);

        await openModal(wrapper);
        
        // app.request вызывается с правильными параметрами
        expect(appRequst).toHaveBeenCalledTimes(1);
        expect(appRequst).toHaveBeenLastCalledWith('account', 'DELETE', {password: 'TestPassword'}, {app, user}, false);
        // Получаем ответ сервера
        await flushPromises();
        expect(axios).toHaveBeenCalledTimes(1);
        // Ошибка зафиксирована в app
        expect(app.isForbidden).toBe(true);
        expect(app.errorMessage).toBe('Статус[401]: Время токена истекло');
    });
});
