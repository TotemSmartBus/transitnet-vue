//引入刚刚的配置好的axios拦截器
import axios from '@/service/interceptors.service'

const ApiService = {
  //初始化方法用vue-axios组件
  // init() {
  //   Vue.use(VueAxios, axios)
  //   //设置api的baseURL
  //   Vue.axios.defaults.baseURL = ''
  // },
  init() {
    axios.defaults.baseURL = "http://localhost:8090/api"/*import.meta.env.SERVER_ADDR*/
    // console.log(axios.defaults.baseURL)
  },
  //创建不同的网络请求方法
  get(resource, slug = '', params) {s
    return axios.get(`${resource}/${slug}`, { params }).catch(error => {
      throw error.response
    })
  },

  post(resource, params, config) {
    return axios.post(`${resource}`, params, config).catch(error => {
      throw error.response
    })
  },

  patch(resource, params, slug = '') {
    return axios.patch(`${resource}/${slug}`, params).catch(error => {
      throw error.response
    })
  },

  put(resource, params, slug = '') {
    return axios.put(`${resource}/${slug}`, params).catch(error => {
      throw error.response
    })
  },

  delete(resource, params, slug = '') {
    return axios
      .delete(`${resource}/${slug}`, { data: params })
      .catch(error => {
        throw error.response
      })
  }
}

export default ApiService