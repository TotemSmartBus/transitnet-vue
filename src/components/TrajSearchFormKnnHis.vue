<template>
  <el-form >
    <h5>{{"Give their timestamps."}}</h5>
    <el-form-item v-for="(point, index) in this.points">
      <el-text class="mx-1">{{ points[index]['point'].lat + ',' + points[index]['point'].lng }}</el-text>
      <el-input v-model="points[index]['point'].time" placeholder="Enter time" type="text"></el-input>
    </el-form-item>

    <el-form-item >
      <el-input v-model="k" placeholder="Enter k" type="text"></el-input>
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
import {searchTrajectory_Knn_history} from '@/apis/search'

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
      k:1
    }
  },
  watch: {
    points: {
      handler(newPoints, oldPoints) {
        // points 发生变化时的处理逻辑
        this.form=[];
        for (let i = 0; i < this.points.length; i++) {
          this.form.push(reactive({
            time: ref(this.points[i]['point'].time),
            lng: ref(this.points[i]['point'].lng),
            lat: ref(this.points[i]['point'].lat)
          }))
        }
      },
      deep: true
    }
  },
  methods: {
    handleQuery: (that) => {
      let formData = {
        points: [],
        k:1
      }
      for (let i = 0; i < that.form.length; i++) {
        formData.points.push({
          lat: that.form[i].lat,
          lng: that.form[i].lng,
          time: that.form[i].time
        })
      }
      formData.k=that.k;
      console.log("formdata: ",formData);
      let result = searchTrajectory_Knn_history(formData)
      console.log(result);
      result.then(res => {
        console.log("form res: ",res);
        that.$emit('receiveResult', res)
      }).catch(e => {
        console.error(e)
      })
    },
    clearTimeRange(){
      this.timerange = []
      this.clearAll()
    },
  }
}
</script>