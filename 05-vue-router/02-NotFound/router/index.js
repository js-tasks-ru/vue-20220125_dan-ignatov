import { createRouter, createWebHistory } from 'vue-router';

import PageNotFound from '../views/PageNotFound.vue';

export const router = createRouter({
  history: createWebHistory('/05-vue-router/02-NotFound'),
  routes: [
    {
      path: '/page-a',
      alias: '/',
      component: () => import('../views/PageA'),
    },
    {
      path: '/page-b',
      component: () => import('../views/PageB'),
    },
    {
      // https://router.vuejs.org/guide/migration/#removed-star-or-catch-all-routes
      path: '/:pathMatch(.*)*',
      component: PageNotFound,
    },
  ],
});
