import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";

import { setActivePinia, createPinia } from 'pinia';
import HomeView from "@/views/HomeView.vue";
import Spinner from '@/components/Spinner.vue';
import { useAppStore } from '@/stores/app';

describe("HomeView", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });
    
    it("Данные загружены", () => {
        const app = useAppStore();
        
        const wrapper = mount(HomeView, {
            global: {
                provide: { app }
            }
        });
        
        // Отрисовывается название страницы
        const h1 = wrapper.get('h1');
        expect(h1.text()).toContain("Главная страница");
        expect(h1.isVisible()).toBe(true);
        // Спиннер отсутствует
        expect(wrapper.findComponent(Spinner).exists()).toBe(false);
    });
    
    it("Выполняется запрос", () => {
        const app = useAppStore();
        app.isRequest = true;
        
        const wrapper = mount(HomeView, {
            global: {
                provide: { app },
            }
        });
        
        // Отрисовывается название страницы
        const h1 = wrapper.get('h1');
        expect(h1.text()).toContain("Главная страница");
        expect(h1.isVisible()).toBe(true);
        // Спиннер присутствует
        expect(wrapper.findComponent(Spinner).exists()).toBe(true);
    });
});
