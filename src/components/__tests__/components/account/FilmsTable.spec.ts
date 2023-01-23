import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";

import { setActivePinia, createPinia } from 'pinia';
import FilmsTable from '@/components/account/FilmsTable.vue';
import FilmRemoveModal from '@/components/account/FilmRemoveModal.vue';
import router from "@/router";
import { useAppStore } from '@/stores/app';
import { filmsAccountStore } from '@/stores/films';
import { paginationAccountStore } from '@/stores/pagination';
import { accountPage } from '../../data/films';

describe("catalog/FilmsTable", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });
    
    it("Монтирование компоненты. Манипуляции с модальным окном удаления фильма", async () => {
        // Создаём компоненту
        const app = useAppStore();
        const filmsAccount = filmsAccountStore();
        const paginationAccount = paginationAccountStore();
        
        // Задаём список фильмов
        filmsAccount.films = accountPage.data.films;
        // В таблице фильмов используются эти данные
        paginationAccount.itemsNumberTotal = accountPage.data.pagination.itemsNumberTotal;
        paginationAccount.elementsNumberOnActivePage = accountPage.data.pagination.elementsNumberOnActivePage;
        
        const wrapper = mount(FilmsTable, {
            props: {
                requestAccount: vi.fn(),
                goToFirstPage: vi.fn()
            },
            global: {
                provide: { app, filmsAccount, paginationAccount },
                plugins: [router]
            }
        });
        
        // Проверяем заголовок к таблице фильмов
        expect(wrapper.get('h2').text()).toBe('Список доступных фильмов');
        const caption = wrapper.get('caption');
        expect(caption.isVisible()).toBe(true);
        expect(caption.text()).toBe('Показано 6 фильмов из 46');
        // В таблице 8 рядов: 2 - технических, 6 с фильмами
        const tr = wrapper.findAll('tr');
        expect(tr.length).toBe(8);
        // В строках с фильмами имеется ссылка на карточку фильма (берётся первая строка с фильмом)
        expect(tr[2].get('a').attributes('href')).toBe('/filmCard/965');
        
        // Модальное окно удаления фильма отсутствует
        expect(wrapper.findComponent(FilmRemoveModal).exists()).toBe(false);
        // Получаем ячейки для удаления фильма
        const removalFilms = wrapper.findAll('.removal-film')
        expect(removalFilms.length).toBe(6);
        // Кликаем по одной из ячеек
        await removalFilms[2].trigger('click');
        // Появляется модальное окно удаления фильма
        expect(wrapper.findComponent(FilmRemoveModal).exists()).toBe(true);
    });
});
