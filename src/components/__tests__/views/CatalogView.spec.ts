import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import type { Mock } from "vitest";

import { setActivePinia, createPinia } from 'pinia';
import CatalogView from "../../../views/CatalogView.vue";
import FilmsTable from '../../../components/catalog/FilmsTable.vue';
import BreadCrumb from '../../../components/BreadCrumb.vue';
import PaginationNav from '../../../components/PaginationNav.vue';
import Dropdown from '../../../components/Dropdown.vue';
import Spinner from '../../../components/Spinner.vue';
import router from "../../../router";
import { useAppStore } from '../../../stores/app';
import { filmsCatalogStore } from '../../../stores/films';
import { paginationCatalogStore } from '../../../stores/pagination';
import { firstPage } from './data/films';

import axios from 'axios';
vi.mock('axios');

describe("CatalogView", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });
    
    it("Монтирование компоненты", async () => {
        // Запрос при монтировании компоненты
        await (axios as any as Mock).mockResolvedValue(firstPage);
        await flushPromises();
        // Пока компонента не создана, запрос не отправляется
        expect(axios).toHaveBeenCalledTimes(0);
        
        // Создаём компоненту
        const app = useAppStore();
        const paginationCatalog = paginationCatalogStore();
        const filmsCatalog = filmsCatalogStore();
        const wrapper = mount(CatalogView, {
            global: {
                provide: { app, filmsCatalog, paginationCatalog },
                plugins: [router]
            }
        });
        
        // Заголовок и хлебные крошки всегда присутствую на странице
        const h1 = wrapper.get('h1');
        const breadCrumb = wrapper.getComponent(BreadCrumb);

        // Проверяем их наличие до загрузки фильмов
        expect(h1.text()).toBe("Каталог");
        expect(breadCrumb.isVisible()).toBe(true);
        // Имеется ссылка на главную страницу
        const breadCrumbLi = breadCrumb.findAll('li');
        expect(breadCrumbLi[0].text()).toBe("Главная страница");
        expect(breadCrumbLi[0].get('a[href="/"]').isVisible()).toBe(true);
        // Хлебные крошки указывают, что открыта страница "Каталог"
        expect(breadCrumbLi[1].text()).toBe("Каталог");
        expect(breadCrumbLi[1].find('a').exists()).toBe(false);
        
        
        // Крутится спиннер
        expect(wrapper.findComponent(Spinner).exists()).toBe(true);
        // Выбор числа фильмов отсутствует
        expect(wrapper.findComponent(Dropdown).exists()).toBe(false);
        // Таблица фильмов отсутствует
        expect(wrapper.findComponent(FilmsTable).exists()).toBe(false);
        // Пагинация отсутствует
        expect(wrapper.findComponent(PaginationNav).exists()).toBe(false);
        
        // Данные загрузились
        await flushPromises();
        // Запрос был отправлен 1 раз
        expect(axios).toHaveBeenCalledTimes(1);
        // Спиннер исчез
        expect(wrapper.findComponent(Spinner).exists()).toBe(false);
        
        // Появился выбор числа фильмов
        const dropdown = wrapper.findComponent(Dropdown)
        expect(dropdown.exists()).toBe(true);
        expect(dropdown.text()).toBe('Число фильмов на странице');
        
        // Появилась таблица фильмов
        const filmsTable = wrapper.findComponent(FilmsTable);
        expect(filmsTable.exists()).toBe(true);
        // Проверяем заголовок к таблице фильмов
        const caption = filmsTable.get('caption');
        expect(caption.isVisible()).toBe(true);
        expect(caption.text()).toBe('Показано 20 фильмов из 1000');
        
        // Появилась пагинация
        const pagination = wrapper.getComponent(PaginationNav)
        expect(pagination.isVisible()).toBe(true);
        const aPagination = pagination.findAll('a');
        // Проверяем кнопки пагинации
        // Ссылка на первую страницу заблокирована 
        expect(aPagination[0].text()).toBe('«');
        expect(aPagination[0].classes('disabled')).toBe(true);
        // Первая страница - активная страница
        expect(aPagination[1].text()).toBe('1');
        expect(aPagination[1].classes('active')).toBe(true);
        // 2 страница 
        expect(aPagination[2].text()).toBe('2');
        expect(aPagination[2].classes('active')).toBe(false);
        // 3 страница
        expect(aPagination[3].text()).toBe('3');
        expect(aPagination[3].classes('active')).toBe(false);
        // Ссылка на последнюю страницу не заблокирована 
        expect(aPagination[4].text()).toBe('»');
        expect(aPagination[4].classes('disabled')).toBe(false);
        // Других кнопок нет
        expect(aPagination.length).toBe(5);

        // Заголовок и хлебные крошки присутствуют
        expect(h1.text()).toBe("Каталог");
        expect(breadCrumb.isVisible()).toBe(true);
    });
});
