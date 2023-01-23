import axios, { AxiosError } from 'axios';
import { ref } from "vue";
import { defineStore } from 'pinia';

interface RequestBody {
    [index: string]: any;
}

export interface App {
    aud: string;
    token: string;
    isGuest: boolean;
    isRequest: boolean;
    isForbidden: boolean;
    errorMessage: string,
    setData: Function;
    [index: string]: any;
}

export const useAppStore = defineStore("app", () => {
    const basicUrl = import.meta.env.VITE_API_URL as string;
    const aud = 'vue' as string;
    const token = ''; 
    const isGuest = true;
    const isRequest = false;
    const isForbidden = false;
    const errorMessage = '';
    
    function setData(this: App, data: App) {
        for (let field in data) {
            if (!this.hasOwnProperty(field)) {
                continue;
            }
            this[field] = data[field];
        }
    };
    
    async function request(this: App, url: string, method: string, data: object | null, ob: RequestBody = {}, isSpinner = true) {
        // Запускается большой спиннер только, если в этом есть необходимость
        this.isRequest = isSpinner;
        
        let result;

        try {
            const response = await axios(`${basicUrl}/${url}`, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    // Всегда отправляется токен
                    token: this.token,
                    // Всегда отправляется id клиентского приложения
                    aud,
                    ...data
                })
            });

            result = await response.data;

            for (let field in ob) {
                ob[field].setData(result[field]);
            }
        } catch(e) {
            this.isForbidden = true;
            if (e instanceof AxiosError) {
                const response = JSON.parse(e.request.response);
                this.errorMessage = `Статус[${e.request.status}]: ${response.message}`;
            } else {
            }
        } finally {
            this.isRequest = false;
            return result;
        }
    };
    
    return { token, aud, isGuest, isRequest, isForbidden, errorMessage, setData, request }
});
