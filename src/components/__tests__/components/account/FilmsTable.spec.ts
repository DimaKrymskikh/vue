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

describe("account/FilmsTable", () => {
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
    
    it("Фильтрация фильмов", async () => {
        // Определяем provide
        const app = useAppStore();
        const filmsAccount = filmsAccountStore();
        const paginationAccount = paginationAccountStore;
        
        // Задаём mock-функции
        const goToFirstPage = vi.fn();
        
        const wrapper = mount(FilmsTable, {
            props: {
                requestAccount: vi.fn(),
                goToFirstPage
            },
            global: {
                provide: { app, filmsAccount, paginationAccount },
            }
        });
        
        // Находим поля фильтрации
        const inputs = wrapper.findAll('input[type="text"]');
        expect(inputs.length).toBe(2);
        const inputTitle = inputs[0].element as HTMLInputElement;
        const inputDescription = inputs[1].element as HTMLInputElement;
        // В начальный момент поля не заполнены
        expect(inputTitle.value).toBe('');
        expect(inputDescription.value).toBe('');
        expect(filmsAccount.sortFilmTitle).toBe('');
        expect(filmsAccount.sortFilmDescription).toBe('');
        
        // Нажимается клавиша 'a' в поле title
        await inputs[0].trigger('keyup', { key: 'a' })
        // Запрос не отправлен
        expect(goToFirstPage).toHaveBeenCalledTimes(0);
        // Нажимается клавиша 'Enter'
        await inputs[0].trigger('keyup', { key: 'Enter' })
        // Запрос отправлен
        expect(goToFirstPage).toHaveBeenCalledTimes(1);
        // Сбрасываем счётчик числа отправок goToFirstPage
        goToFirstPage.mockClear();
        // Нажимается клавиша 'g' в поле description
        await inputs[1].trigger('keyup', { key: 'g' })
        // Запрос не отправлен
        expect(goToFirstPage).toHaveBeenCalledTimes(0);
        // Нажимается клавиша 'Enter'
        await inputs[1].trigger('keyup', { key: 'Enter' })
        // Запрос отправлен
        expect(goToFirstPage).toHaveBeenCalledTimes(1);
        // Сбрасываем счётчик числа отправок goToFirstPage
        goToFirstPage.mockClear();
        
        // Заполняем поле title
        await inputs[0].setValue('abc');
        expect(inputTitle.value).toBe('abc');
        expect(inputDescription.value).toBe('');
        expect(filmsAccount.sortFilmTitle).toBe('abc');
        expect(filmsAccount.sortFilmDescription).toBe('');
        
        // Нажимается клавиша 's' в поле title
        await inputs[0].trigger('keyup', { key: 's' })
        // Запрос не отправлен
        expect(goToFirstPage).toHaveBeenCalledTimes(0);
        // Нажимается клавиша 'Enter'
        await inputs[0].trigger('keyup', { key: 'Enter' })
        expect(goToFirstPage).toHaveBeenCalledTimes(1);
        // Сбрасываем счётчик числа отправок goToFirstPage
        goToFirstPage.mockClear();
        
        // Заполняем поле description
        await inputs[0].setValue('');
        await inputs[1].setValue('fghj');
        expect(inputTitle.value).toBe('');
        expect(inputDescription.value).toBe('fghj');
        expect(filmsAccount.sortFilmTitle).toBe('');
        expect(filmsAccount.sortFilmDescription).toBe('fghj');
        
        // Нажимается клавиша 'F' в поле description
        await inputs[1].trigger('keyup', { key: 'F' })
        // Запрос не отправлен
        expect(goToFirstPage).toHaveBeenCalledTimes(0);
        // Нажимается клавиша 'Enter'
        await inputs[1].trigger('keyup', { key: 'Enter' });
        // Запрос отправлен
        expect(goToFirstPage).toHaveBeenCalledTimes(1);
        // Сбрасываем счётчик числа отправок goToFirstPage
        goToFirstPage.mockClear();
        
        // Заполняются оба поля
        await inputs[0].setValue('Qh');
        await inputs[1].setValue('Я ф');
        expect(inputTitle.value).toBe('Qh');
        expect(inputDescription.value).toBe('Я ф');
        expect(filmsAccount.sortFilmTitle).toBe('Qh');
        expect(filmsAccount.sortFilmDescription).toBe('Я ф');
        
        // Нажимается клавиша 'Ы' в поле title
        await inputs[0].trigger('keyup', { key: 'Ы' })
        // Запрос не отправлен
        expect(goToFirstPage).toHaveBeenCalledTimes(0);
        // Нажимается клавиша 'Enter'
        await inputs[0].trigger('keyup', { key: 'Enter' })
        // Запрос отправлен
        expect(goToFirstPage).toHaveBeenCalledTimes(1);
        // Сбрасываем счётчик числа отправок goToFirstPage
        goToFirstPage.mockClear();
        // Нажимается клавиша 'м' в поле description
        await inputs[1].trigger('keyup', { key: 'м' })
        // Запрос не отправлен
        expect(goToFirstPage).toHaveBeenCalledTimes(0);
        // Нажимается клавиша 'Enter'
        await inputs[1].trigger('keyup', { key: 'Enter' })
        // Запрос отправлен
        expect(goToFirstPage).toHaveBeenCalledTimes(1);
    });
});
