import Vue from "vue";
import VueRouter from "vue-router";
import UserHome from "../components/UserHome.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/userHome",
  },
  {
    path: "/userHome",
    name: "UserHome",
    component: UserHome,
    redirect: "/UserInfor",
    children: [
      {
        path: "/UserInfor",
        name: "UserInfor",
        component: () => import("../views/UserInfor.vue"),
      }, {
        path: "/UserExper",
        name: "UserExper",
        component: () => import("../views/UserExper.vue"),
      }, {
        path: "/UserEchart",
        name: "UserEchart",
        component: () => import("../views/UserEchart.vue"),
      }, {
        path: "/CompanyAdd",
        name: "CompanyAdd",
        component: () => import("../views/CompanyAdd.vue"),
      }, {
        path: "/CompanyManag",
        name: "CompanyManag",
        component: () => import("../views/CompanyManag.vue"),
      }, {
        path: "/map",
        name: "map",
        component: () => import("../views/map.vue"),
      },
    ]
  },
];

const router = new VueRouter({
  routes,
});

export default router;
