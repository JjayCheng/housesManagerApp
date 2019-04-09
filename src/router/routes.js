const index = () => import('../pages/index/index.vue');
const addform = () => import('../pages/addform/addform.vue');
const compatibleHouse = () => import('../pages/compatibleHouse/compatibleHouse.vue');
const detailsHouse = () => import('../pages/detailsHouse/detailsHouse.vue');
const search = () => import('../pages/search/search.vue');

export default [
  {
    path: '/',
    redirect: '/index'
  },{
    path: '/addform',
    component: addform
  },{
    path: '/compatibleHouse/:wd',
    name: 'compatibleHouse',
    meta: {
      keepAlive: true
    },
    component: compatibleHouse
  },{
    path: '/detailsHouse/:id',
    component: detailsHouse,
    name: 'detailsHouse',
  },{
    path: '/search',
    component: search
  },{
    path: '/index',
    name: 'index',
    meta: {
      keepAlive: true
    },
    component: index
  }
]