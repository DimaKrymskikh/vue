import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";

import AlertAuthentication from "@/components/AlertAuthentication.vue";

describe("AlertAuthentication", () => {
    it("Монтирование компоненты", async () => {
        const wrapper = mount(AlertAuthentication);
        expect(wrapper.text()).toBe('Выполните вход, и у Вас будет больше возможностей');
    });
});
