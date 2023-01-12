import { ref } from "vue";
import { defineStore } from 'pinia';

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
    const token = ref('' as string); 
    const isGuest = ref(true as boolean);
    const isRequest = ref(false as boolean);
    
    function setData(this: App, data: App) {
        for (let field in data) {
            if (!this.hasOwnProperty(field)) {
                continue;
            }
            this[field] = data[field];
        }
    };
    
    return { basicUrl, aud, token, isGuest, isRequest, setData }
});
