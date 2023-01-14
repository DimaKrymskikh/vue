import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";

import InputLabel from "../../../components/InputLabel.vue";

describe("ImputLabel", () => {
    it("Монтирование компоненты", () => {
        const wrapper = mount(InputLabel, {
            props: {
                isHidden: false,
                errorText: "Сообщение об ошибке"
            },
            slots: {
                default: '<input type="text" name="field" />'
            }
        });
        
        const span = wrapper.get('span');
        // Присутствует сообщение об ошибке
        expect(span.isVisible()).toBe(true);
        expect(span.text()).toBe("Сообщение об ошибке");
        // Слот отрисовался
        const input = wrapper.get('input');
        expect(input.attributes('type')).toBe('text');
        expect(input.attributes('name')).toBe('field');
    });
});
