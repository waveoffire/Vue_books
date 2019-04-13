import Vue from "vue";
import App from "./App.vue";
import config from "./config";
import VueResource from "vue-resource";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import {
  HttpOptions,
  HttpResponse,
  $http,
  $resource,
  HttpHeaders
} from "vue-resource/types/vue_resource";
import Vuelidate from "vuelidate";
Vue.use(Vuelidate);

Vue.config.productionTip = false;
Vue.use(VueResource);
Vue.use(BootstrapVue);
declare module "vue/types/vue" {
  interface VueConstructor {
    http: {
      options: HttpOptions & { root: string };
      interceptors: any[];
      get: $http;
    };
  }
}
Vue.http.options.root = config.current.api;
document.title = config.current.title;
new Vue({
  render: h => h(App)
}).$mount("#app");
