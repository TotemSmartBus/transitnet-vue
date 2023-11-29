<template>
  <el-form>
    <h5>{{"Note: click on the \"Clear Draw\" button to clear the results."}}</h5>
    <h4>{{}}</h4>
    <el-form-item v-for="(point, index) in this.points" :key="index">
      <el-text class="mx-1">{{ point['point'].lat + ',' + point['point'].lng }}</el-text>
      <el-input v-model="inputText[index]" @input="setValue(index, $event)"></el-input>
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
      inputText:[],
      result: [],
      k: 1
    }
  },
  mounted() {
    for (let i = 0; i < 250; i++) {
      let str=this.getValue(i);
      this.inputText[i]=str;
    }
  },
  methods: {
    getValue(index){
      // 获取当前系统时间
      const currentDate = new Date();
      // 在时间上加上 index * 30 秒
      currentDate.setSeconds(currentDate.getSeconds() + index * 30 - 86400);
      // 将时间转换成字符串
      const formattedDate = this.parseDate(currentDate);
      return formattedDate;
    },
    parseDate(date) {
      // 格式化日期为 "yyyy-MM-dd HH:mm:ss"
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    setValue(index, event) {
      this.inputText[index]=event;
    },
    handleQuery() {
      let l=this.points.length;
      for(let j=0;j<l;j++){
        this.points[j].point.time=this.inputText[j]
      }
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
