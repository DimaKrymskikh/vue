import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";

import HomeView from "../../views/HomeView.vue";

describe("HomeView", () => {
    it("Данные загружены", () => {
        const wrapper = mount(HomeView, {
            global: {
                provide: {
                    'app': {
                        isRequest: false
                    }
                }
            }
        });
        const h1 = wrapper.get('h1');
        const spinner = wrapper.find('#spinner');
        
        expect(h1.text()).toContain("Главная страница");
        expect(h1.isVisible()).toBe(true);
        expect(spinner.exists()).toBe(false);
    });
    
    it("Выполняется запрос", () => {
        const wrapper = mount(HomeView, {
            global: {
                provide: {
                    'app': {
                        isRequest: true
                    }
                }
            }
        });
        const h1 = wrapper.find('h1');
        const spinner = wrapper.find('#spinner');
       
        expect(h1.text()).toContain("Главная страница");
        expect(h1.exists()).toBe(true);
        expect(spinner.exists()).toBe(true);
    });
});
