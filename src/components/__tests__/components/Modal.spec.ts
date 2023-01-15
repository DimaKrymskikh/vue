import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";

import Modal from "../../../components/Modal.vue";

describe("Modal", () => {
    it("Монтирование компоненты при isRequest = false", async () => {
        const wrapper = mount(Modal, {
            props: {
                modalId: 'modal',
                headerTitle: 'Заголовок модального окна',
                isRequest: false,
                handlerSubmit: vi.fn(),
                hideModal: vi.fn()
            },
            slots: {
                body: 'Тело модального окна'
            }
        });

        // id модального окна передан
        const modal = wrapper.find('#modal');
        expect(modal.exists()).toBe(true);
        // Присутствует заголовок модального окна
        expect(modal.text()).toContain('Заголовок модального окна');
        // Присутствует тело модального окна
        expect(modal.text()).toContain('Тело модального окна');
        
        // У кнопок нет блокирующих классов
        const buttons = modal.findAll('button');
        expect(buttons.length).toBe(3);
        expect(buttons[0].classes('stop-event')).toBe(false);
        expect(buttons[1].classes('disabled')).toBe(false);
        expect(buttons[2].classes('disabled')).toBe(false);
        // У заднего фона нет блокирующего класса
        expect(modal.get('.fixed.opacity-25').classes('stop-event')).toBe(false);
    });
    
    it("Монтирование компоненты при isRequest = true", async () => {
        const wrapper = mount(Modal, {
            props: {
                modalId: 'modal',
                headerTitle: 'Заголовок модального окна',
                isRequest: true,
                handlerSubmit: vi.fn(),
                hideModal: vi.fn()
            },
            slots: {
                body: 'Тело модального окна'
            }
        });

        // id модального окна передан
        const modal = wrapper.find('#modal');
        expect(modal.exists()).toBe(true);
        // Присутствует заголовок модального окна
        expect(modal.text()).toContain('Заголовок модального окна');
        // Присутствует тело модального окна
        expect(modal.text()).toContain('Тело модального окна');
        
        // У кнопок имеется блокирующий класс
        const buttons = modal.findAll('button');
        expect(buttons.length).toBe(3);
        expect(buttons[0].classes('stop-event')).toBe(true);
        expect(buttons[1].classes('disabled')).toBe(true);
        expect(buttons[2].classes('disabled')).toBe(true);
        // У заднего фона имеется блокирующий класс
        expect(modal.get('.fixed.opacity-25').classes('stop-event')).toBe(true);
    });
});
