<template>
  <div></div>
</template>
<script setup>
import { ElNotification } from 'element-plus'

const open = () => {
  ElNotification({
    title: 'NOTICE',
    dangerouslyUseHTMLString: true,
    message: 'The Data source is unavailable now, stop service, please visit later.<hr/>MTA 数据源当前维护，数据更新暂停，请稍后访问。',
    type: 'warning',
    duration: 0
  })
}

onMounted(() => {
  open()
})
</script>