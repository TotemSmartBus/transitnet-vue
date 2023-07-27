<template>
    <div class="map" ref="baiduRef"></div>
</template>
<script setup>
import {ref} from 'vue'

const baiduRef = ref()
const map = ref()
const point = ref()

defineExpose({map})

function initMap(lng = -73.95601, lat = 40.712776) {
    map.value = new BMap.Map(baiduRef.value)
    point.value = new BMap.Point(lng, lat)
    map.value.setMapStyle({style: 'light'})
    map.value.centerAndZoom(point.value, 13)
    map.value.enableScrollWheelZoom(true) //滚轮缩放

    /* maintain the position of the popup window
    * 有 bug：暂时不生效
    * */
    const options = []
    for (let item in options) {
        map.value.addEventListener(item, () => {
            // if (this.$refs.detailWindow.style.display === 'block') {
            setDetailWindowPosition()
            // }
        })
    }

    /* controls */
    const navigation = new BMap.NavigationControl({
        //init the navigation
        anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
        type: BMAP_NAVIGATION_CONTROL_SMALL,
    })
    map.value.addControl(navigation)

    /* route and speed layer */
    // displayRouteShapeAndSpeed_Canvas()
}

function setDetailWindowPosition() {
    //calculate the position
    let curPixel = this.map.pointToPixel(this.curVehicle.curVehiclePoint)
    let detailWindow = document.getElementById('detailWindow')
    let top = curPixel.y - detailWindow.offsetHeight - 30
    let left = curPixel.x - detailWindow.offsetWidth / 2
    //set the detailWindow Position
    this.$refs.detailWindow.style.top = top + 'px'
    this.$refs.detailWindow.style.left = left + 'px'
}

onMounted(() => {
    initMap()
})
// export default {
//     data() {
//         return {
//             baiduMap: map
//         }
//     },
//     mounted() {
//         console.log("doing init map")
//         this.initMap(-73.95601, 40.780624)
//     },
//     methods: {
//         initMap(lng = -73.95601, lat = 40.780624) {
//             map.value = new BMap.Map(baiduRef.value)
//             point.value = new BMap.Point(lng, lat)
//             map.value.setMapStyle({style: 'light'})
//             map.value.centerAndZoom(point.value, 13)
//             map.value.enableScrollWheelZoom(true) //滚轮缩放
//         },
//     },
// }
</script>
<style lang="scss" scoped>
.map {
  width: 100%;
  height: 100%;
}
</style>