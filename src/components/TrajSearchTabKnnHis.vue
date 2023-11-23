<template>
  <div class="container-nolim">
    <div class="content">
      <div v-if="polyLines.length>0">
        <TrajSearchFormKnnHis  :points="polyLines" @receiveResult="receiveResult" />
      </div>
      <h2 v-else>Please draw dots on the map to determine the query route.</h2>
      <h3>Top-k Historical Bus-Info:</h3>
      <TrajSearchResultKnnHis :data="result.buses" />
    </div>
  </div>
</template>

<style>
.container-nolim {
  /* 设置容器高度为整个视口的高度 */
  max-height: 100%;
  height: 100%;
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
import TrajSearchFormKnnHis from './TrajSearchFormKnnHis.vue'
import TrajSearchResultKnnHis from './TrajSearchResultKnnHis.vue'

export default {
  components: { TrajSearchResultKnnHis, TrajSearchFormKnnHis },
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
      console.log("Tab res:"+this.result.buses);
      this.$emit('update:value', data.trips);
    },
    clearData(){
      this.result={}
    }
  }
}
</script>