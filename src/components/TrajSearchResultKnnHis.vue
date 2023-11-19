<template>
  <div style="overflow: auto; width: 100%;">
    <el-table :data="data" style="width: 100%; max-height: 100%; height: 500px;">
      <el-table-column type="index" label="No." width="50"/>
      <el-table-column prop="id" label="BusId" />
      <el-table-column prop="similarity" label="Similarity" width="90"/>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    data: Array, // Assuming data is passed as a prop
  },
};
</script>
