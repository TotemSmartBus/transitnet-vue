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
    <h4>{{"Set a date."}}</h4>
    <el-form-item label="Date">
      <el-tooltip :disabled="!tooltipv" content="wrong date format">
        <el-input v-model="timerange" placeholder="yyyy-MM-dd" type="text"></el-input>
      </el-tooltip>
      <el-button class="btn" @click="clearTimeRange">Clear</el-button>
          <el-button class="btn" type="primary" @click="handleQuery(this)" id="submit">
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
import {searchTrajectory_Range_history} from '@/apis/search'


function isValidDateFormat(dateString) {
  // 使用正则表达式匹配 "yyyy-MM-dd" 格式
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) {
    return false; // 格式不匹配
  }

  // 将字符串转换为日期对象
  const dateParts = dateString.split('-');
  const year = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10);
  const day = parseInt(dateParts[2], 10);

  // 检查年月日范围是否合理
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
      tip:'wrong date farmat',
      form: form,
      withTime: true,
      result: [],
      timerange:[]
    }
  },
  methods: {
    handleQuery: (that) => {
      let formData = {
        points: [],
        timerange:[]
      }
      for (let i = 0; i < that.form.length; i++) {
        formData.points.push({
          lat: that.form[i].lat,
          lng: that.form[i].lng,
          time: that.form[i].time
        })
      }
      formData.timerange=that.timerange;
      if(isValidDateFormat(formData.timerange)){
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
        console.log('wrong date format!')
        that.tooltipv=true;
      }
    },
    clearTimeRange(){
      this.timerange = []
      this.clearAll()
    }
  }
}
</script>