<template>
  <div id="root">
    <!--    <Notice />-->
    <el-container>
      <el-aside :width="isCollapseLeft ? '0px' : '350px'"
                style="margin-left: 10px;margin-right: 10px;transition:width .1s" id="asideLeft">
        <el-tabs v-model="activeName" @tab-click="clearAll_tabdata">
          <el-tab-pane label="Real-time Range Query" name="first">
            <TrajSearchTabRangeRT ref="realTimeRangeTab" :polyLines="drawerData.rect_polygons" :labels="drawerData.rect_label"
                                  @handleQuery="handleQuery" />
          </el-tab-pane>
          <el-tab-pane label="Historical Range Query" name="historical-range-query">
            <TrajSearchTabRangeHis ref="historyRangeTab" :polyLines="drawerData.rect_polygons" :labels="drawerData.rect_label"
                                   @handleQuery="handleQuery" />
          </el-tab-pane>
          <el-tab-pane label="Real-time KNN Query" name="real-time-knn-query">
            <TrajSearchTabKnnRT ref="realTimeKnnTab" :polyLines="drawerData.marker_polygons" :labels="drawerData.marker_label"
                                @handleQuery="handleQuery" />
          </el-tab-pane>
          <el-tab-pane label="Historical KNN Query" name="historical-knn-query">
            <TrajSearchTabKnnHis ref="historyKnnTab" :polyLines="drawerData.marker_polygons" :labels="drawerData.marker_label"
                                 @handleQuery="handleQuery" />
          </el-tab-pane>
        </el-tabs>
      </el-aside>

        <el-container height="100%">
          <el-main>
            <div id="map_container" @mousemove="mouseMove">
              <div id="legendVehicle" ref="mapLegendVehicle"></div>
              <div id="legendRoadSpeed" ref="mapLegendRoadSpeed"></div>
              <el-button id="clearDrawButton" @click="clearAllDraw" type="danger">Clear Draw</el-button>
              <div id="baiduMap"></div>
              <div id="detailWindow" ref="detailWindow">
                <div id="detailTail"></div>
              </div>
            </div>
          </el-main>
        </el-container>

    </el-container>
  </div>
</template>
<script>

/* eslint-disable */
import * as zrender from 'zrender'
import CanvasPainter from 'zrender/lib/canvas/Painter'
import '../assets/map.css'
import {
  CANVAS_ZINDEX_VEHICLE,
  generateBusVehiclePointer,
  getTrajColorByValue,
  getVehicleColor,
  LEGEND_DATA1,
  LEGEND_DATA2,
  rectStyle
} from '../components/utils'
import {CanvasLayer} from '../components/CanvasLayer.js'
import * as turf from '@turf/turf'
import {ArrowLeft, ArrowRight, Close} from '@element-plus/icons-vue'
import BaiduMap from '@/components/BaiduMap.vue'
import {ElTag} from 'element-plus'
import Notice from '@/components/Notice.vue'

import TrajSearchTabRangeRT from '@/components/TrajSearchTabRangeRT.vue';

zrender.registerPainter('canvas', CanvasPainter)

export default {
  name: 'MapVisual',
  components: {
    ArrowRight,
    BaiduMap,
    ArrowLeft,
    Close,
    ElTag,
    Notice,
    TrajSearchTabRangeRT
  },
  data() {
    return {
      ak: 'g5f0bc3uZ0mKzHptwS1ugqMQ',
      activeName: 'first',
      trajData: {
        trajectories: [],
        weights: [],
        totalPoints: [],
      },
      // routeID 对应的路线信息
      routeTraj: new Map(),
      // 过滤可见的路线
      visibleRoute: new Map(),
      map: {},
      visualVehicles: {
        vehicleIds: [],
        vehicleInfos: [],
        bearings: [],
        points: [],
        speeds: []
      },
      mapLayers: {
        lineLayer: null,
        canvasLayerLine: null,
        canvasLayerPointer: null,
        canvasLayerBack: null,
        canvasLayerBusVehicle: null
      },
      curRouteId: '',
      curTripId: '',
      timer: undefined,
      drawerData: {
        rect_polygons: [],
        rect_label: [],
        marker_polygons: [],
        marker_label: [],
        marker_points: [],
        overlayIdx: []
      },
      turfLineStrings: [],
      realTimeRouteOptions: [],
      selectRouteId: 'None',
      routeTipVisible: false,
      mouseX: 0,
      mouseY: 0
    }
  },

  async mounted() {
    let _this = this
    _this.getRealTimeOptions()
    _this.initMap()
    _this.showLegend()
  },
  computed: {
    Close() {
      return Close
    }
  },
  methods: {
    /**
     * @description init the map
     * 1. init the baidu map component
     * 2. set the map style
     * 3. display the origin trajectory
     */
    async initMap() {
      let _this = this
      _this.map = new BMap.Map('baiduMap', {
        enableMapClick: false
      })
      _this.map.setMapStyle({ style: 'light' })
      _this.map.centerAndZoom(new BMap.Point(-73.95, 40.7044), 12) //set map center and zoom
      _this.map.enableScrollWheelZoom(true);

      ['dragging', 'dragstart', 'dragend', 'zoomstart', 'zoomend'].forEach(
          function(item) {
            _this.map.addEventListener(item, () => {
              if (_this.$refs.detailWindow.style.display === 'block') {
                _this.setDetailWindowPosition()
              }
            })
          }
      )
      _this.addDrawer()
      //下面这两个就是地图上代表路线的各色粗线和代表车的各色箭头点
      await _this.displayRouteShapeAndSpeed_Canvas()
      await _this.displayVehicle_Canvas() //canvas Layer for busVehicle
    },
    showLegend() {
      //init canvas for vehicle speed legend
      let canvas1 = this.$refs.mapLegendVehicle
      let zr1 = zrender.init(canvas1, {})
      let legendData1 = LEGEND_DATA1
      let interval1 = 25
      for (let i = 0, len = legendData1.length; i < len; i++) {
        let circle = new zrender.Circle({
          shape: {
            cx: 20,
            cy: 20 + i * interval1,
            r: 10
          },
          style: {
            fill: legendData1[i].color
          }
        })
        zr1.add(circle)
        let txt = new zrender.Text({
          style: {
            textFill: 'rgb(0,0,0)',
            text: legendData1[i].label,
            fontSize: 12
          },
          position: [35, i * interval1 + 17]
        })
        zr1.add(txt)
      }
      //init canvas for route speed legend
      let canvas2 = this.$refs.mapLegendRoadSpeed
      let legendData2 = LEGEND_DATA2
      let interval2 = 40
      let zr2 = zrender.init(canvas2)
      for (let i = 0, len = legendData2.length; i < len; i++) {
        let line = new zrender.Line({
          shape: {
            x1: 10 + i * interval2,
            y1: 10,
            x2: 10 + (i + 1) * interval2,
            y2: 10
          },
          style: {
            stroke: legendData2[i].color,
            lineWidth: 10
          }
        })
        zr2.add(line)
        let txt = new zrender.Text({
          style: {
            textFill: 'rgb(0,0,0)',
            text: legendData2[i].label,
            fontSize: 12
          },
          position: [30 + i * interval2 - 0.5 * interval2, 20]
        })
        zr2.add(txt)
      }
    },
    getRealTimeOptions() {
      this.getRealTimeRouteOptions()
    },
    getRealTimeRouteOptions() {
      let _this = this
      /**
       * @get, url = "/realTime/routeOptions/?date={realTimeDate}"
       * @dataType List<String>
       */
      this.$axios
          .get('/api/realtime/latest')
          .then((response) => {
            if (response && response.status === 200) {
              _this.realTimeRouteOptions = response.data
            } else {
              _this.dealResponse(response)
            }
          }).catch((error) => {
        _this.dealError(error)
      })
    },
    addDrawer() {
      let _this = this
      //drawer setting
      const drawer = new BMapLib.DrawingManager(_this.map, {
        isOpen: false, // disable drawing mode
        enableDrawingTool: true, // displayOnInit tool bar
        drawingToolOptions: {
          anchor: BMAP_ANCHOR_TOP_LEFT, // position of the tool bar
          offset: new BMap.Size(5, 5), // offset from the position
          scale: 1.2,
          drawingModes: [
            BMAP_DRAWING_MARKER,
            BMAP_DRAWING_RECTANGLE
          ]
        },
        rectangleOptions: rectStyle
      })
      //after rect draw complete
      let rectComplete = function(rect) {
        _this.drawerData.rect_label.pop()
        _this.drawerData.rect_polygons.pop()
        let label = new BMap.Label(
            'Range: '
        )
        _this.drawerData.rect_label.push(label)
        _this.drawerData.rect_polygons.push(rect)
        //drawRect API
      }
      //after marker draw complete
      let markerComplete = function(marker) {
        let label = new BMap.Label(
            'P'+_this.drawerData.marker_polygons.length
        )
        _this.drawerData.marker_label.push(label)
        _this.drawerData.marker_polygons.push(marker)
      }
      //addEvent
      drawer.addEventListener('rectanglecomplete', rectComplete)
      drawer.addEventListener('markercomplete', markerComplete)
    },
    async displayVehicle_Canvas() {
      this.$message({
        message: 'Loading the real-time bus position',
        type: 'success'
      })
      let _this = this
      await _this.updateVehicleData()
      _this.timer = setInterval(this.updateVehicleData, 1000 * 30)
      _this.mapLayers.canvasLayerBusVehicle = new CanvasLayer({
        map: _this.map,
        update: _this.updateCanvasBusVehicle,
        zIndex: CANVAS_ZINDEX_VEHICLE //make sure the layer's index is high enough to trigger the mouse methods
      })
    },

    async displayRouteShapeAndSpeed_Canvas() {
      this.$message({
        message: 'Loading the routes history speed',
        type: 'success'
      })
      let _this = this
      let allShapeList = []
      _this.trajData.trajectories = []
      _this.trajData.totalPoints = []
      _this.trajData.weights = []
      _this.turfLineStrings = []
      /**
       * @get, url = '/routes/speed'
       * @dataType List<RouteShapeSpeedVo>
       */
      await this.$axios
          .get('/api/routes/speed')
          .then((response) => {
            if (response && response.status === 200) {
              allShapeList = response.data
              //Foreach shape
              allShapeList.forEach((shape) => {
                let pointsList = []
                let speedList = []
                let splitTraj = shape.trajJsonModels
                var coordinatesList = []
                let speedIdx = 0
                splitTraj.forEach((traj) => {
                  let tempList = traj.geometry.coordinates
                  coordinatesList = coordinatesList.concat(tempList)
                  for (let i = 0; i < tempList.length; i++) {
                    let bp = new BMap.Point(tempList[i][0], tempList[i][1])
                    speedList.push(shape.speeds[speedIdx])
                    pointsList.push(bp)
                  }
                })
                var trajSum = {
                  geometry: {
                    type: 'LineString',
                    coordinates: coordinatesList
                  }
                }
                _this.turfLineStrings.push(turf.lineString(coordinatesList))
                _this.trajData.trajectories.push(trajSum)
                let entity = {
                  speed: speedList[0], // 只需要一个速度即可
                  points: pointsList
                }
                _this.routeTraj.set(shape.routeId, entity)
                _this.visibleRoute.set(shape.routeId, entity)
              })
            } else _this.dealResponse(response)
          })
          .catch((error) => {
            _this.dealError(error)
          })
    },
    /**
     * @description clear all the overlays of map
     */
    clearAll() {
      let _this = this
      let overlays = _this.map.getOverlays()
      for (let i = 0; i < overlays.length; i++) {
        let tempOL = overlays[i]
        if (tempOL.toString() === '[object Overlay]')
          _this.map.removeOverlay(tempOL)
      }
      if (_this.mapLayers.lineLayer != null) {
        _this.mapLayers.lineLayer.destroy()
        _this.mapLayers.lineLayer = null
      }
      if (_this.mapLayers.stopLayer != null) {
        _this.mapLayers.stopLayer.destroy()
        _this.mapLayers.stopLayer = null
      }
      if (_this.mapLayers.canvasLayerLine != null) {
        _this.mapLayers.canvasLayerLine = null
      }
      if (_this.mapLayers.canvasLayerBack != null) {
        _this.mapLayers.canvasLayerBack = null
      }
      if (_this.mapLayers.canvasLayerBack != null) {
        _this.mapLayers.canvasLayerBack = null
      }
      if (_this.mapLayers.canvasLayerBusVehicle != null) {
        _this.mapLayers.canvasLayerBusVehicle = null
      }
    },
    async updateCanvasBusVehicle() {
      let that = this
      let _this = this.mapLayers.canvasLayerBusVehicle
      if (!_this.zr) {
        _this.zr = zrender.init(_this.canvas)
      } else {
        _this.zr.clear()
      }
      this.updateCanvasLine_roadSpeed(_this.zr)
      _this.zr.resize() //solve the offset caused by dragging or zooming the map
      //data prepare Test
      if (that.drawerData.marker_points.length > 0) {
        await that.selectNearestVehicle(10)
        var points = that.nearestVehicleData.points
        var weights = that.nearestVehicleData.speeds
        var bearings = that.nearestVehicleData.bearings
        var infos = that.nearestVehicleData.vehicleInfos
      } else {
        var points = that.visualVehicles.points
        var weights = that.visualVehicles.speeds
        var bearings = that.visualVehicles.bearings
        var infos = that.visualVehicles.vehicleInfos
      }
      //draw vehicle points
      for (let k = 0; k < weights.length; k++) {
        const pixel = that.map.pointToPixel(points[k])
        var pointSize = that.map.getZoom() > 15 ? 6 : 10
        let circle = new zrender.Circle({
          shape: {
            cx: pixel.x,
            cy: pixel.y,
            r: pointSize
          },
          style: {
            fill: getVehicleColor(weights[k]),
            stroke: '#faf9f9' //'#2e2d2d'
          },
          onclick: async function() {
            that.$message({
              message: 'Loading the detailWindow',
              type: 'success'
            })
            that.curVehicle.curVehiclePoint = points[k]
            that.curVehicle.curVehicleInfo = infos[k]
          }
        })
        _this.zr.add(circle)
        // Render arrows according to render pixel distance
        // Pointer length
        const pointerLong = 8
        const res = generateBusVehiclePointer(
            pointerLong,
            pixel,
            bearings[k],
            45
        )
        const aPixel = res.aPixel //set arrow point
        const bPixel = res.bPixel
        const midPixel = res.midPixel
        let line1 = new zrender.Polyline({
          shape: {
            points: [
              [aPixel.x, aPixel.y],
              [midPixel.x, midPixel.y],
              [bPixel.x, bPixel.y]
            ]
          },
          style: {
            stroke: '#000000',
            lineWidth: 2
          }
        })
        _this.zr.add(line1)
      }
    },
    /**
     * @description query vehicle Data by realtime and update the display
     */
    async updateVehicleData() {
      let _this = this
      await _this.$axios.get('/api/realtime/latest').then((response) => {
        if (response && response.status === 200) {
          let realTimeVehicleList = response.data
          realTimeVehicleList.forEach((realTimeVehicle) => {
            let tempVehicle = realTimeVehicle
            let tempSpeed = (typeof realTimeVehicle.speed) == 'number' ? realTimeVehicle.speed.toFixed(2) : 0
            if (_this.visualVehicles.vehicleIds.indexOf(tempVehicle.id) === -1) { //not exist
              _this.visualVehicles.vehicleIds.push(tempVehicle.id)
              _this.visualVehicles.speeds.push(tempSpeed)
              _this.visualVehicles.points.push(new BMap.Point(tempVehicle.lon, tempVehicle.lat))
              _this.visualVehicles.bearings.push(tempVehicle.bearing)
              _this.visualVehicles.vehicleInfos.push({
                id: tempVehicle.id,
                routeID: tempVehicle.routeID,
                agencyID: tempVehicle.agencyID,
                bearing: tempVehicle.bearing,
                nextStop: tempVehicle.nextStop,
                tripID: tempVehicle.tripID,
                speed: tempSpeed,
                recordedTime: tempVehicle.recordedTime,
                vehicleID: tempVehicle.id
              })
            } else {
              let curVIdx = _this.visualVehicles.vehicleIds.indexOf(tempVehicle.id)
              _this.visualVehicles.points[curVIdx] = new BMap.Point(tempVehicle.lon, tempVehicle.lat)
              _this.visualVehicles.bearings[curVIdx] = tempVehicle.bearing
              _this.visualVehicles.speeds[curVIdx] = tempSpeed
              _this.visualVehicles.vehicleInfos[curVIdx] = {
                id: tempVehicle.id,
                routeID: tempVehicle.routeID,
                agencyID: tempVehicle.agencyID,
                bearing: tempVehicle.bearing,
                nextStop: tempVehicle.nextStop,
                tripID: tempVehicle.tripID,
                speed: tempSpeed,
                recordedTime: tempVehicle.recordedTime,
                vehicleID: tempVehicle.id
              }
            }
          })
          _this.$message({
            message: 'Realtime Location Updated for ' + realTimeVehicleList.length + ' points',
            type: 'success'
          })
        } else _this.dealResponse(response)
      }).catch(error => {
        _this.dealError(error)
      })
      if (_this.mapLayers.canvasLayerBusVehicle != null)
        _this.updateCanvasBusVehicle() //update the display
    },
    /**
     * @description updateCanvas Line
     * @for CanvasLayerLine
     */
    async updateCanvasLine_roadSpeed(zr) {
      this.visibleRoute.forEach((route, routeId) => {
        let points = []
        for (let i = 0; i < route.points.length; i++) {
          let pixel = this.map.pointToPixel(route.points[i])
          points.push([pixel.x, pixel.y])
        }
        let line = new zrender.Polyline({
          style: {
            stroke: getTrajColorByValue(route.speed),
            lineWidth: 5.5,
            shadowColor: '#000',
            shadowBlur: 2
          },
          shape: {
            points: points,
            smooth: 1
          },
          onmouseover: (e) => {
            this.routeTipVisible = true
            this.selectRouteId = routeId
          },
          onmouseout: (e) => {
            setTimeout(() => this.routeTipVisible = false, 500)
          }
        })
        zr.add(line)
      })
    },
    setDetailWindowPosition() {
      //calculate the position
      let curPixel = this.map.pointToPixel(this.curVehicle.curVehiclePoint)
      let top = curPixel.y - detailWindow.offsetHeight - 30
      let left = curPixel.x - detailWindow.offsetWidth / 2
      //set the detailWindow Position
      this.$refs.detailWindow.style.top = top + 'px'
      this.$refs.detailWindow.style.left = left + 'px'
    },
    /**
     * @description Normalized error notification for response
     */
    dealResponse(response) {
      this.$message({
        message: 'Get ' + response.status + ' from server',
        type: 'error'
      })
    },
    /**
     * @description Normalized error notification
     */
    dealError(error) {
      if (error.response) {
        this.$message({
          message: 'Get ' + error.response.status + ' from server',
          type: 'error'
        })
      } else if (error.request) {
        this.$message({
          message: 'Request without response',
          type: 'error'
        })
      } else {
        this.$message({
          message: 'Request sending failed',
          type: 'error'
        })
      }
      console.log(error)
    },

    async handleQuery(data) {
      let that = this
      let newMap = new Map()
      data.routes.forEach((route) => {
        newMap.set(route.id, that.routeTraj.get(route.id))
      })
      that.visibleRoute = newMap
      that.updateCanvasBusVehicle()
    },

    /**
     * @description clear all drawer data and update the display
     */
    clearAllDraw() {
      let _this = this
      _this.drawerData = {
        //line, rect, marker
        rect_polygons: [],
        rect_label: [],
        marker_polygons: [],
        marker_label: [],
        marker_points: [],
        overlayIdx: []
      }
      _this.visibleRoute = _this.routeTraj
      // _this.updateCanvasLine_roadSpeed() //redraw
      _this.updateCanvasBusVehicle()
      let overlays = _this.map.getOverlays()
      for (let i = 0; i < overlays.length; i++) {
        //clear the overlays
        let tempOL = overlays[i]
        if (
            tempOL.toString() === '[object Polygon]' ||
            tempOL.toString() === '[object Label]' ||
            tempOL.toString() === '[object Polyline]' ||
            tempOL.toString() === '[object Marker]'
        )
          _this.map.removeOverlay(tempOL)
      }
      const realTimeRangeTabInstance = this.$refs.realTimeRangeTab;
      if (realTimeRangeTabInstance) {
        realTimeRangeTabInstance.clearData();
      }
      const historyRangeTabInstance = this.$refs.historyRangeTab;
      if (historyRangeTabInstance) {
        historyRangeTabInstance.clearData();
      }
      const realTimeKnnTabInstance = this.$refs.realTimeKnnTab;
      if (realTimeKnnTabInstance) {
        realTimeKnnTabInstance.clearData();
      }
      const historyKnnTabInstance = this.$refs.historyKnnTab;
      if (historyKnnTabInstance) {
        historyKnnTabInstance.clearData();
      }
    },
    clearAll_tabdata(){
      this.clearAllDraw();
    },
    mouseMove(event) {
      this.mouseX = event.pageX
      this.mouseY = event.pageY
      return true
    }
  }
}
</script>





