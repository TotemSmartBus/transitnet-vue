import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import $ from 'jquery'
import 'vue'
import './assets/main.css'
import {
  ElAside, ElCheckbox, ElContainer, ElDatePicker, ElDescriptions,
  ElFooter, ElIcon, ElMessage, ElOption, ElTable, ElTabPane,
  ElTabs, ElTag, ElForm, ElButton, ElFormItem, ElSelect
} from 'element-plus'
import VueAxios from 'vue-axios'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ApiService from '@/service/api.service'

const app = createApp(App)
app.config.globalProperties.$axios = axios
axios.defaults.baseURL = 'http://localhost:8090'
app.config.globalProperties.$ = $
app.config.globalProperties.$message = ElMessage
app.use(router)

ApiService.init()

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(VueAxios, axios)
// element plus
app.use(ElMessage)
app.use(ElButton)
app.use(ElForm)
app.use(ElFormItem)
app.use(ElSelect)
app.use(ElOption)
app.use(ElDescriptions)
app.use(ElTabPane)
app.use(ElFooter)
app.use(ElContainer)
app.use(ElTabs)
app.use(ElDatePicker)
app.use(ElTable)
app.use(ElAside)
app.use(ElIcon)
app.use(ElTag)
app.use(ElCheckbox)

app.mount('#app')
