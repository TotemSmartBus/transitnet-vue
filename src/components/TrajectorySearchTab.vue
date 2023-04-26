<template>
  <div v-if="polyLines.length > 0" v-for="(line, rowIndex) in polyLines">
    <TrajectorySearchForm :label="labels[rowIndex]" :points="line.getPath()" @receiveResult="receiveResult" />
  </div>
  <h2 v-else>Please create a path on the map.</h2>
  <h3>Related Trips:</h3>
  <TrajectorySearchResult :data="result.routes" />
  <h3>Related Buses:</h3>
  <TrajectorySearchResult :data="result.buses" />
</template>
<script>
import TrajectorySearchForm from './TrajectorySearchForm.vue'
import TrajectorySearchResult from '@/components/TrajectorySearchResult.vue'

export default {
  components: { TrajectorySearchResult, TrajectorySearchForm },
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
      this.result = data
      this.$emit('handleQuery', data)
    }
  }
}
</script>