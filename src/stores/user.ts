import { ref } from "vue";
import { defineStore } from 'pinia';

export interface User {
    login: string;
    setData: Function;
    [index: string]: any;
}

export const useUserStore = defineStore("user", () => {
    const login = ref('' as string); 

    function setData(this: User, data: User): void {
        for (let field in data) {
            if (!this.hasOwnProperty(field)) {
                continue;
            }
            this[field] = data[field];
        }
    };
    
    return { login, setData }
});
