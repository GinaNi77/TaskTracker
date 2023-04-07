
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'loginDefault', component: () => import('pages/Login.vue') },
      { path: 'login', name: 'login', component: () => import('pages/Login.vue') },
      { path: 'register', name: 'register', component: () => import('pages/Register.vue') },

      { path: 'addModule', name: 'addModule', component: () => import('components/AddModule.vue') }, //!
      { path: 'addTask', name: 'addTask', component: () => import('components/AddTask.vue') },//!

      {
        path: 'main',
        component: () => import('components/TeamPage.vue'),
        props: true
      },
      {
        path: 'tasks',
        component: () => import('components/TasksTable.vue')
      },
      {
        path: 'modules',
        component: () => import('components/ModulesTable.vue')
      },
      {
        path: 'teams',
        component: () => import('components/TeamPage.vue')
      },
      {
        path: 'teams/3969277701932267641',
        component: () => import('components/AddPerformerUser.vue')
      },
      {
        path: 'teams/9163702586231323932',
        component: () => import('components/AddResponsibleUser.vue')
      },


    ]
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
