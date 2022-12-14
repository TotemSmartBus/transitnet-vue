import Vue from 'vue';
import App from './App.vue';
import BaiduMap from 'vue-baidu-map';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import axios from "axios";
import $ from 'jquery';
import MapVisual from "@/components/MapVisual";
import router from "./router/index.js";
/**
 * Set the reverse proxy, the front-end request sent to the http://localhost:8090/api by default
 * @type {{CancelTokenSource: CancelTokenSource, Axios: Axios, CancelStatic: CancelStatic, HeadersDefaults: HeadersDefaults, AxiosDefaults: AxiosDefaults, AxiosProxyConfig: AxiosProxyConfig, AxiosResponseTransformer: AxiosResponseTransformer, AxiosStatic: AxiosStatic, AxiosRequestConfig: AxiosRequestConfig, AxiosRequestTransformer: AxiosRequestTransformer, AxiosRequestHeaders: AxiosRequestHeaders, Cancel: Cancel, AxiosInstance: AxiosInstance, AxiosError: AxiosError, Method: Method, AxiosPromise: AxiosPromise, CancelTokenStatic: CancelTokenStatic, AxiosBasicCredentials: AxiosBasicCredentials, ResponseType: ResponseType, CancelToken: CancelToken, AxiosInterceptorManager: AxiosInterceptorManager, TransitionalOptions: TransitionalOptions, Canceler: Canceler, AxiosResponse: AxiosResponse, AxiosResponseHeaders: AxiosResponseHeaders, AxiosAdapter: AxiosAdapter} | AxiosStatic}
 */
//default
// axios.defaults.baseURL = "http://localhost:8090/api";

//For server
axios.defaults.baseURL = 'http://47.105.33.143:8090/api';
/**
 * Other components send data via this.$axios
 * @type {AxiosStatic|{CancelTokenSource: CancelTokenSource, Axios: Axios, CancelStatic: CancelStatic, HeadersDefaults: HeadersDefaults, AxiosDefaults: AxiosDefaults, AxiosProxyConfig: AxiosProxyConfig, AxiosResponseTransformer: AxiosResponseTransformer, AxiosStatic: AxiosStatic, AxiosRequestConfig: AxiosRequestConfig, AxiosRequestTransformer: AxiosRequestTransformer, AxiosRequestHeaders: AxiosRequestHeaders, Cancel: Cancel, AxiosInstance: AxiosInstance, AxiosError: AxiosError, Method: Method, AxiosPromise: AxiosPromise, CancelTokenStatic: CancelTokenStatic, AxiosBasicCredentials: AxiosBasicCredentials, ResponseType: ResponseType, CancelToken: CancelToken, AxiosInterceptorManager: AxiosInterceptorManager, TransitionalOptions: TransitionalOptions, Canceler: Canceler, AxiosResponse: AxiosResponse, AxiosResponseHeaders: AxiosResponseHeaders, AxiosAdapter: AxiosAdapter}|AxiosStatic}
 */
window.jQuery = $;
window.$ = $;
Vue.prototype.$axios = axios;
Vue.config.productionTip = false;
Vue.use(BaiduMap, {
  /* Visit http://lbsyun.baidu.com/apiconsole/key for details about app key. */
  ak: 'g5f0bc3uZ0mKzHptwS1ugqMQ'
});
Vue.use(router)
Vue.use(ElementUI);
new Vue({
  render: h => h(App),
  router
}).$mount('#app');


