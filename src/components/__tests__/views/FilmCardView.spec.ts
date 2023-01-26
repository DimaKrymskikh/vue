import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import type { Mock } from "vitest";

import { setActivePinia, createPinia } from 'pinia';
import FilmCardView from "@/views/FilmCardView.vue";
import BreadCrumb from '@/components/BreadCrumb.vue';
import Spinner from '@/components/Spinner.vue';
import router from "@/router";
import { useAppStore } from '@/stores/app';
import { paginationAccountStore } from '@/stores/pagination';
import { filmCardStore } from '@/stores/film';
import { filmCard20 } from '../data/films';

import axios from 'axios';
vi.mock('axios');

describe("FilmCardView", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });
    afterEach(async () => {
        await (axios as any as Mock).mockClear();
    });
    
    it("Монтирование компоненты", async () => {
        // Активная страница списка фильмов в ЛК пользователя
        const activePageAccount = 3;
        // Выбранный фильм
        const filmId = 20;
        
        // Определяем provide
        const app = useAppStore();
        const paginationAccount = paginationAccountStore();
        // Переход был сделан с данной активной страницы ЛК
        paginationAccount.activePage = activePageAccount;
        const filmCard = filmCardStore();
        
        // Задаём mock-функции
        const appRequst = vi.spyOn(app, 'request');
        await (axios as any as Mock).mockResolvedValueOnce(filmCard20);
        
        // Задаём переход на карточку фильма с заданным filmId
        router.push(`/filmCard/${filmId}`);
        await router.isReady();
        // Задаём route для теста
        const route = {
            params: { filmId }
        }

        // Создаём компоненту
        const wrapper = mount(FilmCardView, {
            global: {
                provide: { app, paginationAccount, filmCard },
                plugins: [router],
            }
        });

        // Хлебные крошки всегда присутствую на странице
        const breadCrumb = wrapper.getComponent(BreadCrumb);
        expect(breadCrumb.isVisible()).toBe(true);
        // Имеется ссылка на главную страницу
        const breadCrumbLi = breadCrumb.findAll('li');
        expect(breadCrumbLi[0].text()).toBe("Главная страница");
        expect(breadCrumbLi[0].get('a[href="/"]').isVisible()).toBe(true);
        // Имеется ссылка на ЛК пользователя
        expect(breadCrumbLi[1].text()).toBe("Личный кабинет");
        expect(breadCrumbLi[1].get('a[href="/account/3"]').isVisible()).toBe(true);
        // Хлебные крошки указывают, что открыта страница "Карточка фильма"
        expect(breadCrumbLi[2].text()).toBe("Карточка фильма");
        expect(breadCrumbLi[2].find('a').exists()).toBe(false);
        
        // Крутится спиннер
        expect(wrapper.findComponent(Spinner).exists()).toBe(true);
        // app.request вызывается с правильными параметрами
        expect(appRequst).toHaveBeenCalledTimes(1);
        expect(appRequst).toHaveBeenLastCalledWith(`account/filmCard/${route.params.filmId}`, 'POST', {}, {film: filmCard});
        
        // Получаем ответ сервера
        await flushPromises();
        expect(axios).toHaveBeenCalledTimes(1);
        // Спиннер отсутствует
        expect(wrapper.findComponent(Spinner).exists()).toBe(false);
        // filmCard получил нужные данные
        expect(filmCard.filmId).toBe(20);
        expect(filmCard.title).toBe('Amelie Hellfighters');
        expect(filmCard.description).toBe('A Boring Drama of a Woman And a Squirrel who must Conquer a Student in A Baloon');
        expect(filmCard.releaseYear).toBe(2006);
        expect(filmCard.actorNames).toStrictEqual(["Carmen Hunt","Ed Mansfield","Ewan Gooding","Ian Tandy","Laura Brody","Walter Torn"]);
        expect(filmCard.language).toBe('English');
        // Эти данные отображены на странице
        expect(wrapper.get('h1').text()).toBe('Amelie Hellfighters');
        const h3 = wrapper.findAll('h3');
        expect(h3[0].text()).toBe('Основная информация');
        expect(h3[1].text()).toBe('Описание');
        expect(h3[2].text()).toBe('Актёры');
        expect(wrapper.text()).toContain('A Boring Drama of a Woman And a Squirrel who must Conquer a Student in A Baloon');
        expect(wrapper.text()).toContain(2006);
        expect(wrapper.text()).toContain('Carmen Hunt');
        expect(wrapper.text()).toContain('Ed Mansfield');
        expect(wrapper.text()).toContain('Ewan Gooding');
        expect(wrapper.text()).toContain('Ian Tandy');
        expect(wrapper.text()).toContain('Laura Brody');
        expect(wrapper.text()).toContain('Walter Torn');
        expect(wrapper.text()).toContain('English');
    });
});
