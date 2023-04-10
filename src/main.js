import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import axios from "axios"
import $ from "jquery"
import "vue"
import './assets/main.css'
import {
    ElAside,
    ElContainer,
    ElDatePicker,
    ElDescriptions,
    ElFooter, ElIcon,
    ElMessage,
    ElOption,
    ElTable,
    ElTabPane,
    ElTabs
} from "element-plus"
import {ElForm} from "element-plus"
import {ElButton} from "element-plus"
import {ElFormItem} from "element-plus"
import {ElSelect} from "element-plus"

const app = createApp(App)
app.config.globalProperties.$axios = axios
app.config.globalProperties.$ = $
app.config.globalProperties.$message = ElMessage
app.use(router)

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

app.mount('#app')
