import Vue from "vue";
import App from "./App.vue";
import BaiduMap from "vue-baidu-map";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import axios from "axios";
import $ from "jquery";
import router from "@/router";

axios.defaults.baseURL = process.env.VUE_APP_SERVER_URL_BASE;
/**
 * Other components send data via this.$axios
 * @type {AxiosStatic|{CancelTokenSource: CancelTokenSource, Axios: Axios, CancelStatic: CancelStatic, HeadersDefaults: HeadersDefaults, AxiosDefaults: AxiosDefaults, AxiosProxyConfig: AxiosProxyConfig, AxiosResponseTransformer: AxiosResponseTransformer, AxiosStatic: AxiosStatic, AxiosRequestConfig: AxiosRequestConfig, AxiosRequestTransformer: AxiosRequestTransformer, AxiosRequestHeaders: AxiosRequestHeaders, Cancel: Cancel, AxiosInstance: AxiosInstance, AxiosError: AxiosError, Method: Method, AxiosPromise: AxiosPromise, CancelTokenStatic: CancelTokenStatic, AxiosBasicCredentials: AxiosBasicCredentials, ResponseType: ResponseType, CancelToken: CancelToken, AxiosInterceptorManager: AxiosInterceptorManager, TransitionalOptions: TransitionalOptions, Canceler: Canceler, AxiosResponse: AxiosResponse, AxiosResponseHeaders: AxiosResponseHeaders, AxiosAdapter: AxiosAdapter}|AxiosStatic}
 */
window.jQuery = $;
window.$ = $;
window.Vue = Vue;
Vue.prototype.$axios = axios;
Vue.config.productionTip = false;
Vue.use(BaiduMap, {
  /* Visit http://lbsyun.baidu.com/apiconsole/key for details about app key. */
  ak: "g5f0bc3uZ0mKzHptwS1ugqMQ"
});

Vue.use(ElementUI);
let app = new Vue({
  render: h => h(App),
  router
}).$mount("#app");


