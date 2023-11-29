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
    <h4>{{"Set the time window."}}</h4>
    <el-form-item label="begin">
      <el-input v-model="timerange1"  type="text"></el-input>
    </el-form-item>
    <el-form-item label="end&nbsp;&nbsp;&nbsp;">
      <el-input v-model="timerange2"  type="text"></el-input>
    </el-form-item>
      <el-button class="btn" @click="clearTimeRange">Clear</el-button>
      <el-tooltip :disabled="!tooltipv" content="wrong date format">
        <el-button class="btn" type="primary" @click="handleQuery(this)" id="submit">
          <el-icon>
            <Search />
          </el-icon>
          Query
        </el-button>
      </el-tooltip>
  </el-form>
</template>

<script>
import { Delete, Search } from '@element-plus/icons-vue'
import {searchTrajectory_Range_history} from '@/apis/search'


function isValidDateTimeFormat(dateTimeString) {
  // 使用正则表达式匹配 "yyyy-MM-dd HH:mm:ss" 格式
  const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
  if (!regex.test(dateTimeString)) {
    return false; // 格式不匹配
  }

  // 将字符串转换为日期对象
  const dateTimeParts = dateTimeString.split(/[- :]/);
  const year = parseInt(dateTimeParts[0], 10);
  const month = parseInt(dateTimeParts[1], 10);
  const day = parseInt(dateTimeParts[2], 10);
  const hour = parseInt(dateTimeParts[3], 10);
  const minute = parseInt(dateTimeParts[4], 10);
  const second = parseInt(dateTimeParts[5], 10);

  // 检查年月日时分秒范围是否合理
  const currentYear = new Date().getFullYear();
  if (year < 1900 || year > currentYear) {
    return false; // 年份不合理
  }

  if (month < 1 || month > 12) {
    return false; // 月份不合理
  }

  // 检查每月的天数
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) {
    return false; // 日不合理
  }

  if (hour < 0 || hour > 23) {
    return false; // 时不合理
  }

  if (minute < 0 || minute > 59) {
    return false; // 分不合理
  }

  if (second < 0 || second > 59) {
    return false; // 秒不合理
  }

  return true; // 格式和范围都合理
}

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
      tooltipv:false,
      form: form,
      withTime: true,
      result: [],
      timerange1:'2023-05-20 08:00:00',
      timerange2:'2023-05-20 14:00:00'
    }
  },
  methods: {
    handleQuery: (that) => {
      let formData = {
        points: [],
        timerange1:[],
        timerange2:[]
      }
      for (let i = 0; i < that.form.length; i++) {
        formData.points.push({
          lat: that.form[i].lat,
          lng: that.form[i].lng,
          time: that.form[i].time
        })
      }
      formData.timerange1=that.timerange1;
      formData.timerange2=that.timerange2;
        if(isValidDateTimeFormat(formData.timerange1)&&isValidDateTimeFormat(formData.timerange2)){
        that.tooltipv=false;
        let result = searchTrajectory_Range_history(formData)
        result.then(res => {
          res.buses.push({
            id: 'EOF',
          });
          that.$emit('receiveResult', res)
        }).catch(e => {
          console.error(e)
        })
      }else{
        console.log('wrong date format!(yyyy-MM-dd HH:mm:ss)')
        that.tooltipv=true;
      }
    },
    clearTimeRange(){
      this.timerange1 = []
      this.timerange2 = []
      this.clearAll()
    }
  }
}
</script>