import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/userHome",
  },
  {
    path: "/userHome",
    name: "UserHome",
    component: () => import("../views/UserHome.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
