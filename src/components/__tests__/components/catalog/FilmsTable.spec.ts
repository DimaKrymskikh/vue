import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import type { Mock } from "vitest";

import { setActivePinia, createPinia } from 'pinia';
import FilmsTable from '@/components/catalog/FilmsTable.vue';
import { useAppStore } from '@/stores/app';
import { filmsCatalogStore } from '@/stores/films';
import { paginationCatalogStore } from '@/stores/pagination';
import { firstPage } from '../../views/data/films';

import axios, { AxiosError } from 'axios';
//import AxiosError from 'axios-error';
vi.mock('axios');

describe("catalog/FilmsTable", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });
    afterEach(async () => {
        await (axios as any as Mock).mockClear();
    });
    
    it("Монтирование компоненты: app.isGuest = true", () => {
        // Создаём компоненту
        const app = useAppStore();
        const filmsCatalog = filmsCatalogStore();
        const paginationCatalog = paginationCatalogStore();
        
        // Задаём список фильмов
        filmsCatalog.films = firstPage.data.films;
        // В таблице фильмов используются эти данные
        paginationCatalog.itemsNumberTotal = firstPage.data.pagination.itemsNumberTotal;
        paginationCatalog.elementsNumberOnActivePage = firstPage.data.pagination.elementsNumberOnActivePage;
        
        const wrapper = mount(FilmsTable, {
            props: {
                requestCatalog: vi.fn(),
                goToFirstPage: vi.fn()
            },
            global: {
                provide: { app, filmsCatalog, paginationCatalog },
            }
        });
        
        // Проверяем заголовок к таблице фильмов
        const caption = wrapper.get('caption');
        expect(caption.isVisible()).toBe(true);
        expect(caption.text()).toBe('Показано 20 фильмов из 1000');
        
        // Колонка с картинками отсутствует
        const img = wrapper.findAll('img');
        expect(img.length).toBe(0);
    });
    
    it("Монтирование компоненты: app.isGuest = false", () => {
        // Создаём компоненту
        const app = useAppStore();
        app.isGuest = false;
        const filmsCatalog = filmsCatalogStore();
        const paginationCatalog = paginationCatalogStore();
        
        // Задаём список фильмов
        filmsCatalog.films = firstPage.data.films;
        // В таблице фильмов используются эти данные
        paginationCatalog.itemsNumberTotal = firstPage.data.pagination.itemsNumberTotal;
        paginationCatalog.elementsNumberOnActivePage = firstPage.data.pagination.elementsNumberOnActivePage;
        
        const wrapper = mount(FilmsTable, {
            props: {
                requestCatalog: vi.fn(),
                goToFirstPage: vi.fn()
            },
            global: {
                provide: { app, filmsCatalog, paginationCatalog },
            }
        });
        
        // Проверяем заголовок к таблице фильмов
        const caption = wrapper.get('caption');
        expect(caption.isVisible()).toBe(true);
        expect(caption.text()).toBe('Показано 20 фильмов из 1000');
        
        // Колонка с картинками присутствует
        const img = wrapper.findAll('img');
        expect(img.length).not.toBe(0);
    });
    
    it("Добавление фильма", async () => {
        // Создаём компоненту
        const app = useAppStore();
        app.isGuest = false;
        const filmsCatalog = filmsCatalogStore();
        const paginationCatalog = paginationCatalogStore();
        
        // Задаём список фильмов
        filmsCatalog.films = firstPage.data.films;
        // В таблице фильмов используются эти данные
        paginationCatalog.itemsNumberTotal = firstPage.data.pagination.itemsNumberTotal;
        paginationCatalog.elementsNumberOnActivePage = firstPage.data.pagination.elementsNumberOnActivePage;
        
        // Формируем ошибку
        const axiosError = new AxiosError();
        axiosError.request = {
                    response: '{"message": "Время токена истекло"}',
                    status: 401
                };
        
        // Задаём mock-функции
        const appRequst = vi.spyOn(app, 'request');
        await (axios as any as Mock)
            .mockResolvedValueOnce(true)
            .mockRejectedValueOnce(axiosError);
        
        const wrapper = mount(FilmsTable, {
            props: {
                requestCatalog: vi.fn(),
                goToFirstPage: vi.fn()
            },
            global: {
                provide: { app, filmsCatalog, paginationCatalog },
            }
        });
        
        /**
        * firstPage соответствует случаю: пользователю принадлежит 1 фильм
        */
        
        // На странице имеется 19 "plus-circle" (скрыты 19 "check-circle")
        const imgPlusCircle = wrapper.findAll('img[alt="plus-circle"]');
        expect(imgPlusCircle.length).toBe(19);
        const imgCheckCircle = wrapper.findAll('img[alt="check-circle"]');
        const imgCheckCircleHidden = imgCheckCircle.filter((item) => item.classes('hidden'));
        expect(imgCheckCircleHidden.length).toBe(19);
        // На странице имеется 1 "check-circle"
        const imgCheckCircleNotHidden = imgCheckCircle.filter((item) => !item.classes('hidden'));
        expect(imgCheckCircleNotHidden.length).toBe(1);
        
        /**
        * Корректный запрос
        */
        // Берём любой элемент imgPlusCircle для добавления фильма
        // Пусть это будет imgPlusCircle[5]
        // Данный элемент виден
        expect(imgPlusCircle[5].classes('hidden')).toBe(false);
        // Находим его ячейку
        const td5 = imgPlusCircle[5].element.closest('td');
        // В ячейке таже есть скрытые check-circle и спиннер
        const checkCircle5 = td5?.querySelector('.check-circle');
        const spinner5 = td5?.querySelector('.spinner');
        expect(checkCircle5?.classList.contains('hidden')).toBe(true);
        expect(spinner5?.classList.contains('hidden')).toBe(true);

        // Кликаем по imgPlusCircle[5]
        await imgPlusCircle[5].trigger('click');
        // Данный элемент скрывается
        expect(imgPlusCircle[5].classes('hidden')).toBe(true);
        // Появляется спиннер
        expect(spinner5?.classList.contains('hidden')).toBe(false);
        // Выбранный imgPlusCircle соответствует фильму с id = 7
        expect(imgPlusCircle[5].attributes('data-film-id')).toBe('7');
        // Запрос отправляется 1 с правильными данными
        expect(appRequst).toHaveBeenCalledTimes(1);
        expect(appRequst).toHaveBeenLastCalledWith('userFilm/7', 'POST', {}, {}, false);
        // Завершаем промисы
        await flushPromises();
        expect(axios).toHaveBeenCalledTimes(1);
        expect(spinner5?.classList.contains('hidden')).toBe(true);
        expect(checkCircle5?.classList.contains('hidden')).toBe(false);
      
        /**
        * Запрос с ошибкой
        */
        // В app ошибка отсутствует
        expect(app.isForbidden).toBe(false);
        expect(app.errorMessage).toBe('');
        // Берём ещё один элемент imgPlusCircle[7]
        // Данный элемент виден
        expect(imgPlusCircle[7].classes('hidden')).toBe(false);
        // Находим его ячейку
        const td7 = imgPlusCircle[7].element.closest('td');
        // В ячейке таже есть скрытые check-circle и спиннер
        const checkCircle7 = td7?.querySelector('.check-circle');
        const spinner7 = td7?.querySelector('.spinner');
        expect(checkCircle7?.classList.contains('hidden')).toBe(true);
        expect(spinner7?.classList.contains('hidden')).toBe(true);

        // Кликаем imgPlusCircle[7]
        await imgPlusCircle[7].trigger('click');
        // Данный элемент скрывается
        expect(imgPlusCircle[7].classes('hidden')).toBe(true);
        // Появляется спиннер
        expect(spinner7?.classList.contains('hidden')).toBe(false);
        // Выбранный imgPlusCircle соответствует фильму с id = 9
        expect(imgPlusCircle[7].attributes('data-film-id')).toBe('9');
        // Запрос отправляется 2-й раз с правильными данными
        expect(appRequst).toHaveBeenCalledTimes(2);
        expect(appRequst).toHaveBeenLastCalledWith('userFilm/9', 'POST', {}, {}, false);
        // Завершаем промисы
        await flushPromises();
        expect(axios).toHaveBeenCalledTimes(2);
        expect(spinner7?.classList.contains('hidden')).toBe(true);
        expect(checkCircle7?.classList.contains('hidden')).toBe(false);
        // Ошибка зафиксирована в app
        expect(app.isForbidden).toBe(true);
        expect(app.errorMessage).toBe('Статус[401]: Время токена истекло');
    });
});
