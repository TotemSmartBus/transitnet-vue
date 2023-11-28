<template>
  <el-form>
    <h5>{{"Note: click on the \"Clear Draw\" button to clear the results."}}</h5>
    <h4>{{}}</h4>
    <el-form-item v-for="(point, index) in this.points" :key="index">
      <el-text class="mx-1">{{ points[index]['point'].lat + ',' + points[index]['point'].lng }}</el-text>
      <!--<el-input v-model="points[index]['point'].time" placeholder="yyyy-MM-dd HH:mm:ss" type="text" @input="handleInput(index, $event)"></el-input>-->
    </el-form-item>

    <el-form-item>
      <h4>Set the value of k：</h4>
      <el-input v-model="k" placeholder="Enter k" type="text"></el-input>
      <el-button class="btn" type="primary" @click="handleQuery" id="submit">
        <el-icon>
          <Search />
        </el-icon>
        Query
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { Delete, Search } from '@element-plus/icons-vue'
import { searchTrajectory_Knn_history } from '@/apis/search'

export default {
  components: { Delete, Search },
  props: {
    label: Object,
    points: Array
  },
  data() {
    return {
      result: [],
      k: 1
    }
  },
  methods: {
    handleInput(index, event) {
      // 在这里处理输入，可以添加一些限制条件，例如最小字符数等
      // 注意：这里只是示例，你可能需要根据实际需求修改
      const newValue = event.target.value;
      this.$set(this.points, index, { point: { ...this.points[index].point, time: newValue } });
    },
    handleQuery() {
      let formData = {
        points: this.points.map(point => ({
          lat: point.point.lat,
          lng: point.point.lng,
          time: point.point.time
        })),
        k: this.k
      };

      console.log("formData: ", formData);

      let result = searchTrajectory_Knn_history(formData);

      console.log(result);
      result.then(res => {
        console.log("form res: ", res);
        res.buses.push({
          id: 'EOF',
          similarity: 'EOF',
        });
        this.$emit('receiveResult', res);
      }).catch(e => {
        console.error(e);
      });
    },
  }
}
</script>
