import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";

import { setActivePinia, createPinia } from 'pinia';
import { useUserStore } from "../../../stores/user";
import type { User } from '../../../stores/user';

describe("Хранилище user", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });
    
    it("Применение setData", () => {
        const user = useUserStore();
        // Дефолтные значения
        expect(user.login).toBe('');
        // Изменяем эти свойства
        user.setData({
            login: 'TestLogin'
        } as User);
        // Свойства изменились
        expect(user.login).toBe('TestLogin');
    });
    
    it("testLogin и getErrorsListLogin", () => {
        const user = useUserStore();
        // Если поле логина не заполнено
        let login = '';
        expect(user.testLogin(login)).toBe(false);
        expect(user.getErrorsListLogin(login)).toBe('Логин должен начинаться с заглавной латинской буквы. Логин должен состоять из 4 - 18 символов.');
        // Логин начинается со строчной буквы
        login = 't';
        expect(user.testLogin(login)).toBe(false);
        expect(user.getErrorsListLogin(login)).toBe('Логин должен начинаться с заглавной латинской буквы. Логин должен состоять из 4 - 18 символов.');
        // Логин начинается с прописной буквы, и мало символов
        login = 'T';
        expect(user.testLogin(login)).toBe(false);
        expect(user.getErrorsListLogin(login)).toBe('Логин должен состоять из 4 - 18 символов.');
        // Правильный логин
        login = 'Test';
        expect(user.testLogin(login)).toBe(true);
        expect(user.getErrorsListLogin(login)).toBe('');
        // Присутствует недопустимый символ
        login = 'Test ';
        expect(user.testLogin(login)).toBe(false);
        expect(user.getErrorsListLogin(login)).toBe("Логин не должен содержать символ ' '.");
        // Правильный логин
        login = 'TestLogin';
        expect(user.testLogin(login)).toBe(true);
        expect(user.getErrorsListLogin(login)).toBe('');
        // 18 символов
        login = 'TestLogin012345678';
        expect(user.testLogin(login)).toBe(true);
        expect(user.getErrorsListLogin(login)).toBe('');
        // 19 символов
        login = 'TestLogin0123456789';
        expect(user.testLogin(login)).toBe(false);
        expect(user.getErrorsListLogin(login)).toBe('Логин должен состоять из 4 - 18 символов.');
    });
    
    it("testPassword и getErrorsListPassword", () => {
        const user = useUserStore();
        // Поле для пароля не заполнено
        let password = '';
        expect(user.testPassword(password)).toBe(false);
        expect(user.getErrorsListPassword(password)).toBe('Пароль должен состоять из 6 - 64 символов. Пароль должен содержать хотя бы одно число. Пароль должен содержать хотя бы одну строчную латинскую букву. Пароль должен содержать хотя бы одну прописную латинскую букву.');
        // 
        password = 'T';
        expect(user.testPassword(password)).toBe(false);
        expect(user.getErrorsListPassword(password)).toBe('Пароль должен состоять из 6 - 64 символов. Пароль должен содержать хотя бы одно число. Пароль должен содержать хотя бы одну строчную латинскую букву.');
        // 
        password = 'Test';
        expect(user.testPassword(password)).toBe(false);
        expect(user.getErrorsListPassword(password)).toBe('Пароль должен состоять из 6 - 64 символов. Пароль должен содержать хотя бы одно число.');
        // 
        password = 'TestPassword';
        expect(user.testPassword(password)).toBe(false);
        expect(user.getErrorsListPassword(password)).toBe('Пароль должен содержать хотя бы одно число.');
        // 
        password = 'TestPassword~';
        expect(user.testPassword(password)).toBe(false);
        expect(user.getErrorsListPassword(password)).toBe('Пароль должен содержать хотя бы одно число.');
        // Правильный пароль
        password = 'TestPassword~0';
        expect(user.testPassword(password)).toBe(true);
        expect(user.getErrorsListPassword(password)).toBe('');
    });
});
