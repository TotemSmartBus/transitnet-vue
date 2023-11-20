<template>
  <div class="container-nolim">
    <div class="content">
      <div v-if="polyLines.length>0" v-for="(line, rowIndex) in polyLines">
        <div v-if="rowIndex==polyLines.length-1">
          <TrajSearchFormRangeHis :label="labels[rowIndex]" :points="line.getPath()" @receiveResult="receiveResult" />
        </div>
      </div>
      <h2 v-else>Please draw a rectangle on the map to determine the range.Now only suport 2023-05-20</h2>
      <h3>Real-time Bus-Info:</h3>
      <TrajSearchResultRangeHis :data="result.buses" />
    </div>
  </div>
</template>

<style>
.container-nolim {
  /* 设置容器高度为整个视口的高度 */
  height: 100vh;
  overflow-y: auto; /* 添加垂直滚动条 */
  border: 1px solid #ccc; /* 可选：添加边框 */
}

.content {
  /* 设置内容的最小高度以适应容器 */
  min-height: 100%;
  padding: 10px; /* 可选：添加内边距 */
}
</style>

<script>
import TrajSearchFormRangeHis from './TrajSearchFormRangeHis.vue'
import TrajSearchResultRangeHis from '@/components/TrajSearchResultRangeHis.vue'

export default {
  components: { TrajSearchResultRangeHis, TrajSearchFormRangeHis },
  props: {
    polyLines: Object,
    labels: Object
  },
  data() {
    let query = []
    return {
      query: query,
      result: {}
    }
  },
  methods: {
    receiveResult(data) {
      console.log("Tab data:"+data);
      this.result = data
      console.log("Tab res:"+this.result);
      //this.$emit('handleQuery', data)
    }
  }
}
</script>