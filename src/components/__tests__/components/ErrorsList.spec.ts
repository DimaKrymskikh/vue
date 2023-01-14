import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";

import ErrorsList from "../../../components/ErrorsList.vue";

describe("ErrorsList", () => {
    it("Монтирование компоненты", () => {
        const wrapper = mount(ErrorsList, {
            props: {
                errors: [
                    'Ошибка 1',
                    'Ошибка 2',
                    'Ошибка 3',
                    'Ошибка 4'
                ]
            },
        });
 
        const div = wrapper.findAll('div.font-sans div');
        // Ошибки отрисовываются
        expect(div[0].text()).toBe('Ошибка 1');
        expect(div[1].text()).toBe('Ошибка 2');
        expect(div[2].text()).toBe('Ошибка 3');
        expect(div[3].text()).toBe('Ошибка 4');
        expect(div.length).toBe(4);
    });
});
