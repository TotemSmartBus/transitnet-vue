<template>
  <el-table :data="data">
    <el-table-column type="index" label="No." />
    <el-table-column prop="id" label="BusId" />
    <el-table-column prop="position" label="Position" />
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
