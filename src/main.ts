/*
 * @Date         : 2020-06-10 11:42:00
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-07-28 17:32:14
 * @FilePath     : \src\main.ts
 */
import Vue from "vue";
import App from "./App.vue";
import router from "common/RouterConfig";
import { server, AxiosInstance } from "common/HttpClient";
import VueJsonp from "vue-jsonp";
import "element-ui/lib/theme-chalk/index.css";
import ElementUI from "element-ui";

Vue.use(ElementUI);

Vue.config.productionTip = false;
Vue.prototype.$axios = server;
declare module "Vue/types/vue" {
  interface Vue {
    $axios: AxiosInstance;
  }
}

Vue.use(VueJsonp);

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
