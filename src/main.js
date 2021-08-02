import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueAMap from 'vue-amap';
Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: 'bc43abc74eaac8d9fde2e46894141e68',
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.4'
});

import "./style/global.scss";
Vue.config.productionTip = false;

import Element from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(Element);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
