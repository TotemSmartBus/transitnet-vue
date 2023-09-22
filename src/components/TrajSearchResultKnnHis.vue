<template>
  <div style="overflow: auto;max-height:100%" >
    <el-table :data="data" style="width: 100%" max-height="100%">
      <el-table-column type="index" label="No." width="50"/>
      <el-table-column prop="id" label="BusId" />
      <el-table-column prop="similarity" label="Similarity" width="90"/>
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
