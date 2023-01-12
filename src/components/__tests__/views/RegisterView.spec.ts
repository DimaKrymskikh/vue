import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import type { Mock } from "vitest";

import { setActivePinia, createPinia } from 'pinia';
import RegisterView from "../../../views/RegisterView.vue";
import Spinner from '../../../components/Spinner.vue';
import BreadCrumb from "../../../components/BreadCrumb.vue";
import ErrorsList from '../../../components/ErrorsList.vue';
import InputLabel from '../../../components/InputLabel.vue';
import router from "../../../router";
import { useAppStore } from '../../../stores/app';
import { useUserStore } from '../../../stores/user';

import axios from 'axios';
vi.mock('axios');

describe("RegisterView", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });
    afterEach(async () => {
        await (axios as any as Mock).mockClear();
    });
    
    it("Монтирование компоненты", () => {
        const user = useUserStore();
        const app = useAppStore();
        const wrapper = mount(RegisterView, {
            global: {
                provide: { app, user },
                plugins: [router]
            }
        });

        // Проверяем заголовок страницы
        expect(wrapper.get('h1').text()).toBe("Регистрация");
        // Поля не заполнены
        const inputLogin = wrapper.get('[name=login]');
        const inputPassword = wrapper.get('[name=password]');
        const inputVerification = wrapper.get('[name=verification]');
        expect((inputLogin.element as HTMLInputElement).value).toBe('');
        expect((inputPassword.element as HTMLInputElement).value).toBe('');
        expect((inputVerification.element as HTMLInputElement).value).toBe('');
        // Кнопка "Зарегистрироваться" заблокирована
        expect(wrapper.get('#register-button').classes('disabled')).toBe(true);
        // Отсутствует спиннер
        expect(wrapper.findComponent(Spinner).exists()).toBe(false);
        // Присутствуют хлебные крошки
        const breadCrumb = wrapper.getComponent(BreadCrumb);
        expect(breadCrumb.isVisible()).toBe(true);
        // Имеется ссылка на главную страницу
        const breadCrumbLi = breadCrumb.findAll('li');
        expect(breadCrumbLi[0].text()).toBe("Главная страница");
        expect(breadCrumbLi[0].get('a[href="/"]').isVisible()).toBe(true);
        // Имеется ссылка на страницу "Вход"
        expect(breadCrumbLi[1].text()).toBe("Вход");
        expect(breadCrumbLi[1].get('a[href="/login"]').isVisible()).toBe(true);
        // Хлебные крошки указывают, что открыта страница "Регистрация"
        expect(breadCrumbLi[2].text()).toBe("Регистрация");
        expect(breadCrumbLi[2].find('a').exists()).toBe(false);
        // Сообщения об ошибках отсутствуют
        const errorsList = wrapper.getComponent(ErrorsList);
        expect(errorsList.isVisible()).toBe(false);
        expect(errorsList.text()).toBe("");
    });
    
    it("Отслеживание заполнения поля login", async () => {
        const user = useUserStore();
        const app = useAppStore();
        const wrapper = mount(RegisterView, {
            global: {
                provide: { app, user },
                plugins: [router]
            }
        });

        // В начальный момент поле логин не заполнено
        const inputLogin = wrapper.get('[name=login]');
        expect((inputLogin.element as HTMLInputElement).value).toBe('');
        // Сообщение об ошибках при заполнении поля login скрыто
        const spanLabelLogit = wrapper.findAllComponents(InputLabel)[0].find('span');
        expect(spanLabelLogit.isVisible()).toBe(false);
        
        // Добавляем один символ (сначала, не прописную латинскую букву)
        await inputLogin.setValue('a');
        expect(spanLabelLogit.isVisible()).toBe(true);
        expect(spanLabelLogit.text()).toBe("Логин должен начинаться с заглавной латинской буквы. Логин должен состоять из 4 - 18 символов.");
        await inputLogin.setValue('~');
        expect(spanLabelLogit.isVisible()).toBe(true);
        expect(spanLabelLogit.text()).toBe("Логин должен начинаться с заглавной латинской буквы. Логин должен состоять из 4 - 18 символов. Логин не должен содержать символ '~'.");
        await inputLogin.setValue('Я');
        expect(spanLabelLogit.isVisible()).toBe(true);
        expect(spanLabelLogit.text()).toBe("Логин должен начинаться с заглавной латинской буквы. Логин должен состоять из 4 - 18 символов. Логин не должен содержать символ 'Я'.");
        // Добавляем один символ - прописную латинскую букву
        await inputLogin.setValue('T');
        expect(spanLabelLogit.isVisible()).toBe(true);
        expect(spanLabelLogit.text()).toBe("Логин должен состоять из 4 - 18 символов.");
        
        // Ещё несколько неверных заполнений
        await inputLogin.setValue('estL');
        expect(spanLabelLogit.isVisible()).toBe(true);
        expect(spanLabelLogit.text()).toBe("Логин должен начинаться с заглавной латинской буквы.");
        await inputLogin.setValue('7estL');
        expect(spanLabelLogit.isVisible()).toBe(true);
        expect(spanLabelLogit.text()).toBe("Логин должен начинаться с заглавной латинской буквы.");
        await inputLogin.setValue('TestL%');
        expect(spanLabelLogit.isVisible()).toBe(true);
        expect(spanLabelLogit.text()).toBe("Логин не должен содержать символ '%'.");
        await inputLogin.setValue('Tes');
        expect(spanLabelLogit.isVisible()).toBe(true);
        expect(spanLabelLogit.text()).toBe("Логин должен состоять из 4 - 18 символов.");
        // Больше 18 символов
        await inputLogin.setValue('TestLogin0123456789');
        expect(spanLabelLogit.isVisible()).toBe(true);
        expect(spanLabelLogit.text()).toBe("Логин должен состоять из 4 - 18 символов.");
        
        // Правильное заполнение
        await inputLogin.setValue('TestLogin');
        expect(spanLabelLogit.isVisible()).toBe(false);
        expect(spanLabelLogit.text()).toBe("");
    });
    
    it("Отслеживание заполнения поля password", async () => {
        const user = useUserStore();
        const app = useAppStore();
        const wrapper = mount(RegisterView, {
            global: {
                provide: { app, user },
                plugins: [router]
            }
        });

        // В начальный момент поле password не заполнено
        const inputPassword = wrapper.get('[name=password]');
        expect((inputPassword.element as HTMLInputElement).value).toBe('');
        // Сообщение об ошибках при заполнении поля password скрыто
        const spanLabelPassword = wrapper.findAllComponents(InputLabel)[1].find('span');
        expect(spanLabelPassword.isVisible()).toBe(false);
        
        // Добавляем один символ
        await inputPassword.setValue('f');
        expect(spanLabelPassword.isVisible()).toBe(true);
        expect(spanLabelPassword.text()).toBe("Пароль должен состоять из 6 - 64 символов. Пароль должен содержать хотя бы одно число. Пароль должен содержать хотя бы одну прописную латинскую букву.");
        await inputPassword.setValue('F');
        expect(spanLabelPassword.isVisible()).toBe(true);
        expect(spanLabelPassword.text()).toBe("Пароль должен состоять из 6 - 64 символов. Пароль должен содержать хотя бы одно число. Пароль должен содержать хотя бы одну строчную латинскую букву.");
        await inputPassword.setValue('2');
        expect(spanLabelPassword.isVisible()).toBe(true);
        expect(spanLabelPassword.text()).toBe("Пароль должен состоять из 6 - 64 символов. Пароль должен содержать хотя бы одну строчную латинскую букву. Пароль должен содержать хотя бы одну прописную латинскую букву.");
        await inputPassword.setValue(' ');
        expect(spanLabelPassword.isVisible()).toBe(true);
        expect(spanLabelPassword.text()).toBe("Пароль должен состоять из 6 - 64 символов. Пароль должен содержать хотя бы одно число. Пароль должен содержать хотя бы одну строчную латинскую букву. Пароль должен содержать хотя бы одну прописную латинскую букву.");
        
        // Меньше 6 символов
        await inputPassword.setValue('fdG');
        expect(spanLabelPassword.isVisible()).toBe(true);
        expect(spanLabelPassword.text()).toBe("Пароль должен состоять из 6 - 64 символов. Пароль должен содержать хотя бы одно число.");
        await inputPassword.setValue('fd8~');
        expect(spanLabelPassword.isVisible()).toBe(true);
        expect(spanLabelPassword.text()).toBe("Пароль должен состоять из 6 - 64 символов. Пароль должен содержать хотя бы одну прописную латинскую букву.");
        await inputPassword.setValue('8G');
        expect(spanLabelPassword.isVisible()).toBe(true);
        expect(spanLabelPassword.text()).toBe("Пароль должен состоять из 6 - 64 символов. Пароль должен содержать хотя бы одну строчную латинскую букву.");
        await inputPassword.setValue('fd8GЫ');
        expect(spanLabelPassword.isVisible()).toBe(true);
        expect(spanLabelPassword.text()).toBe("Пароль должен состоять из 6 - 64 символов.");
        
        // От 6 до 64 символов
        await inputPassword.setValue('fdGq%я');
        expect(spanLabelPassword.isVisible()).toBe(true);
        expect(spanLabelPassword.text()).toBe("Пароль должен содержать хотя бы одно число.");
        await inputPassword.setValue('fdffffq%я');
        expect(spanLabelPassword.isVisible()).toBe(true);
        expect(spanLabelPassword.text()).toBe("Пароль должен содержать хотя бы одно число. Пароль должен содержать хотя бы одну прописную латинскую букву.");
        await inputPassword.setValue('555FF%я');
        expect(spanLabelPassword.isVisible()).toBe(true);
        expect(spanLabelPassword.text()).toBe("Пароль должен содержать хотя бы одну строчную латинскую букву.");
        
        // Более 64 символов
        await inputPassword.setValue('TestPassword01234567890123456789012345678901234567890123456789012'); // 65 символов
        expect(spanLabelPassword.isVisible()).toBe(true);
        expect(spanLabelPassword.text()).toBe("Пароль должен состоять из 6 - 64 символов.");
        
        
        // Правильные пароли
        // 6 символов
        await inputPassword.setValue('TestP5');
        expect(spanLabelPassword.isVisible()).toBe(false);
        expect(spanLabelPassword.text()).toBe("");
        // 64 символа
        await inputPassword.setValue('TestPassword0123456789012345678901234567890123456789012345678901'); 
        expect(spanLabelPassword.isVisible()).toBe(false);
        expect(spanLabelPassword.text()).toBe("");
        // С кириллицей
        await inputPassword.setValue('Пароль7fF'); 
        expect(spanLabelPassword.isVisible()).toBe(false);
        expect(spanLabelPassword.text()).toBe("");
    });
    
    it("Отслеживание заполнения поля verification", async () => {
        const user = useUserStore();
        const app = useAppStore();
        const wrapper = mount(RegisterView, {
            global: {
                provide: { app, user },
                plugins: [router]
            }
        });

        // Задаём пароль
        const inputPassword = wrapper.get('[name=password]');
        await inputPassword.setValue('TestPassword8');
        
        // В начальный момент поле verification не заполнено
        const inputVerification = wrapper.get('[name=verification]');
        expect((inputVerification.element as HTMLInputElement).value).toBe('');
        // Сообщение об ошибках при заполнении поля verification скрыто
        const spanLabelVerification = wrapper.findAllComponents(InputLabel)[2].find('span');
        expect(spanLabelVerification.isVisible()).toBe(false);
        
        // Добавляем один символ
        await inputVerification.setValue('T');
        expect(spanLabelVerification.isVisible()).toBe(true);
        expect(spanLabelVerification.text()).toBe("Нет совпадения");
        // Ещё несколько
        await inputVerification.setValue('TestPa');
        expect(spanLabelVerification.isVisible()).toBe(true);
        expect(spanLabelVerification.text()).toBe("Нет совпадения");
        // Перебор
        await inputVerification.setValue('TestPassword88');
        expect(spanLabelVerification.isVisible()).toBe(true);
        expect(spanLabelVerification.text()).toBe("Нет совпадения");
        
        // Правильное заполнение
        await inputVerification.setValue('TestPassword8');
        expect(spanLabelVerification.isVisible()).toBe(false);
    });
    
    it("Проверка блокировки кнопки 'Зарегистрироваться'", async () => {
        // Чтобы соответствовать логике запроса request, возвращаемые данные должны иметь такую структуру
        const responseRegister = {
            data: {
                errors: []
            }
        }
        await (axios as any as Mock).mockResolvedValue(responseRegister);
        
        const user = useUserStore();
        const app = useAppStore();
        const wrapper = mount(RegisterView, {
            global: {
                provide: { app, user },
                plugins: [router]
            }
        });

        // В начальный момент поля пустые
        const inputLogin = wrapper.get('[name=login]');
        expect((inputLogin.element as HTMLInputElement).value).toBe('');
        const inputPassword = wrapper.get('[name=password]');
        expect((inputPassword.element as HTMLInputElement).value).toBe('');
        const inputVerification = wrapper.get('[name=verification]');
        expect((inputVerification.element as HTMLInputElement).value).toBe('');
        // поэтому кнопка 'Зарегистрироваться' заблокирована
        const registerButton = wrapper.get('#register-button');
        expect(registerButton.classes('disabled')).toBe(true);
        // Кликаем заблокированную кнопку
        await registerButton.trigger('click');
        await flushPromises();
        // Запрос не отправляется
        expect(axios).toHaveBeenCalledTimes(0);
        
        const spanLabel = wrapper.findAllComponents(InputLabel);
        const spanLabelLogit = spanLabel[0].find('span');
        const spanLabelPassword = spanLabel[1].find('span');
        const spanLabelVerification = spanLabel[2].find('span');

        // Заполняем правильно поле login
        await inputLogin.setValue('TestLogin');
        expect(spanLabelLogit.isVisible()).toBe(false);
        // Кнопка 'Зарегистрироваться' заблокирована
        expect(registerButton.classes('disabled')).toBe(true);
        // Кликаем заблокированную кнопку
        await registerButton.trigger('click');
        await flushPromises();
        // Запрос не отправляется
        expect(axios).toHaveBeenCalledTimes(0);

        // Заполняем правильно поле password
        await inputPassword.setValue('TestPassword8');
        expect(spanLabelPassword.isVisible()).toBe(false);
        // Кнопка 'Зарегистрироваться' заблокирована
        expect(registerButton.classes('disabled')).toBe(true);
        // Кликаем заблокированную кнопку
        await registerButton.trigger('click');
        await flushPromises();
        // Запрос не отправляется
        expect(axios).toHaveBeenCalledTimes(0);

        // Заполняем правильно поле verification
        await inputVerification.setValue('TestPassword8');
        expect(spanLabelVerification.isVisible()).toBe(false);
        // Кнопка 'Зарегистрироваться' разблокирована
        expect(registerButton.classes('disabled')).toBe(false);
        // Кликаем кнопку 'Зарегистрироваться'
        await registerButton.trigger('click');
        await flushPromises();
        // Запрос отправлен
        expect(axios).toHaveBeenCalledTimes(1);
    });
    
    it("Выполняется запрос с существующим логином", async () => {
        // Ответ сервера при существующем логине
        const responseRegister = {
            data: {
                app: {},
                user: {},
                errors: ["Данный логин уже существует. Для регистрации нужно задать другой логин"]
            }
        }
        await (axios as any as Mock).mockResolvedValue(responseRegister);
        
        const user = useUserStore();
        const app = useAppStore();
        const wrapper = mount(RegisterView, {
            global: {
                provide: { app, user },
                plugins: [router]
            }
        });
        
        // Сообщения об ошибках отсутствуют
        const errorsList = wrapper.findComponent(ErrorsList);
        expect(errorsList.isVisible()).toBe(false);
        expect(errorsList.text()).toBe("");
        // Отсутствует спиннер
        expect(wrapper.findComponent(Spinner).exists()).toBe(false);
        // Заполняем поля
        const inputLogin = wrapper.find('[name=login]');
        await inputLogin.setValue('TestLogin');
        const inputPassword = wrapper.find('[name=password]');
        await inputPassword.setValue('TestPassword8');
        const inputVerification = wrapper.find('[name=verification]');
        await inputVerification.setValue('TestPassword8');
        
        // Кнопка 'Зарегистрироваться' разблокирована
        const registerButton = wrapper.find('#register-button');
        expect(registerButton.classes('disabled')).toBe(false);
        // Кликаем кнопку 'Зарегистрироваться'
        await registerButton.trigger('click');
        // Спиннер появляется
        expect(wrapper.findComponent(Spinner).exists()).toBe(true);
        await flushPromises();
        // Запрос отправлен
        expect(axios).toHaveBeenCalledTimes(1);
        // Спиннер пропадает
        expect(wrapper.findComponent(Spinner).exists()).toBe(false);
/**
* Заметил проблему.
* Если во время запроса элемент DOM удалялся, то после завершения запроса
* wrapper обновляется, а элементы inputLogin, inputPassword, inputVerification, errorsList нет
* Почему так происходит, пока понять не смог.
* Пока решил просто применять к wrapper методы find() и findComponent() ещё раз, чтобы получить нужные элементы DOM
*/
     
        // Логин не изменился
//        expect((inputLogin.element as HTMLInputElement).value).toBe('TestLogin');
        expect((wrapper.find('[name=login]').element as HTMLInputElement).value).toBe('TestLogin');
        // Пароль очистился
//        expect((inputPassword.element as HTMLInputElement).value).toBe('');
        expect((wrapper.find('[name=password]').element as HTMLInputElement).value).toBe('');
        // Поле подтверждения очистилось
//        expect((inputVerification.element as HTMLInputElement).value).toBe('');
        expect((wrapper.find('[name=verification]').element as HTMLInputElement).value).toBe('');
        // Появляется сообщение об ошибке
//        expect(errorsList.isVisible()).toBe(true);
//        expect(errorsList.text()).toBe("Данный логин уже существует. Для регистрации нужно задать другой логин");
        expect(wrapper.findComponent(ErrorsList).isVisible()).toBe(true);
        expect(wrapper.findComponent(ErrorsList).text()).toBe("Данный логин уже существует. Для регистрации нужно задать другой логин");
    });
    
    it("Запрос с новым логином", async () => {
        // Ответ сервера, если логин новый
        const responseRegister = {
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
        await (axios as any as Mock).mockResolvedValue(responseRegister);
        // На какую страницу будет перенаправление
        const push = vi.spyOn(router, 'push');
        
        const user = useUserStore();
        const app = useAppStore();
        const wrapper = mount(RegisterView, {
            global: {
                provide: { app, user },
                plugins: [router]
            }
        });

        // Сообщения об ошибках отсутствуют
        const errorsList = wrapper.getComponent(ErrorsList);
        expect(errorsList.isVisible()).toBe(false);
        expect(errorsList.text()).toBe("");
        // Заполняем поля
        const inputLogin = wrapper.get('[name=login]');
        await inputLogin.setValue('TestLogin');
        const inputPassword = wrapper.get('[name=password]');
        await inputPassword.setValue('TestPassword8');
        const inputVerification = wrapper.get('[name=verification]');
        await inputVerification.setValue('TestPassword8');
        
        // Кнопка 'Зарегистрироваться' разблокирована
        const registerButton = wrapper.get('#register-button');
        expect(registerButton.classes('disabled')).toBe(false);
        // Кликаем кнопку 'Зарегистрироваться'
        await registerButton.trigger('click');
        await flushPromises();
        // Запрос отправлен
        expect(axios).toHaveBeenCalledTimes(1);
        // Переход на главную страницу
        expect(push).toHaveBeenCalledWith({ name: "home" });
    });
});
