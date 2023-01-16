import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";

import { setActivePinia, createPinia } from 'pinia';
import { filmsCatalogStore, filmsAccountStore } from "../../../stores/films";

const catalogData = [{
    id: 38,
    n: 1,
    count: 4,
    title: "Ark Ridgemont",
    description: "A Beautiful Yarn of a Pioneer And a Monkey who must Pursue a Explorer in The Sahara Desert",
    name: "English",
    isAvailable: true
},{
    id: 529,
    n: 2,
    count: 4,
    title: "Lonely Elephant",
    description: "A Intrepid Story of a Student And a Dog who must Challenge a Explorer in Soviet Georgia",
    name: "English",
    isAvailable: false
},{
    id: 758,
    n: 3,
    count: 4,
    title: "Saints Bride",
    description: "A Fateful Tale of a Technical Writer And a Composer who must Pursue a Explorer in The Gulf of Mexico",
    name: "English",
    isAvailable: false
},{
    id: 830,
    n: 4,
    count: 4,
    title: "Spirit Flintstones",
    description: "A Brilliant Yarn of a Cat And a Car who must Confront a Explorer in Ancient Japan",
    name: "English",
    isAvailable: false
}];

const accountData = [{
    id: 943,
    n: 1,
    count: 2,
    title: "Villain Desperate",
    description: "A Boring Yarn of a Pioneer And a Feminist who must Redeem a Cat in An Abandoned Amusement Park",
    name: "English",
    isAvailable: true
},{
    id:984,
    n:2,
    count: 2,
    title: "Wonderful Drop",
    description: "A Boring Panorama of a Woman And a Madman who must Overcome a Butler in A U-Boat",
    name: "English",
    isAvailable: true
}];

describe("Хранилище film", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });
    
    it("Применение setData", () => {
        const filmsCatalog = filmsCatalogStore();
        const filmsAccount = filmsAccountStore();
        // Дефолтные значения
        expect(filmsCatalog.films).toStrictEqual([]);
        expect(filmsAccount.films).toStrictEqual([]);
        // Изменяем filmsCatalog
        filmsCatalog.setData(catalogData);
        // Изменяем filmsAccount
        filmsAccount.setData(accountData);
        // Получаем разные хранилища
        // filmsCatalog
        expect(filmsCatalog.films.length).toBe(4);
        expect(filmsCatalog.films[0].id).toBe(38);
        expect(filmsCatalog.films[1].id).toBe(529);
        expect(filmsCatalog.films[2].description).toBe("A Fateful Tale of a Technical Writer And a Composer who must Pursue a Explorer in The Gulf of Mexico");
        expect(filmsCatalog.films[3].isAvailable).toBe(false);
        // filmsAccount
        expect(filmsAccount.films.length).toBe(2);
        expect(filmsAccount.films[0].id).toBe(943);
        expect(filmsAccount.films[1].title).toBe("Wonderful Drop");
    });
    
    it("Применение setSortFilmTitle и setSortFilmDescription", () => {
        const filmsCatalog = filmsCatalogStore();
        const filmsAccount = filmsAccountStore();
        // Дефолтные значения
        expect(filmsCatalog.sortFilmTitle).toBe('');
        expect(filmsCatalog.sortFilmDescription).toBe('');
        expect(filmsAccount.sortFilmTitle).toBe('');
        expect(filmsAccount.sortFilmDescription).toBe('');
        // Изменяем filmsCatalog
        filmsCatalog.setSortFilmTitle('123');
        filmsCatalog.setSortFilmDescription('abc');
        // Изменяем filmsAccount
        filmsAccount.setSortFilmTitle('$');
        filmsAccount.setSortFilmDescription('Яя');
        // Получаем разные хранилища
        // filmsCatalog
        expect(filmsCatalog.sortFilmTitle).toBe('123');
        expect(filmsCatalog.sortFilmDescription).toBe('abc');
        // filmsAccount
        expect(filmsAccount.sortFilmTitle).toBe('$');
        expect(filmsAccount.sortFilmDescription).toBe('Яя');
    });
});
