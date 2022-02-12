import { createRouter, createWebHistory } from 'vue-router';

export const router = createRouter({
  history: createWebHistory('/05-vue-router/03-ScrollBehavior'),

  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('../views/PageMeetups'),
    },
    {
      path: '/meetups',
      name: 'meetups',
      redirect: { name: 'index' },
    },
    {
      path: '/meetups/:meetupId(\\d+)',
      name: 'meetup',
      meta: {
        showReturnToMeetups: true,
        saveScrollPosition: true,
      },
      props: true,
      redirect: (to) => ({ name: 'meetup.description', params: to.params }),
      component: () => import('../views/PageMeetup'),
      children: [
        {
          path: '',
          alias: 'description',
          name: 'meetup.description',
          props: true,
          component: () => import('../views/PageMeetupDescription'),
        },
        {
          path: 'agenda',
          name: 'meetup.agenda',
          props: true,
          component: () => import('../views/PageMeetupAgenda'),
        },
      ],
    },
  ],

  scrollBehavior: (to, from, savedPosition) => {
    if (to.hash) {
      return { el: to.hash };
    }

    if (savedPosition && to.name === 'index') {
      return new Promise((resolve) => {
        // Для PageMeetups.vue с его отложенным созданием DOM элементов на mount использую setTimeout (только для учебы).
        // Без Promise savedPosition будет обработан синхронно через **window.scrollTo** и прокрутки не будет
        // потому что PageMeetups.vue еще не создал свои DOM элементы и даже не получил свои данные:
        // mounted() {
        //   fetchMeetups().then((meetups) => {
        //     this.meetups = meetups;
        //   });
        // },
        // В реальном приложении вместо setTimeout нужно переносить загрузку данных на beforeRouterEnter,
        // (
        // beforeRouteEnter in PageMeetup.vue
        // https://stackoverflow.com/questions/69148784/stop-vue-page-from-loading-till-data-fetch-is-loaded
        // )
        // или передавать savedPosition в компонент что бы он сам выполнил scroll когда он достроит свой DOM,
        // или использовать store/keep-alive для загрузки данных и рендера полного DOM до вызова этого метода

        // Для остальных страниц пока что можно сразу возвращать savedPosition
        setTimeout(
          () => resolve(savedPosition),
          200 /* time to handle "fetch(`${API_URL}/meetups`).then((res) => res.json());" call*/,
        );
      });
    }

    if (to.meta.saveScrollPosition && from.meta.saveScrollPosition) {
      return false;
    }

    return savedPosition || { left: 0, top: 0 };
  },
});
