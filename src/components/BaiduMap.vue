<template>
    <div class="map" ref="baiduRef"></div>
</template>
<script setup>
import {ref} from 'vue'

const baiduRef = ref()
const map = ref()
const point = ref()

defineExpose({map})

function initMap(lng = -74, lat = 41) {
    map.value = new BMap.Map(baiduRef.value)
    point.value = new BMap.Point(lng, lat)
    map.value.setMapStyle({style: 'light'})
    map.value.centerAndZoom(point.value, 13)
    map.value.enableScrollWheelZoom(true) //滚轮缩放

    /* maintain the position of the popup window
    * 有 bug：暂时不生效
    * */
    const options = ['dragging', 'dragstart', 'dragend', 'zoomstart', 'zoomend']
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

</script>
<style lang="scss" scoped>
.map {
  width: 100%;
  height: 100%;
}
</style>