// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index.js'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueParticles from 'vue-particles'
import { initMenu } from './utils/menus';

import {
  postRequest
} from "./utils/api";
import {
  putRequest
} from "./utils/api";
import {
  getRequest
} from "./utils/api";
import {
  deleteRequest
} from "./utils/api";

//插件形式使用请求
Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.deleteRequest = deleteRequest;

Vue.use(VueParticles)
Vue.use(ElementUI);
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  if (window.sessionStorage.getItem("tokenStr")) {
    initMenu(router, store);
    next()
  } else {
    next();
  }
})
/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
