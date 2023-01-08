import { describe, it, expect, vi } from "vitest";
import { RouterLink, RouterView, createRouter, createWebHistory, useRoute } from "vue-router";
import { mount, flushPromises } from "@vue/test-utils";


describe("router", () => {
    
    const App = {
        template: `
            <RouterLink to="/"></RouterLink>
            <RouterLink to="/catalog/4"></RouterLink>
            <RouterLink to="/account/11"></RouterLink>
            <RouterLink to="/login"></RouterLink>
            <RouterLink to="/logout"></RouterLink>
            <RouterLink to="/register"></RouterLink>
            <RouterLink to="/filmCard/45"></RouterLink>
            <RouterView />
        `
    };
    
    const Home = {
        template: "<h1>Home</h1>"
    };
    
    const Catalog = {
        setup() {
            const route = useRoute();
            return { route };
        },
        template: "<h1>Catalog {{route.params.pageId}}</h1>",
    };
    
    const Account = {
        setup() {
            const route = useRoute();
            return { route };
        },
        template: "<h1>Account {{route.params.pageId}}</h1>",
    };
    
    const Login = {
        template: "<h1>Login</h1>"
    };
    
    const Logout = {
        template: "<h1>Logout</h1>"
    };
    
    const Register = {
        template: "<h1>Register</h1>"
    };
    
    const FilmCard = {
        setup() {
            const route = useRoute();
            return { route };
        },
        template: "<h1>FilmCard {{route.params.filmId}}</h1>",
    };
    
    const router = createRouter({
        history: createWebHistory(import.meta.env.BASE_URL),
        routes: [
            {
                path: "/",
                name: "home",
                component: Home
            },
            {
                path: "/catalog/:pageId",
                name: "catalog",
                component: Catalog
            },
            {
                path: "/account/:pageId",
                name: "account",
                component: Account
            },
            {
                path: "/login",
                name: "login",
                component: Login
            },
            {
                path: "/logout",
                name: "logout",
                component: Logout
            },
            {
                path: "/register",
                name: "register",
                component: Register
            },
            {
                path: "/filmCard/:filmId",
                name: "filmCard",
                component: FilmCard
            },
        ],
    });
    
    const wrapper = mount(App, {
        global: {
            plugins: [router]
        }
    });

    it("Используем router.push", async () => {
        router.push('/');
        await flushPromises();
        expect(wrapper.html()).toContain('Home');
        
        router.push('/catalog/5');
        await flushPromises();
        expect(wrapper.text()).toContain('Catalog 5');
        router.push('/catalog/7');
        await flushPromises();
        expect(wrapper.text()).toContain('Catalog 7');
        
        router.push('/Account/1');
        await flushPromises();
        expect(wrapper.text()).toContain('Account 1');
        
        router.push('/login');
        await flushPromises();
        expect(wrapper.html()).toContain('Login');
        
        router.push('/logout');
        await flushPromises();
        expect(wrapper.html()).toContain('Logout');
        
        router.push('/register');
        await flushPromises();
        expect(wrapper.html()).toContain('Register');
        
        router.push('/filmCard/3147');
        await flushPromises();
        expect(wrapper.text()).toContain('FilmCard 3147');
    });
    
    it("Клик по ссылке", async () => {
        await wrapper.find('a[href="/"]').trigger('click');
        await flushPromises();
        expect(wrapper.html()).toContain('Home');
        
        await wrapper.find('a[href="/catalog/4"]').trigger('click');
        await flushPromises();
        expect(wrapper.html()).toContain('Catalog 4');
        
        await wrapper.find('a[href="/account/11"]').trigger('click');
        await flushPromises();
        expect(wrapper.html()).toContain('Account 11');
        
        await wrapper.find('a[href="/login"]').trigger('click');
        await flushPromises();
        expect(wrapper.html()).toContain('Login');
        
        await wrapper.find('a[href="/logout"]').trigger('click');
        await flushPromises();
        expect(wrapper.html()).toContain('Logout');
        
        await wrapper.find('a[href="/register"]').trigger('click');
        await flushPromises();
        expect(wrapper.html()).toContain('Register');
        
        await wrapper.find('a[href="/filmCard/45"]').trigger('click');
        await flushPromises();
        expect(wrapper.html()).toContain('FilmCard 45');
    });
});
