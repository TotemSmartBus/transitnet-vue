<template>
  <div class="container-nolim">
    <div class="content">
      <div v-if="polyLines.length>0" >
        <TrajSearchFormKnnRT  :points="polyLines" @receiveResult="receiveResult" />
      </div>
      <h2 v-else>Please draw dots on the map to determine the query route.</h2>
      <h3>Top-k Real-time Bus-Info:</h3>
      <TrajSearchResultKnnRT :data="result.buses" />
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
import TrajSearchFormKnnRT from './TrajSearchFormKnnRT.vue'
import TrajSearchResultKnnRT from './TrajSearchResultKnnRT.vue'

export default {
  components: { TrajSearchResultKnnRT, TrajSearchFormKnnRT },
  props: {
    polyLines: Object,
    labels: Object,
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
      this.result = data
      this.$emit('update:value', data.trips);
    },
    clearData(){
      this.result={}
    }
  },

}
</script>