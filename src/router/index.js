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
        meta: { title: "个人信息", breadcrumb: ["个人信息"] },
      }, {
        path: "/UserExper",
        name: "UserExper",
        component: () => import("../views/UserExper.vue"),
        meta: { title: "个人经历", breadcrumb: ["个人经历"] },
      }, {
        path: "/UserEchart",
        name: "UserEchart",
        component: () => import("../views/UserEchart.vue"),
        meta: { title: "echarts", breadcrumb: ["echarts图表"] },
      }, {
        path: "/CompanyAdd",
        name: "CompanyAdd",
        component: () => import("../views/CompanyAdd.vue"),
        meta: { title: "新增企业", breadcrumb: ["新增企业"] },
      }, {
        path: "/CompanyManag",
        name: "CompanyManag",
        component: () => import("../views/CompanyManag.vue"),
        meta: { title: "企业管理", breadcrumb: ["企业管理"] },
      }, {
        path: "/map",
        name: "map",
        component: () => import("../views/map.vue"),
        meta: { title: "openlayers", breadcrumb: ["openlayers"] },
      },
      {
        path: "/Bus",
        name: "Bus",
        component: () => import("../views/Bus.vue"),
        meta: { title: "高德地图公交", breadcrumb: ["高德地图公交"] },
      }, {
        path: "/RoadNetwork",
        name: "RoadNetwork",
        component: () => import("../views/RoadNetwork.vue"),
        meta: { title: "高德地图路网", breadcrumb: ["高德地图路网"] },
      },
    ]
  },
];

const router = new VueRouter({
  routes,
});

export default router;
