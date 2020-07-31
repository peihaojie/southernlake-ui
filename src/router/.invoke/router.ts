import Vue from 'vue';
import Router, {
  RouteConfig
} from 'vue-router';;
Vue.use(Router);
export const routes: RouteConfig[] = [{
    component: () => import('@/pages/homePage/Index.vue'),
    name: 'homePage',
    path: '/homePage',
  },
  {
    component: () => import('@/pages/menu/menu.vue'),
    name: 'menu',
    path: '/menu',
    children: [{
        component: () => import('@/pages/menu/surroundings/Index.vue'),
        name: 'menu-surroundings',
        path: 'surroundings',
      },
      {
        component: () => import('@/pages/menu/towerCrane/Index.vue'),
        name: 'menu-towerCrane',
        path: 'towerCrane',
      },
      {
        component: () => import('@/pages/menu/towerLift/Index.vue'),
        name: 'menu-towerLift',
        path: 'towerLift',
      },
      {
        component: () => import('@/pages/menu/videoPage/Index.vue'),
        name: 'menu-videoPage',
        path: 'videoPage',
      },
    ],
  },
  {
    path: '/',
    redirect: '/menu'
  },
];
const router = new Router({
  mode: 'hash',
  routes,
});
export default router;