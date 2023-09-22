<template>
  <el-form ref="formRef" v-model="form">
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
      <el-row :gutter="20">
        <el-col :span="8">
          <el-button type="primary" @click="handleQuery(this)" id="submit">
            <el-icon>
              <Search />
            </el-icon>
            Query
          </el-button>
        </el-col>
      </el-row>
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
      result: []
    }
  },
  methods: {
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
        that.$emit('receiveResult', res)
      }).catch(e => {
        console.error(e)
      })
    }
  }
}
</script>