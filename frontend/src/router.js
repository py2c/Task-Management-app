import { createRouter, createWebHistory } from 'vue-router';

import Container from './components/Projects.vue';
import Detail from './components/Project.vue';

const routes = [
    {
        path: '/',
        component: Container
    },
    {
        path: '/details/:identifier',
        component: Detail
    }
];

export default createRouter({
    routes,
    history: createWebHistory()
});
