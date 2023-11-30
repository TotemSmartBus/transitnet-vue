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

      <el-button class="btn" type="primary" @click="downloadResult">
        <el-icon>
          <Download />
        </el-icon>
        Download Result
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
      qr:[],
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
    downloadResult(){
      let sims=this.qr.buses;
      let trips=this.qr.trips;
      let txtContent = '';

      let it=0;
      trips.forEach((trip, index) => {
        txtContent += `Trip ID: ${trip.tripid}\n`;
        txtContent += `Similarity: ${sims[it].similarity}\n`;
        it+=1;
        trip.points.forEach(point => {
          txtContent += `Lat: ${point.lat}, Lng: ${point.lng}\n`;
        });
        txtContent += '\n';
      });

      // 创建一个Blob对象并生成URL
      const blob = new Blob([txtContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);

      // 创建一个<a>元素，并设置下载属性
      const a = document.createElement('a');
      a.href = url;
      a.download = 'trips.txt';

      // 将<a>元素添加到DOM中
      document.body.appendChild(a);

      // 模拟用户点击下载链接
      a.click();

      // 移除<a>元素
      document.body.removeChild(a);

      // 释放Blob对象占用的资源
      URL.revokeObjectURL(url);
    },
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

      let result = searchTrajectory_Knn_history(formData);

      result.then(res => {
        res.buses.push({
          id: 'EOF',
          similarity: 'EOF',
        });
        this.qr=res;
        this.$emit('receiveResult', res);
      }).catch(e => {
        console.error(e);
      });
    },
  }
}
</script>
