import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    children: [
      {
        path: "/recommend",
        name: "Recommend",
        alias:'/',
        component: () => import("../views/Recommend.vue"),
      },
      {
        path: "/ranking",
        name: "Ranking",
        component: () => import("../views/Ranking.vue"),
      },
      {
        path: "/singer",
        name: "Singer",
        component: () => import("../views/Singer.vue"),
      },
      {
        path: "/mv",
        name: "Mv",
        component: () => import("../views/Mv.vue"),
      }
    ],
  },
  {
    path:'/navigation',
    name:'Navigation',
    component:() => import('../views/Navigation.vue'),
    
  },
  {
    path:'/singerdetail',
    name:'SingerDetail',
    component:() => import('../views/SingerDetail.vue')
  },
  {
    path:'/mvdetail',
    name:'Mvdetail',
    component:() => import('../views/Mvdetail.vue')
  },
  {
    path:'/search',
    name:'Search',
    component:() => import('../views/Search.vue')
  },
  {
    path:'/login',
    name:'Login',
    component:() => import('../views/Login.vue')
  },
  {
    path:'/register',
    name:'Register',
    component:() => import('../views/Register.vue')
  }
];

const router = new VueRouter({
  routes,
});

export default router;
