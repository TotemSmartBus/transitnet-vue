<template>
    <div class="map" ref="baiduRef"></div>
</template>
<script setup>
import {ref} from 'vue'

const baiduRef = ref()
const map = ref()
const point = ref()

defineExpose({map})

function initMap(lng = -73.95601, lat = 40.780624) {
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


// async function displayRouteShapeAndSpeed_Canvas() {
//     const {proxy} = getCurrentInstance()
//     proxy.$message({
//         message: 'Loading the routes history speed',
//         type: 'success',
//     })
//     let _this = this
//     let allShapeList = []
//     _this.trajData.trajectories = []
//     _this.trajData.totalPoints = []
//     _this.trajData.weights = []
//     _this.turfLineStrings = []
//     /**
//      * @get, url = '/routes/speed'
//      * @dataType List<RouteShapeSpeedVo>
//      */
//     await this.$axios
//         .get('/api/routes/speed')
//         .then((response) => {
//             if (response && response.status === 200) {
//                 allShapeList = response.data
//                 //Foreach shape
//                 allShapeList.forEach((shape) => {
//                     let pointsList = []
//                     let speedList = []
//                     let splitTraj = shape.trajJsonModels
//                     let coordinatesList = []
//                     let speedIdx = 0
//                     splitTraj.forEach((traj) => {
//                         let tempList = traj.geometry.coordinates
//                         coordinatesList = coordinatesList.concat(tempList)
//                         for (let i = 0; i < tempList.length; i++) {
//                             let bp = new BMap.Point(tempList[i][0], tempList[i][1])
//                             speedList.push(shape.speeds[speedIdx])
//                             pointsList.push(bp)
//                         }
//                     })
//                     var trajSum = {
//                         geometry: {
//                             type: 'LineString',
//                             coordinates: coordinatesList,
//                         },
//                     }
//                     _this.turfLineStrings.push(turf.lineString(coordinatesList))
//                     _this.trajData.trajectories.push(trajSum)
//                     _this.trajData.totalPoints.push(pointsList)
//                     _this.trajData.weights.push(speedList)
//                 })
//             } else _this.dealResponse(response)
//         })
//         .catch((error) => {
//             _this.dealError(error)
//         })
//     // _this.mapLayers.canvasLayerBack = new CanvasLayer({
//     //   map: _this.map,
//     //   update: _this.updateCanvasBack,
//     //   zIndex: CANVAS_ZINDEX_LINE-1,
//     // });
//     _this.mapLayers.canvasLayerLine = new CanvasLayer({
//         map: _this.map,
//         update: _this.updateCanvasLine_roadSpeed,
//         zIndex: CANVAS_ZINDEX_LINE,
//     })
// }

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