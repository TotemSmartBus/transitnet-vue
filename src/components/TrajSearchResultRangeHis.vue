<template>
  <el-table :data="data">
    <el-table-column type="index" label="No." width="50"/>
    <el-table-column prop="id" label="BusId" :style="{ 'font-size': '5px' }"/>
  </el-table>
</template>
<script>
import { ElTable, ElTableColumn } from 'element-plus'

export default {
  components: { ElTable, ElTableColumn },
  props: {
    data: Array
  }
}

</script>
