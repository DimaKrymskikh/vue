import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";

import { setActivePinia, createPinia } from 'pinia';
import { useAppStore } from "../../../stores/app";
import type { App } from '../../../stores/app';

describe("Хранилище app", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });
    
    it("Применение setData", () => {
        const app = useAppStore();
        // Дефолтные значения
        expect(app.token).toBe('');
        expect(app.isGuest).toBe(true);
        // Изменяем эти свойства
        app.setData({
            token: 'Новый токен',
            isGuest: false
        } as App);
        // Свойства изменились
        expect(app.token).toBe('Новый токен');
        expect(app.isGuest).toBe(false);
    });
});
