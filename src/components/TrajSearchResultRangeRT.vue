<template>
  <div style="overflow: auto; width: 100%;">
    <el-table :data="data" style="width: 100%; max-height: 100%; height: 500px;">
    <el-table-column type="index" label="No." />
    <el-table-column prop="id" label="BusId" />
    <el-table-column prop="position" label="Position" />
    </el-table>
  </div>
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
