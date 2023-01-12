import { describe, it, expect, vi, afterEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import type { Mock } from "vitest";

import LoginView from "../../../views/LoginView.vue";
import BreadCrumb from "../../../components/BreadCrumb.vue";
import Spinner from '../../../components/Spinner.vue';
import ErrorsList from '../../../components/ErrorsList.vue';
import router from "../../../router";

import axios from 'axios';
vi.mock('axios');

describe("LoginView", () => {
    afterEach(async () => {
        await (axios as any as Mock).mockClear();
    });
    
    const wrapperLoginViewOptions = {
        global: {
            provide: {
                app: {
                    isRequest: false, 
                    basicUrl: 'test',
                    setData: vi.fn()
                },
                user: {
                    setData: vi.fn()
                },
            },
            plugins: [router]
        }
    };
    
    it("Монтирование компоненты", () => {
        const wrapper = mount(LoginView, wrapperLoginViewOptions);

        // Проверяем заголовок страницы
        expect(wrapper.get('h1').text()).toBe("Вход");
        // Пароль и логин не заполнены
        const inputLogin = wrapper.get('[name=login]');
        const inputPassword = wrapper.get('[name=password]');
        expect((inputLogin.element as HTMLInputElement).value).toBe('');
        expect((inputPassword.element as HTMLInputElement).value).toBe('');
        // Кнопка "Вход" заблокирована
        expect(wrapper.get('#login-button').classes('disabled')).toBe(true);
        // Имеется ссылка регистрации
        expect(wrapper.get('a[href="/register"]').isVisible()).toBe(true);
        // Отсутствует спиннер
        expect(wrapper.findComponent(Spinner).exists()).toBe(false);
        // Присутствуют хлебные крошки
        const breadCrumb = wrapper.getComponent(BreadCrumb);
        expect(breadCrumb.isVisible()).toBe(true);
        // Имеется ссылка на главную страницу
        const breadCrumbLi = breadCrumb.findAll('li');
        expect(breadCrumbLi[0].text()).toBe("Главная страница");
        expect(breadCrumbLi[0].get('a[href="/"]').isVisible()).toBe(true);
        // Хлебные крошки указывают, что открыта страница "Вход"
        expect(breadCrumbLi[1].text()).toBe("Вход");
        expect(breadCrumbLi[1].find('a').exists()).toBe(false);
        // Сообщения об ошибках отсутствуют
        const errorsList = wrapper.getComponent(ErrorsList);
        expect(errorsList.isVisible()).toBe(false);
        expect(errorsList.text()).toBe("");
    });
    
    it("Проверка блокировки кнопки 'Вход'", async () => {
        // Чтобы соответствовать логике запроса request, возвращаемые данные должны иметь такую структуру
        const responseLogin = {
            data: {
                errors: []
            }
        }
        await (axios as any as Mock).mockResolvedValue(responseLogin);
        
        const wrapper = mount(LoginView, wrapperLoginViewOptions);
        
        // Кнопка "Вход" разблокируется, если оба поля login и password заполнены
        const loginButton = wrapper.get('#login-button');
        const inputLogin = wrapper.get('[name=login]');
        const inputPassword = wrapper.get('[name=password]');
        
        // Вначальный момент оба поля не заполнены
        expect((inputLogin.element as HTMLInputElement).value).toBe('');
        expect((inputPassword.element as HTMLInputElement).value).toBe('');
        // поэтому кнопка "Вход" заблокирована
        expect(loginButton.classes('disabled')).toBe(true);
        // Кликаем заблокированную кнопку
        await loginButton.trigger('click');
        await flushPromises();
        // Запрос не отправляется
        expect(axios).toHaveBeenCalledTimes(0);
        
        // Поле login заполнено, поле password нет
        await inputLogin.setValue('TestLogin');
        expect((inputLogin.element as HTMLInputElement).value).toBe('TestLogin');
        expect((inputPassword.element as HTMLInputElement).value).toBe('');
        // кнопка "Вход" заблокирована
        expect(loginButton.classes('disabled')).toBe(true);
        // Кликаем заблокированную кнопку
        await loginButton.trigger('click');
        await flushPromises();
        // Запрос не отправляется
        expect(axios).toHaveBeenCalledTimes(0);
        
        // Поле login не заполнено, поле password да
        await inputLogin.setValue('');
        await inputPassword.setValue('TestPassword');
        expect((inputLogin.element as HTMLInputElement).value).toBe('');
        expect((inputPassword.element as HTMLInputElement).value).toBe('TestPassword');
        // кнопка "Вход" заблокирована
        expect(loginButton.classes('disabled')).toBe(true);
        // Кликаем заблокированную кнопку
        await loginButton.trigger('click');
        await flushPromises();
        // Запрос не отправляется
        expect(axios).toHaveBeenCalledTimes(0);
        
        // Оба поля заполнены
        await inputLogin.setValue('TestLogin');
        expect((inputLogin.element as HTMLInputElement).value).toBe('TestLogin');
        expect((inputPassword.element as HTMLInputElement).value).toBe('TestPassword');
        // кнопка "Вход" разблокирована
        expect(loginButton.classes('disabled')).toBe(false);
        // Кликаем кнопку "Вход"
        await loginButton.trigger('click');
        await flushPromises();
        // Запрос отправился
        expect(axios).toHaveBeenCalledTimes(1);
    });
    
    it("Выполняется запрос с ошибочными данными", async () => {
        // Ответ сервера при ошибочном пароле
        const responseLogin = {
            data: {
                app: {},
                user: {},
                errors: ["Неправильный логин или пароль"]
            }
        }
        await (axios as any as Mock).mockResolvedValue(responseLogin);
        
        const wrapper = mount(LoginView, wrapperLoginViewOptions);
        // Кнопка "Вход" заблокирована
        const loginButton = wrapper.get('#login-button');
        expect(loginButton.classes('disabled')).toBe(true);
        // Сообщения об ошибках отсутствуют
        const errorsList = wrapper.getComponent(ErrorsList);
        expect(errorsList.isVisible()).toBe(false);
        expect(errorsList.text()).toBe("");
        // Заполняем поля
        const inputLogin = wrapper.find('[name=login]');
        const inputPassword = wrapper.find('[name=password]');
        await inputLogin.setValue('TestLogin');
        await inputPassword.setValue('TestPassword');
        expect((inputLogin.element as HTMLInputElement).value).toBe('TestLogin');
        expect((inputPassword.element as HTMLInputElement).value).toBe('TestPassword');
        // Кнопка "Вход" разблокирована
        expect(loginButton.classes('disabled')).toBe(false);
        
        // Отправляем данные на сервер
        await loginButton.trigger('click');
        await flushPromises();
        // Запрос отправился
        expect(axios).toHaveBeenCalledTimes(1);
        // Логин не изменился
        expect((inputLogin.element as HTMLInputElement).value).toBe('TestLogin');
        // Пароль очистился
        expect((inputPassword.element as HTMLInputElement).value).toBe('');
        // Появляется сообщение об ошибке
        expect(errorsList.isVisible()).toBe(true);
        expect(errorsList.text()).toBe("Неправильный логин или пароль");
    });
    
    it("Запрос с правильным паролем", async () => {
        // Ответ сервера при правильном пароле
        const responseLogin = {
            data: {
                app: {
                    token: "Некоторый токен",
                    isGuest: false
                },
                user: {
                    login: "TestLogin"
                },
                errors: []
            }
        }
        // Задаём ожидаемый ответ сервера
        await (axios as any as Mock).mockResolvedValue(responseLogin);
        // На какую страницу будет перенаправление
        const push = vi.spyOn(router, 'push');
        
        const wrapper = mount(LoginView, wrapperLoginViewOptions);
       
        // Кнопка "Вход" заблокирована
        const loginButton = wrapper.get('#login-button');
        expect(loginButton.classes('disabled')).toBe(true);
        // Заполняем поля
        const inputLogin = wrapper.find('[name=login]');
        const inputPassword = wrapper.find('[name=password]');
        await inputLogin.setValue('TestLogin');
        await inputPassword.setValue('TestPassword');
        expect((inputLogin.element as HTMLInputElement).value).toBe('TestLogin');
        expect((inputPassword.element as HTMLInputElement).value).toBe('TestPassword');
        // Кнопка "Вход" разблокирована
        expect(loginButton.classes('disabled')).toBe(false);
        
        // Кликаем кнопку "Вход"
        await loginButton.trigger('click');
        await flushPromises();
        // Запрос отправляется
        expect(axios).toHaveBeenCalledTimes(1);
        // Переход на главную страницу
        expect(push).toHaveBeenCalledWith({ name: "home" });
    });
});
