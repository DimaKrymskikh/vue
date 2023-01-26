import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import type { Mock } from "vitest";

import { setActivePinia, createPinia } from 'pinia';
import LogoutView from "@/views/LogoutView.vue";
import Spinner from '@/components/Spinner.vue';
import router from "@/router";
import { useAppStore } from '@/stores/app';
import { useUserStore } from '@/stores/user';
import { logoutData } from '../data/resolve';
import { errorTokenTimeout } from '../data/reject';

import axios from 'axios';
vi.mock('axios');

describe("LogoutView", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });
    afterEach(async () => {
        await (axios as any as Mock).mockClear();
    });
    
    it("resolve", async () => {
        // Определяем provide
        // Пользователь залогинен
        const app = useAppStore();
        app.token = 'LoginToken';
        app.isGuest = false;
        const user = useUserStore();
        user.login = 'TestLogin';
        
        // Задаём mock-функции
        const appRequst = vi.spyOn(app, 'request');
        const routerPush = vi.spyOn(router, 'push');
        await (axios as any as Mock).mockResolvedValueOnce(logoutData);

        // Создаём компоненту
        const wrapper = mount(LogoutView, {
            global: {
                provide: { app, user },
                plugins: [router],
            }
        });
        
        // Крутится спиннер
        expect(wrapper.findComponent(Spinner).exists()).toBe(true);
        // app.request вызывается с правильными параметрами
        expect(appRequst).toHaveBeenCalledTimes(1);
        expect(appRequst).toHaveBeenLastCalledWith('logout', 'POST', {}, {app, user});
        
        // Получаем ответ сервера
        await flushPromises();
        expect(axios).toHaveBeenCalledTimes(1);
        // Спиннер отсутствует
        expect(wrapper.findComponent(Spinner).exists()).toBe(false);
        // Пользователь разлогинен
        app.token = 'LogoutToken';
        app.isGuest = true;
        user.login = '';
        // Выполнен переход на главную страницу
        expect(routerPush).toHaveBeenLastCalledWith({ name: 'home' });
    });
    
    it("reject", async () => {
        // Определяем provide
        // В app нет ошибки
        const app = useAppStore();
        expect(app.isForbidden).toBe(false);
        expect(app.errorMessage).toBe('');
        const user = useUserStore();
        
        // Задаём mock-функции
        const appRequst = vi.spyOn(app, 'request');
        await (axios as any as Mock).mockRejectedValueOnce(errorTokenTimeout());

        // Создаём компоненту
        const wrapper = mount(LogoutView, {
            global: {
                provide: { app, user },
                plugins: [router],
            }
        });
        
        // Крутится спиннер
        expect(wrapper.findComponent(Spinner).exists()).toBe(true);
        // app.request вызывается с правильными параметрами
        expect(appRequst).toHaveBeenCalledTimes(1);
        expect(appRequst).toHaveBeenLastCalledWith('logout', 'POST', {}, {app, user});
        
        // Получаем ответ сервера
        await flushPromises();
        expect(axios).toHaveBeenCalledTimes(1);
        // Спиннер отсутствует
        expect(wrapper.findComponent(Spinner).exists()).toBe(false);
        // Ошибка зафиксирована в app
        expect(app.isForbidden).toBe(true);
        expect(app.errorMessage).toBe('Статус[401]: Время токена истекло');
    });
});
