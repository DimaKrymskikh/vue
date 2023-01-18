import axios from 'axios';
import { ref } from "vue";
import { defineStore } from 'pinia';

interface RequestBody {
    [index: string]: any;
}

export interface App {
    basicUrl: string;
    aud: string;
    token: string;
    isGuest: boolean;
    isRequest: boolean;
    setData: Function;
    [index: string]: any;
}

export const useAppStore = defineStore("app", () => {
    const basicUrl = import.meta.env.VITE_API_URL as string;
    const aud = 'vue' as string;
    const token = ''; 
    const isGuest = true;
    const isRequest = false;
    
    function setData(this: App, data: App) {
        for (let field in data) {
            if (!this.hasOwnProperty(field)) {
                continue;
            }
            this[field] = data[field];
        }
    };
    
    function setDefault(this: App) {
        this.token = '';
        this.isGuest = true;
        this.isRequest = false;
    }
    
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
                    token: this.token,
                    aud,
                    ...data
                })
            });

            if (response.status >= 400) {
                this.setDefault();
                return false;
            }

            result = await response.data;

            for (let field in ob) {
                ob[field].setData(result[field]);
            }
        } catch(e) {
        } finally {
            this.isRequest = false;
            return result;
        }
    };
    
    return { token, aud, isGuest, isRequest, setData, request }
});
