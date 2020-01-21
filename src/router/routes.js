const routes = [
  {
    path: '/',
    component: () => import('layouts/HeaderLDrawer.vue'),
    children: [
      { path: '', component: () => import('pages/Home.vue') },
      {
        path: 'fav',
        component: () => import('pages/Fav.vue'),
        meta: { auth: true }
      },
      {
        path: 'me',
        component: () => import('pages/Me.vue'),
        meta: { auth: true }
      },
      {
        path: 'info',
        component: () => import('pages/Info.vue'),
        meta: { auth: true }
      },
      {
        path: 'update',
        component: () => import('pages/Update.vue'),
        meta: { auth: true }
      },
      {
        path: 'member',
        component: () => import('pages/Member.vue'),
        meta: { auth: true }
      },
      {
        path: 'latest',
        component: () => import('pages/Latest.vue'),
        meta: { auth: true }
      },
      {
        path: 'search',
        component: () => import('pages/Search.vue')
      }
    ]
  },
  {
    path: '/auth',
    component: () => import('layouts/HeaderOnly.vue'),
    children: [
      { path: 'login', component: () => import('pages/Login.vue') },
      { path: 're', component: () => import('pages/Re.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
