<template>
  <div id = 'root'>
    <router-view></router-view>
  </div>
</template>
<script>
import MapVisual from "@/components/MapVisual";
export default {
  components: { },
  data () {
    return{}
  }
}
</script>
<style>
#root {
  height: 100%;
  width: 100%;
  color: black;
  margin: 0;
  padding: 0;
}
</style>
