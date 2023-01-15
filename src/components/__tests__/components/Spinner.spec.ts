import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";

import Spinner from "../../../components/Spinner.vue";

describe("Spinner", () => {
    it("Проверка передачи спиннеру нужной высоты", async () => {
        const wrapper = mount(Spinner, {
            props: {
                hSpinner: 'h-16'
            }
        });
        expect(wrapper.get('svg').classes('h-16')).toBe(true);
    });
});
