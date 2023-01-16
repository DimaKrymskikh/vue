import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";

import { setActivePinia, createPinia } from 'pinia';
import { filmCardStore } from "../../../stores/film";
import type { Film } from '../../../stores/film';

describe("Хранилище film", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });
    
    it("Применение setData", () => {
        const film = filmCardStore();
        // Дефолтные значения
        expect(film.filmId).toBe(undefined);
        expect(film.title).toBe(undefined);
        expect(film.description).toBe(undefined);
        expect(film.releaseYear).toBe(undefined);
        expect(film.actorNames).toBe(undefined);
        expect(film.language).toBe(undefined);
        // Изменяем свойства
        film.setData({
            filmId: 38,
            title: "Ark Ridgemont",
            description: "A Beautiful Yarn of a Pioneer And a Monkey who must Pursue a Explorer in The Sahara Desert",
            releaseYear: 2006,
            actorNames: ["Audrey Bailey","Nick Degeneres","Parker Goldberg"],
            language: "English"
        } as Film);
        // Свойства изменились
        expect(film.filmId).toBe(38);
        expect(film.title).toBe("Ark Ridgemont");
        expect(film.description).toBe("A Beautiful Yarn of a Pioneer And a Monkey who must Pursue a Explorer in The Sahara Desert");
        expect(film.releaseYear).toBe(2006);
        expect(film.actorNames).toStrictEqual(["Audrey Bailey","Nick Degeneres","Parker Goldberg"]);
        expect(film.language).toBe("English");
    });
});
