import { ref } from "vue";
import { defineStore } from 'pinia';

export interface User {
    login: string;
    setData: Function;
    [index: string]: any;
}

export const useUserStore = defineStore("user", () => {
    const login = ''; 

    function setData(this: User, data: User): void {
        for (let field in data) {
            if (!this.hasOwnProperty(field)) {
                continue;
            }
            this[field] = data[field];
        }
    };
    
    function testLogin(text: string): Boolean {
        return /^[A-Z]\w{3,17}$/.test(text);
    }
    
    function getErrorsListLogin(text: string): string {
        let errors = [];
        if (!/^[A-Z]/.test(text)) {
            errors.push('Логин должен начинаться с заглавной латинской буквы.');
        }
        if (text.length < 4 || text.length > 18) {
            errors.push('Логин должен состоять из 4 - 18 символов.');
        }
        let matches = /(\W)/.exec(text);
        if (matches) {
            errors.push(`Логин не должен содержать символ '#'.`.replace('#', matches[1]));
        }
        
        return errors.join(' ');
    }
    
    function testPassword(text: string): Boolean {
        return /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,64}$/.test(text);
    }
    
    function getErrorsListPassword(text: string): string {
        let errors = [];
        if (!/^.{6,64}$/.test(text)) {
            errors.push('Пароль должен состоять из 6 - 64 символов.');
        }
        if (!/\d/.test(text)) {
            errors.push('Пароль должен содержать хотя бы одно число.');
        }
        if (!/[a-z]/.test(text)) {
            errors.push('Пароль должен содержать хотя бы одну строчную латинскую букву.');
        }
        if (!/[A-Z]/.test(text)) {
            errors.push('Пароль должен содержать хотя бы одну прописную латинскую букву.');
        }

        return errors.join(' ');
    };
    
    return {
        login,
        setData,
        testLogin,
        getErrorsListLogin,
        testPassword,
        getErrorsListPassword
    }
});
