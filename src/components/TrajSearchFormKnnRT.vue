<template>
  <el-form>
    <h5>{{"Note: click on the \"Clear Draw\" button to clear the results."}}</h5>
    <el-form-item v-for="(point, index) in this.points">
      <el-row :gutter="0">
        <el-col :span="24">
          <el-text class="mx-1">{{ point['point'].lat + ',' + point['point'].lng }}</el-text>
        </el-col>
      </el-row>
    </el-form-item>
    <div>
      <h4>{{"Please set the values of k and time window"}}</h4>
      <el-row :gutter="20">
        <el-col :span="8">
          <label>k：</label>
          <el-input v-model="k" placeholder="K" style="width: 50%"></el-input>
        </el-col>
        <el-col :span="16">
          <label>time window(s):</label>
          <el-input v-model="backdate_s" placeholder="backdate" style="width: 40%"></el-input>
        </el-col>
      </el-row>
    </div>

    <el-form-item>
          <el-button class="btn" type="primary" @click="handleQuery(this)" id="submit">
            <el-icon>
              <Search />
            </el-icon>
            Query
          </el-button>

      <el-button class="btn" type="primary" @click="downloadResult" >
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
import {searchTrajectory_Knn_realtime} from '@/apis/search'

export default {
  components: { Delete, Search },
  props: {
    label: Object,
    points: Array
  },
  data() {
    let form = []
    return {
      form: form,
      withTime: true,
      result: [],
      k:5,
      qr:[],
      backdate_s:300
    }
  },
  watch: {
    points: {
      handler(newPoints, oldPoints) {
        // points 发生变化时的处理逻辑
        this.form=[];
        for (let i = 0; i < this.points.length; i++) {
          this.form.push(reactive({
            time: ref(0.0),
            lng: ref(this.points[i]['point'].lng),
            lat: ref(this.points[i]['point'].lat)
          }))
        }
      },
      deep: true
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
    handleQuery: (that) => {
      let formData = {
        points: [],
        k_backdate:[],
      }
      for (let i = 0; i < that.form.length; i++) {
        formData.points.push({
          lat: that.form[i].lat,
          lng: that.form[i].lng,
          time: that.form[i].time
        })
      }
      formData.k_backdate.push(that.k);
      formData.k_backdate.push(that.backdate_s);
      let result = searchTrajectory_Knn_realtime(formData)
      result.then(res => {
        res.buses.push({
          id: 'EOF',
          similarity: 'EOF',
        });
        that.qr=res
        that.$emit('receiveResult', res)
      }).catch(e => {
        console.error(e)
      })
    }
  }
}
</script>