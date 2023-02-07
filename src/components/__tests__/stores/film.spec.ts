import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";

import { setActivePinia, createPinia } from 'pinia';
import { filmCardStore } from "../../../stores/film";
import { filmCard20 } from '../data/films';
import type { Film } from '../../../stores/film';

describe("Хранилище film", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });
    
    it("Применение setData", () => {
        const film = filmCardStore();
        // Дефолтные значения
        expect(film.filmId).toBe(0);
        expect(film.title).toBe('');
        expect(film.description).toBe('');
        expect(film.releaseYear).toBe(0);
        expect(film.actorNames).toStrictEqual([]);
        expect(film.language).toBe('');
        // Изменяем свойства
        film.setData({
            filmId: filmCard20.data.film.filmId,
            title: filmCard20.data.film.title,
            description: filmCard20.data.film.description,
            releaseYear: filmCard20.data.film.releaseYear,
            actorNames: filmCard20.data.film.actorNames,
            language: filmCard20.data.film.language
        } as Film);
        // Свойства изменились
        expect(film.filmId).toBe(filmCard20.data.film.filmId);
        expect(film.title).toBe(filmCard20.data.film.title);
        expect(film.description).toBe(filmCard20.data.film.description);
        expect(film.releaseYear).toBe(filmCard20.data.film.releaseYear);
        expect(film.actorNames).toStrictEqual(filmCard20.data.film.actorNames);
        expect(film.language).toBe(filmCard20.data.film.language);
    });
});
