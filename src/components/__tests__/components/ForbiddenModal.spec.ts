import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import type { Mock } from "vitest";

import ForbiddenModal from "@/components/ForbiddenModal.vue";

describe("ForbiddenModal", () => {
    it("Монтирование компоненты", async () => {
        window.location = {
            reload: vi.fn()
        } as any;
        
        const wrapper = mount(ForbiddenModal, {
            props: {
                message: 'Некоторое сообщение',
            }
        });
        
        const button = wrapper.get('button');
        
        expect(wrapper.text()).toContain('Некоторое сообщение');
        expect(button.text()).toBe('Закрыть');
        
        await button.trigger('click');
        expect(location.reload).toHaveBeenCalledTimes(1);
    });
});
