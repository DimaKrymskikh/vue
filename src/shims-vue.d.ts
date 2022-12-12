/**
* Позволяет в файлах *.ts убрать ошибки TS при импорте файлов *.vue
* Например, 
* import HomeView from "../views/HomeView.vue"
* и.д.
* в файле ./router/index.ts
*/
declare module "*.vue" {
    import Vue from 'vue';
    export default Vue;
}
