
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name:'loginDefault', component: () => import('pages/Login.vue') },
      { path: 'login', name:'login', component: () => import('pages/Login.vue') },
      { path: 'register', name:'register', component: () => import('pages/Register.vue') },
      { path: 'main', name:'main', component: () => import('pages/MainPage.vue') },
      { path: 'addUser', name:'addUser', component: () => import('components/AddPerformerUser.vue') },
      { path: 'addUser2', name:'addUser2', component: () => import('components/AddResponsibleUser.vue') },
      { path: 'addModule', name:'addModule', component: () => import('components/AddModule.vue') },
      { path: 'modules', name:'modules', component: () => import('components/ModulesTable.vue') },
      { path: 'teamPage', name: 'teamPage', component: () => import('components/TeamPage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
