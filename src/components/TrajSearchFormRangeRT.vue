<template>
  <el-form ref="formRef" v-model="form">
    <h5>{{"Note: click on the \"Clear Draw\" button to clear the results."}}</h5>
    <h4>{{ label.content }}</h4>
    <el-form-item v-for="(point, index) in this.points">
      <el-input :value="point.lat" type="hidden" v-model="form[index].lat" />
      <el-input :value="point.lng" type="hidden" v-model="form[index].lng" />
      <el-row :gutter="0">
        <el-col :span="24">
          <el-text class="mx-1">{{ point.lat + ',' + point.lng }}</el-text>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item>
          <el-button type="primary" @click="handleQuery(this)" id="submit">
            <el-icon>
              <Search />
            </el-icon>
            Query
          </el-button>

          <el-button type="primary" @click="downloadResult()" >
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
import {searchTrajectory_Range_realtime} from '@/apis/search'

export default {
  components: { Delete, Search },
  props: {
    label: Object,
    points: Array
  },
  data() {
    let form = []
    for (let i = 0; i < this.points.length; i++) {
      form.push(reactive({
        time: ref(0.0),
        lng: ref(this.points[i].lng),
        lat: ref(this.points[i].lat)
      }))
    }
    return {
      form: form,
      withTime: true,
      qr:[],
      result: []
    }
  },
  methods: {
    downloadResult(){
      let trips=this.qr.trips;
      let txtContent = '';

      trips.forEach((trip, index) => {
        txtContent += `Trip ID: ${trip.tripid}\n`;
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
        points: []
      }
      for (let i = 0; i < that.form.length; i++) {
        formData.points.push({
          lat: that.form[i].lat,
          lng: that.form[i].lng,
          time: that.form[i].time
        })
      }
      console.log(formData);
      let result = searchTrajectory_Range_realtime(formData)
      result.then(res => {
        that.qr=res
        that.$emit('receiveResult', res)
      }).catch(e => {
        console.error(e)
      })
    }
  }
}
</script>