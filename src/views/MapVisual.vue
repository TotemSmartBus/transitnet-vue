<template>
  <div id="root">
    <!--    <Notice />-->
    <el-container>
      <el-aside :width="isCollapseLeft ? '0px' : '350px'"
                style="margin-left: 10px;margin-right: 10px;transition:width .1s" id="asideLeft">
        <el-tabs v-model="activeName">
          <el-tab-pane label="Real-time Analysis" name="first">
            <el-form>
              <el-form-item label="Time">
                Real-time bus data will update over time
              </el-form-item>
              <div id="clockContainer">

              </div>
              <el-form-item>
                <el-button @click="startDisplayVehicles">start</el-button>
                <el-button @click="stopDisplayVehicles">stop</el-button>
                <el-button @click="clearDisplayVehicles">clear</el-button>
              </el-form-item>
              <el-form-item id="emphasizeText">
                Select and Compare Routes or Trips
              </el-form-item>
              <el-form-item label="Select Routes:">
                count: {{ realTimeRouteOptions.length }}
              </el-form-item
              >
              <el-select
                  v-model="selectedRouteList"
                  multiple
                  filterable
                  placeholder="Please select"
                  multiple-limit="5"
              >
                <el-option
                    v-for="item in realTimeRouteOptions"
                    :key="item.id"
                    :label="item.id"
                    :value="item.id"
                >
                </el-option>
              </el-select>
              <el-button @click="submitRoutes" class="submitButton"
              >Submit
              </el-button
              >
              <el-form-item label="Select Trips:">
                count: {{ realTimeTripOptions.length }}
              </el-form-item>
              <el-select
                  filterable
                  v-model="realTimeRouteId"
                  placeholder="Select RouteId"
                  @change="getRealTimeTripOptions"
              >
                <el-option
                    v-for="item in realTimeRouteOptions"
                    :key="item.id"
                    :label="item.id"
                    :value="item.id"
                >
                </el-option>
              </el-select>
              <el-select
                  v-model="selectedTripList"
                  multiple
                  filterable
                  placeholder="Please select"
                  multiple-limit="5"
              >
                <el-option
                    v-for="item in realTimeTripOptions"
                    :key="item"
                    :label="item.id"
                    :value="item"
                >
                </el-option>
              </el-select>
              <el-button @click="submitTrips" class="submitButton"
              >Submit
              </el-button
              >
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="Static Analysis" name="second">
            <el-form
                label-width="30px"
                :label-position="labelPosition"
                id="form"
            >
              <el-form-item label="Time">
                <el-date-picker
                    v-model="timeSpan"
                    type="daterange"
                    start-placeholder="Start"
                    end-placeholder="End"
                    :default-time="['00:00:01', '23:59:59']"
                ></el-date-picker>
                <el-button class="btn" @click="clearTimeSpan">clear</el-button>
                <el-button class="btn" @click="setTimeSpan">
                  SetTimeSpan
                </el-button>
              </el-form-item>
              <el-form-item>
                <el-button class="btn" @click="show_transit_network"
                >Show Transit Network
                </el-button>
                <el-button class="btn" @click="show_road_speed"
                >Show Road Speed
                </el-button>
              </el-form-item>
              <el-form-item label="RouteId">
                <el-select
                    filterable
                    v-model="curRouteId"
                    placeholder="Select RouteId"
                    @change="listTrips"
                >
                  <el-option
                      v-for="item in routeIdOptions"
                      :key="item.routeId"
                      :label="item.routeId"
                      :value="item.routeId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="TripId">
                <el-select
                    filterable
                    v-model="curTripId"
                    placeholder="Select TripId">
                  <el-option
                      v-for="item in tripIdOptions"
                      :key="item.tripId"
                      :label="item.tripId"
                      :value="item.tripId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button @click="showOneTrajectory">Select</el-button>
              </el-form-item>
              <el-form-item id="lastItem">
                <el-table
                    :data="stopList"
                    height="350"
                    @row-click="clickStopRow"
                >
                  <el-table-column prop="stopName" label="stopName">
                  </el-table-column>
                  <el-table-column prop="arrivalTime" label="arrivalTime">
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="Trajectory Search" name="trajectory-search">
            <TrajectorySearchTab :polyLines="drawerData.line_polygons" :labels="drawerData.line_label"
                                 @handleQuery="handleQuery" />
          </el-tab-pane>
          <el-tab-pane label="Real-time Range Query" name="real-time-range-query">
            <TrajSearchTabRangeRT :polyLines="drawerData.rect_polygons" :labels="drawerData.rect_label"
                                  @handleQuery="handleQuery" />
          </el-tab-pane>
          <el-tab-pane label="Historical Range Query" name="historical-range-query">
            <TrajSearchTabRangeHis :polyLines="drawerData.rect_polygons" :labels="drawerData.rect_label"
                                   @handleQuery="handleQuery" />
          </el-tab-pane>
          <el-tab-pane label="Real-time KNN Query" name="real-time-knn-query">
            <TrajSearchTabKnnRT :polyLines="drawerData.marker_polygons" :labels="drawerData.marker_label"
                                @handleQuery="handleQuery" />
          </el-tab-pane>
          <el-tab-pane label="Historical KNN Query" name="historical-knn-query">
            <TrajSearchTabKnnHis :polyLines="drawerData.marker_polygons" :labels="drawerData.marker_label"
                                 @handleQuery="handleQuery" />
          </el-tab-pane>
        </el-tabs>
      </el-aside>
      <el-container>
        <el-container height="100%">
          <el-tag v-model:visible="routeTipVisible"
                  v-bind:style="{top: mouseY + 'px', left: mouseX + 'px', position: 'absolute', zIndex: 9999, display: routeTipVisible?'block':'none'}">
            Route:{{ selectRouteId }}
          </el-tag>
          <el-main>
            <el-button class="toggleButton" @click="toggleCollapseLeft">
              <el-icon>
                <ArrowRight v-if="isCollapseLeft" />
                <ArrowLeft v-else />
              </el-icon>
            </el-button>
            <div id="map_container" @mousemove="mouseMove">
              <div id="legendVehicle" ref="mapLegendVehicle"></div>
              <div id="legendRoadSpeed" ref="mapLegendRoadSpeed"></div>
              <el-button id="clearDrawButton" @click="clearAllDraw" type="info">Clear Draw</el-button>
              <div id="baiduMap"></div>
              <div id="detailWindow" ref="detailWindow">
                <div id="infoWindow">
                  <el-button id="closeButton" @click="hiddenDetailWindow" :icon="Close" circle />
                  <BusSpeed_Chart
                      v-bind:cur-vehicle="curVehicle"
                      ref="speedChart"
                  ></BusSpeed_Chart>
                </div>
                <div id="detailTail"></div>
              </div>
            </div>
            <el-button id="toggleRight" class="toggleButton" @click="toggleCollapseRight">
              <el-icon>
                <ArrowLeft v-if="isCollapseRight" />
                <ArrowRight v-else />
              </el-icon>
            </el-button>
          </el-main>
          <el-aside :width="isCollapseRight ? '0px' : '350px'"
                    style="margin-left: 10px;margin-right: 10px;transition:width .1s" id="asideRight">
            <BusTime_Chart
                v-bind:real-time-date="realTimeDate"
                ref="arrivalTimeChart"
            ></BusTime_Chart>
          </el-aside>
        </el-container>
        <el-footer height="260px">
          <el-container>
            <div style="width: 100%; height: 260px; overflow:scroll">
              <BusRoute_Chart ref="routeChart"></BusRoute_Chart>
              <BusTrip_Chart ref="tripChart"></BusTrip_Chart>
            </div>
          </el-container>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>
<script>
/* eslint-disable */
import * as zrender from 'zrender'
import CanvasPainter from 'zrender/lib/canvas/Painter'
import '../assets/map.css'

zrender.registerPainter('canvas', CanvasPainter)

import {
  // MP,
  getTrajColorByValue,
  getVehicleColor,
  arrowPoint,
  generateBusVehiclePointer,
  getPixelRatio,
  mapVOptions,
  LEGEND_DATA1,
  LEGEND_DATA2,
  CANVAS_ZINDEX_VEHICLE,
  CANVAS_ZINDEX_LINE,
  pathStyle,
  rectStyle
} from '../components/utils'
import { CanvasLayer } from '../components/CanvasLayer.js'
import BusRoute_Chart from './BusRoute_Chart.vue'
import BusTime_Chart from './BusTime_Chart.vue'
import BusSpeed_Chart from './BusSpeed_Chart.vue'
import BusTrip_Chart from './BusTrip_Chart.vue'
import * as turf from '@turf/turf'
import { ArrowLeft, ArrowRight, Close } from '@element-plus/icons-vue'
import BaiduMap from '@/components/BaiduMap.vue'
import { ElTag } from 'element-plus'
import { polygon } from '@turf/turf'
import Notice from '@/components/Notice.vue'

export default {
  name: 'MapVisual',
  components: {
    ArrowRight,
    BaiduMap,
    ArrowLeft,
    Close,
    BusTrip_Chart,
    BusRoute_Chart,
    BusTime_Chart,
    BusSpeed_Chart,
    ElTag,
    Notice,
  },
  data() {
    return {
      ak: 'g5f0bc3uZ0mKzHptwS1ugqMQ',
      activeName: 'first',
      trajData: {
        trajectories: [],
        weights: [],
        totalPoints: [],
        stopData: []
      },
      // routeID 对应的路线信息
      routeTraj: new Map(),
      // 过滤可见的路线
      visibleRoute: new Map(),
      map: {},
      timeSpan: [],
      stopList: [],
      displayStopData: {
        stopIdList: [],
        stopNameList: [],
        stopTimeList: [],
        stopPointList: []
      },
      labelPosition: 'top',
      routeIdOptions: [],
      tripIdOptions: [],
      visualVehicles: {
        vehicleIds: [],
        vehicleInfos: [],
        bearings: [],
        points: [],
        speeds: []
      },
      nearestVehicleData: {
        idList: [],
        vehicleIds: [],
        vehicleInfos: [],
        bearings: [],
        points: [],
        speeds: []
      },
      nearestTrajData: {
        idList: [],
        trajectories: [],
        weights: [],
        totalPoints: [],
        stopData: []
      },
      mapLayers: {
        lineLayer: null,
        stopLayer: null,
        canvasLayerStopText: null,
        canvasLayerLine: null,
        canvasLayerPointer: null,
        canvasLayerBack: null,
        canvasLayerBusVehicle: null
      },
      curRouteId: '',
      curTripId: '',
      isCollapseLeft: false,
      isCollapseRight: true,
      timer: undefined,
      curVehicle: {
        curVehiclePoint: undefined,
        curVehicleInfo: {
          id: "",
          routeID: "",
          agencyID: "",
          bearing: 0.0,
          tripID: "",
          nextStop: "",
          speed: 0.0
        },
        curVehicleSpeedList: []
      },
      realTimeDate: '2022-01-01',
      realTimeDatePick: '2022-01-01',
      realTimeTime: '18:00:00',
      drawerData: {
        line_polygons: [],
        line_label: [],
        rect_polygons: [],
        rect_label: [],
        marker_polygons: [],
        marker_label: [],
        marker_points: [],
        overlayIdx: []
      },
      turfLineStrings: [],
      realTimeRouteOptions: [],
      realTimeTripOptions: [],
      selectedRouteList: [],
      selectedTripList: [],
      routeSpeedList: [],
      tripSpeedList: [],
      realTimeRouteId: '',
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
    // this.refreshData()
  },
  computed: {
    Close() {
      return Close
    }
  },
  methods: {
    polygon,
    /**
     * @description init the map
     * 1. init the baidu map component
     * 2. set the map style
     * 3. display the origin trajectory
     */
    async initMap() {
      let _this = this
      const mousemoveHandler = (event) => {
        _this.mouseX = event.clientX
        _this.mouseY = event.clientY
      }
      // document.addEventListener('mousemove', mousemoveHandler)
      _this.map = new BMap.Map('baiduMap', {
        enableMapClick: false
      })
      _this.map.setMapStyle({ style: 'light' })
      _this.map.centerAndZoom(new BMap.Point(-73.88601, 40.880624), 13) //set map center and zoom
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
      const navigation = new BMap.NavigationControl({
        //init the navigation
        anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
        type: BMAP_NAVIGATION_CONTROL_SMALL
      })
      _this.addDrawer()
      _this.listAllRoutesIdOption()
      _this.map.addControl(navigation) //add navigation control to map
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
    /**
     * @description clear TimeSpan
     */
    clearTimeSpan() {
      this.timeSpan = []
      this.clearAll()
    },
    /**
     * @description toggle asideLeft
     */
    toggleCollapseLeft() {
      this.isCollapseLeft = !this.isCollapseLeft
      if (this.isCollapseLeft) {
        document.getElementById('asideLeft').style.width = '0'
      } else {
        document.getElementById('asideLeft').style.width = '350px'
      }
    },
    /**
     * @description toggle asideRight
     */
    toggleCollapseRight() {
      this.isCollapseRight = !this.isCollapseRight
      if (this.isCollapseRight) {
        document.getElementById('asideRight').style.width = '0'
      } else {
        document.getElementById('asideRight').style.width = '350px'
      }
    },
    /**
     * @description get RandomInt between min, max
     * @param min
     * @param max
     * @returns {*}
     */
    getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min
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
    /**
     * get tripOptions by routeId
     */
    getRealTimeTripOptions() {
      let _this = this
      if (_this.realTimeRouteId === '') {
        _this.$message({
          message: 'Please Check RouteId is selected',
          type: 'error'
        })
        return
      }
      let routeId = _this.realTimeRouteId
      /**
       * @get, url = "/realTime/tripOptions/?routeId={RouteId}&date={realTimeDate}"
       * @dataType List<String>
       */
      this.$axios
          .get(
              '/api/realTime/tripOptions/?routeId=' +
              routeId +
              '&date=' +
              _this.realTimeDate
          )
          .then((response) => {
            if (response && response.status === 200) {
              _this.realTimeTripOptions = response.data
            } else _this.dealResponse(response)
          })
          .catch((error) => {
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
            // functions on tool bar
            BMAP_DRAWING_MARKER,
            // BMAP_DRAWING_CIRCLE,
            BMAP_DRAWING_POLYLINE,
            // BMAP_DRAWING_POLYGON,
            BMAP_DRAWING_RECTANGLE
          ]
        },
        polylineOptions: pathStyle,
        rectangleOptions: rectStyle
      })
      //after line draw complete
      let lineComplete = (line) => {
        let point = line.getPath()[0]
        let opts = {
          position: point
        }
        let label = new BMap.Label(
            'path: ' + _this.drawerData.line_polygons.length,
            opts
        )
        label.setStyle({
          color: 'red',
          fontSize: '15px',
          height: '0px',
          width: '0px'
        })
        _this.map.addOverlay(label)
        _this.drawerData.line_label.push(label)
        _this.drawerData.line_polygons.push(line)
        //drawline API
      }
      //after rect draw complete
      let rectComplete = function(rect) {
        let point = new BMap.Point(
            (rect.getPath()[0].lng + rect.getPath()[2].lng) / 2,
            (rect.getPath()[0].lat + rect.getPath()[2].lat) / 2
        )
        let opts = {
          position: point
        }
        let label = new BMap.Label(
            'window: ' + _this.drawerData.rect_polygons.length,
            opts
        )
        label.setStyle({
          color: 'red',
          fontSize: '15px',
          height: '0px',
          width: '0px'
        })
        _this.map.addOverlay(label)
        _this.drawerData.rect_label.push(label)
        _this.drawerData.rect_polygons.push(rect)
        //drawRect API
      }
      //after marker draw complete
      let markerComplete = function(marker) {
        let point = turf.point([marker.point.lng, marker.point.lat])
        let bp = new BMap.Point(marker.point.lng, marker.point.lat)
        let opts = {
          position: bp
        }
        let label = new BMap.Label(
            'marker' +
            _this.drawerData.marker_polygons.length +
            ': (' +
            marker.point.lng +
            ',' +
            marker.point.lat +
            ')',
            opts
        )
        label.setStyle({
          color: 'black',
          fontWeight: 'bold',
          fontSize: '15px',
          height: '0px',
          width: '0px'
        })
        _this.map.addOverlay(label)
        _this.drawerData.marker_label.push(label)
        _this.drawerData.marker_points.push(point)
        _this.drawerData.marker_polygons.push(marker)
        //drawMarker API
        _this.$message({
          message: 'Select the 10 nearest routes and vehicle, please waiting',
          type: 'success'
        })
        _this.updateCanvasBusVehicle()
      }
      //addEvent
      drawer.addEventListener('polylinecomplete', lineComplete)
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
    /**
     * @description select top k nearstVehicle for marker_points List
     * @param k
     */
    selectNearestVehicle(k) {
      let _this = this
      let len = _this.visualVehicles.vehicleIds.length
      //select top k vehicle
      _this.nearestVehicleData = {
        idList: [],
        vehicleIds: [],
        vehicleInfos: [],
        bearings: [],
        points: [],
        speeds: []
      }
      for (let t = 0; t < _this.drawerData.marker_points.length; t++) {
        let point = _this.drawerData.marker_points[t]
        let distList = []
        for (let i = 0; i < len; i++) {
          let tp = turf.point([
            _this.visualVehicles.points[i].lng,
            _this.visualVehicles.points[i].lat
          ])
          let dist = turf.distance(point, tp, { units: 'miles' })
          distList.push([_this.visualVehicles.vehicleIds[i], dist, i])
        }
        distList.sort((a, b) => (a[1] > b[1] ? 1 : a[1] < b[1] ? -1 : 0))
        for (let i = 0; i < k && i < len; i++) {
          let tempId = distList[i][0]
          let tempIdx = distList[i][2]
          if (_this.nearestVehicleData.vehicleIds.indexOf(tempId) === -1) {
            _this.nearestVehicleData.vehicleIds.push(
                _this.visualVehicles.vehicleIds[tempIdx]
            )
            _this.nearestVehicleData.bearings.push(
                _this.visualVehicles.bearings[tempIdx]
            )
            _this.nearestVehicleData.vehicleInfos.push(
                _this.visualVehicles.vehicleInfos[tempIdx]
            )
            _this.nearestVehicleData.speeds.push(
                _this.visualVehicles.speeds[tempIdx]
            )
            _this.nearestVehicleData.points.push(
                _this.visualVehicles.points[tempIdx]
            )
          }
        }
      }
      // _this.updateCanvasLine_roadSpeed();
    },
    /**
     * @description select top k traj nearest point
     * @param point,k
     */
    selectNearestTraj(point, k) {
      let _this = this
      let len = _this.trajData.trajectories.length
      //select top k trajs
      let distList = []
      for (let i = 0; i < len; i++) {
        //calculate the distlist
        let line = _this.turfLineStrings[i]
        let dist = turf.pointToLineDistance(point, line, { units: 'miles' })
        distList.push([i, dist])
      }
      distList.sort((a, b) => (a[1] > b[1] ? 1 : a[1] < b[1] ? -1 : 0))
      for (let i = 0; i < k && i < len; i++) {
        let tempIdx = distList[i][0]
        if (_this.nearestTrajData.idList.indexOf(tempIdx) === -1) {
          _this.nearestTrajData.idList.push(tempIdx)
          _this.nearestTrajData.trajectories.push(
              _this.trajData.trajectories[tempIdx]
          )
          _this.nearestTrajData.totalPoints.push(
              _this.trajData.totalPoints[tempIdx]
          )
          _this.nearestTrajData.weights.push(_this.trajData.weights[tempIdx])
        }
      }
    },
    show_road_speed() {
      this.clearAll()
      this.displayRouteShapeAndSpeed_Canvas()
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
      // _this.mapLayers.canvasLayerBack = new CanvasLayer({
      //   map: _this.map,
      //   update: _this.updateCanvasBack,
      //   zIndex: CANVAS_ZINDEX_LINE-1,
      // });
      // _this.mapLayers.canvasLayerLine = new CanvasLayer({
      //   map: _this.map,
      //   update: _this.updateCanvasLine_roadSpeed,
      //   zIndex: CANVAS_ZINDEX_LINE,
      // })
    },
    show_transit_network() {
      this.clearAll()
      this.displayTransitNetwork_Canvas()
    },
    /**
     * @description 展示不带速度的轨迹图层
     * display trajectories of transit network by canvas
     */
    async displayTransitNetwork_Canvas() {
      this.$message({
        message: 'Loading the transit network',
        type: 'success'
      })
      let _this = this
      var routes = []
      _this.trajData.trajectories = []
      _this.trajData.totalPoints = []
      _this.trajData.weights = []
      /**
       * @get, url: /mapv/transitnetwork
       * @dataType List<RoutesVo>
       */
      await this.$axios
          .get('/api/mapv/transitnetwork')
          .then((response) => {
            if (response && response.status === 200) {
              routes = response.data
              //Foreach route
              routes.forEach((route) => {
                _this.trajData.trajectories.push(route.trajJsonModel)
              })
              let dataSet = new mapv.DataSet(_this.trajData.trajectories)
              _this.mapLayers.lineLayer = new mapv.baiduMapLayer(
                  _this.map,
                  dataSet,
                  mapVOptions.mapv_bus_line_light_green
              )
            } else _this.dealResponse(response)
          })
          .catch((error) => {
            _this.dealError(error)
          })

      // _this.mapLayers.canvasLayerLine = new CanvasLayer({
      //   map: _this.map,
      //   update: _this.updateCanvasLine_roadSpeed,
      //   zIndex: CANVAS_ZINDEX_LINE
      // });
    },
    /**
     * @description triggered when set timespan, list and display by timespan
     */
    setTimeSpan() {
      // this.displayTripsByTimeSpan();
      this.listRoutesIdOptionByTimeSpan()
    },
    /**
     * @description display route's trip by timespan
     */
    displayTripsByTimeSpan() {
      this.stopDisplayVehicles()
      let _this = this
      _this.clearAll()
      _this.trajData.trajectories = []
      let routes = []
      /**
       * @get, url = '/mapv/timespan/?startDate={startDate}&endDate={endDate}'
       * @dataType List<RoutesVo>
       */
      this.$axios
          .get(
              '/api/mapv/timespan/?startDate=' +
              _this.timeSpan[0].toLocaleDateString().replaceAll('/', '-') +
              '&endDate=' +
              _this.timeSpan[1].toLocaleDateString().replaceAll('/', '-')
          )
          .then((response) => {
            if (response && response.status === 200) {
              routes = response.data
              //push each Route to trajetories
              routes.forEach((route) => {
                _this.trajData.trajectories.push(route.trajJsonModel)
              })
              //check the routes
              if (routes.length === 0) {
                this.$message({
                  message: 'The bus service list in this timeSpan is empty',
                  type: 'warning'
                })
                return
              }
              _this.displayMapvLineLayer()
            } else _this.dealResponse(response)
          })
          .catch((error) => {
            _this.dealError(error)
          })
    },
    /**
     * @description list all RoutesId Option for
     */
    listAllRoutesIdOption() {
      let _this = this
      /**
       * @get, url = '/routes'
       * @dataType List<RoutesEntity>
       */
      this.$axios
          .get('/api/routes')
          .then((response) => {
            if (response && response.status === 200) {
              _this.routeIdOptions = response.data
              if (_this.routeIdOptions.length === 0) {
                _this.$message({
                  message: 'The bus route list is empty',
                  type: 'warning'
                })
              }
            } else _this.dealResponse(response)
          })
          .catch((error) => {
            _this.dealError(error)
          })
    },
    /**
     *@description list RoutesId option by timespan
     */
    listRoutesIdOptionByTimeSpan() {
      let _this = this
      /**
       * @get, url = '/routes/timespan?startDate={startDate}&endDate={endDate}' YYYY-mm-dd
       * @dataType List<RoutesEntity>
       */
      this.$axios
          .get(
              '/api/routes/timespan?startDate=' +
              _this.timeSpan[0].toLocaleDateString().replaceAll('/', '-') +
              '&endDate=' +
              _this.timeSpan[1].toLocaleDateString().replaceAll('/', '-')
          )
          .then((response) => {
            if (response && response.status === 200) {
              _this.routeIdOptions = response.data
              if (_this.routeIdOptions.length === 0) {
                _this.$message({
                  message: 'The bus route list for this timeSpan is empty',
                  type: 'warning'
                })
              }
            } else _this.dealResponse(response)
          })
          .catch((error) => {
            _this.dealError(error)
          })
    },
    /**
     * @description list trips options
     * by timespan or not
     */
    listTrips() {
      if (this.curRouteId !== '')
        this.$message({
          message: 'Filter tripList by routeId',
          type: 'success'
        })
      if (this.timeSpan.length === 0) {
        // if set timespan
        this.listTripsByRouteId()
      } else {
        //if not set timespan
        this.listTripsByRouteIdAndTimeSpan()
      }
    },
    /**
     * @description list trips option by route id
     */
    listTripsByRouteId() {
      let _this = this
      /**
       * @get, url = '/trips?routeId={routeId}'
       * @dataType List<TripsEntity>
       */
      this.$axios
          .get('/api/trips?routeId=' + _this.curRouteId)
          .then((response) => {
            if (response && response.status === 200) {
              _this.tripIdOptions = response.data
              if (_this.tripIdOptions.length === 0) {
                _this.$message({
                  message: 'The bus trip list for this route is empty',
                  type: 'warning'
                })
              }
            } else _this.dealResponse(response)
          })
          .catch((error) => {
            _this.dealError(error)
          })
    },
    /**
     * @description list trips options by routeid and timespan
     */
    listTripsByRouteIdAndTimeSpan() {
      let _this = this
      /**
       * @get, url = '/trips/timespan?routeId={routeId}&startDate={startDate}&endDate{endDate}' YYYY-mm-dd
       * @datatype List<TripsEntity>
       */
      this.$axios
          .get(
              '/api/trips/timespan?routeId=' +
              _this.curRouteId +
              '&startDate=' +
              _this.timeSpan[0].toLocaleDateString().replaceAll('/', '-') +
              '&endDate=' +
              _this.timeSpan[1].toLocaleDateString().replaceAll('/', '-')
          )
          .then((response) => {
            if (response && response.status === 200) {
              _this.tripIdOptions = response.data
              if (_this.tripIdOptions.length === 0) {
                _this.$message({
                  message:
                      'The bus trip list for this route and timespan is empty',
                  type: 'warning'
                })
              }
            } else _this.dealResponse(response)
          })
          .catch((error) => {
            _this.dealError(error)
          })
    },
    /**
     * @description get one trajectory by routeId and tripId
     */
    async displayOneTrajectory() {
      let _this = this
      _this.trajData.trajectories = []
      _this.trajData.totalPoints = []
      _this.trajData.stopData = []
      //Warning message
      if (_this.curRouteId === '') {
        await this.$message({
          message: 'Please Check the RouteId is Selected',
          type: 'warning'
        })
        return
      }
      if (_this.curTripId === '') {
        await this.$message({
          message: 'Please Check the TripId is Selected',
          type: 'warning'
        })
        return
      }
      /**
       * @get, url = '/mapv/?routeId={routeId}&tripId={tripId}'
       * @dataType RoutesVo
       */
      this.$axios
          .get(
              '/api/mapv/?routeId=' + _this.curRouteId + '&tripId=' + _this.curTripId
          )
          .then((response) => {
            if (response && response.status === 200) {
              _this.trajData.trajectories.push(response.data.trajJsonModel)
              //warning message
              if (
                  _this.trajData.trajectories[0].geometry.coordinates.length === 0
              ) {
                this.$message({
                  message: 'Please Check Matched RouteId and TripId are selected',
                  type: 'error'
                })
                return
              }
              this.$message({
                message: 'The selected trajectory is loading, please wait',
                type: 'success'
              })
              let dataSet = new mapv.DataSet(_this.trajData.trajectories)
              let curGeometry = _this.trajData.trajectories[0].geometry
              let centerPoint = new BMap.Point(
                  curGeometry.coordinates[0][0],
                  curGeometry.coordinates[0][1]
              )
              _this.map.centerAndZoom(centerPoint, 14)
              _this.mapLayers.lineLayer = new mapv.baiduMapLayer(
                  _this.map,
                  dataSet,
                  mapVOptions.mapv_bus_line_light_green
              )
              let pointsList = []
              for (let i = 0; i < curGeometry.coordinates.length; i++) {
                let bp = new BMap.Point(
                    curGeometry.coordinates[i][0],
                    curGeometry.coordinates[i][1]
                )
                pointsList.push(bp)
              }
              _this.trajData.totalPoints.push(pointsList)
              //init CanvasLayers
              // _this.mapLayers.canvasLayerBack = new CanvasLayer({
              //   map: _this.map,
              //   update: _this.updateCanvasBack,
              //   zIndex: CANVAS_ZINDEX_LINE-1,
              // });
              // _this.mapLayers.canvasLayerLine = new CanvasLayer({
              //   map: _this.map,
              //   update: _this.updateCanvasLine_roadSpeed
              //   zIndex: CANVAS_ZINDEX_LINE
              // });
              _this.mapLayers.canvasLayerPointer = new CanvasLayer({
                map: _this.map,
                update: _this.updateCanvasPointer,
                zIndex: CANVAS_ZINDEX_LINE + 1
              })
            } else _this.dealResponse(response)
          })
          .catch((error) => {
            _this.dealError(error)
          })
      _this.displayStopData.stopIdList = []
      _this.displayStopData.stopNameList = []
      _this.displayStopData.stopTimeList = []
      _this.displayStopData.stopPointList = []
      /**
       * @get, url = '/stops/?tripId={tripId}'
       * @dataType List<StopsVo>
       */
      this.$axios
          .get('/api/stops/?tripId=' + _this.curTripId)
          .then((response) => {
            if (response && response.status === 200) {
              let tempStopData = (_this.stopList = response.data)
              //process stop data to geometry
              for (let i = 0; i < tempStopData.length; i++) {
                _this.trajData.stopData.push({
                  geometry: tempStopData[i].pointJsonModel.geometry,
                  id: tempStopData[i].stopId,
                  name: tempStopData[i].stopName,
                  time: tempStopData[i].arrivalTime
                })
              }
              let dataSet = new mapv.DataSet(_this.trajData.stopData)
              let option = mapVOptions.mapv_option_stop
              _this.mapLayers.canvasLayerStopText = new CanvasLayer({
                map: _this.map,
                update: _this.updateCanvasStop,
                zIndex: 5
              })
              let stopMouseMove = function(item) {
                let layer = _this.mapLayers.canvasLayerStopText
                if (!layer.zr) {
                  layer.zr = zrender.init(layer.canvas)
                  layer.zr.resize()
                }
                if (
                    item !== null &&
                    _this.displayStopData.stopIdList.indexOf(item.id) === -1
                ) {
                  _this.displayStopData.stopIdList.push(item.id)
                  _this.displayStopData.stopNameList.push(item.name)
                  _this.displayStopData.stopTimeList.push(item.time)
                  let point = new BMap.Point(
                      item.geometry.coordinates[0],
                      item.geometry.coordinates[1]
                  )
                  _this.displayStopData.stopPointList.push(point)
                  let pixel = _this.map.pointToPixel(point)
                  let text = new zrender.Text({
                    style: {
                      textFill: 'rgb(0,0,0)',
                      text: item.name + ' ' + item.time,
                      fontSize: 14
                    },
                    position: [pixel.x + 10, pixel.y + 10]
                  })
                  layer.zr.add(text)
                  setTimeout(() => {
                    let tempIdx = _this.displayStopData.stopIdList.indexOf(
                        item.id
                    )
                    _this.displayStopData.stopIdList.splice(tempIdx, 1)
                    _this.displayStopData.stopNameList.splice(tempIdx, 1)
                    _this.displayStopData.stopPointList.splice(tempIdx, 1)
                    _this.displayStopData.stopTimeList.splice(tempIdx, 1)
                  }, 5000)
                }
              }
              option.methods.mousemove = stopMouseMove
              _this.mapLayers.stopLayer = new mapv.baiduMapLayer(
                  _this.map,
                  dataSet,
                  option
              )
            } else _this.dealResponse(response)
          })
          .catch((error) => {
            _this.dealError(error)
          })
    },
    /**
     * @description display the stop text label
     */
    updateCanvasStop() {
      //init
      let _this = this
      let layer = _this.mapLayers.canvasLayerStopText
      if (!layer.zr) {
        layer.zr = zrender.init(layer.canvas)
        layer.zr.resize()
      } else {
        layer.zr.clear()
      }
      let len = _this.displayStopData.stopIdList.length
      for (let i = 0; i < len; i++) {
        let point = _this.displayStopData.stopPointList[i]
        let pixel = _this.map.pointToPixel(point)
        let text = new zrender.Text({
          style: {
            textFill: 'rgb(0,0,0)',
            text:
                _this.displayStopData.stopNameList[i] +
                ' ' +
                _this.displayStopData.stopTimeList[i],
            fontSize: 14
          },
          position: [pixel.x + 10, pixel.y + 10]
        })
        layer.zr.add(text)
      }
    },
    /**
     * @description display mapV layers
     * 1. mapV linelayer
     * 2. mapV animationLayer (X)
     */
    displayMapvLineLayer() {
      let _this = this
      let dataSet = new mapv.DataSet(_this.trajData.trajectories) //set dataSet
      _this.mapLayers.lineLayer = new mapv.baiduMapLayer(
          _this.map,
          dataSet,
          mapVOptions.mapv_bus_line_light_green
      ) // set the layer
    },
    /**
     * @description show one route's trajectory
     * 1. clear the map
     * 2. show the trajectory
     */
    async showOneTrajectory() {
      await this.$message({
        message: 'Clear and Stop the real-time bus data update',
        type: 'warning'
      })
      if (this.visualVehicles.vehicleIds.length !== 0) {
        await this.clearDisplayVehicles()
        await this.stopDisplayVehicles()
      }
      this.clearAll()
      this.displayOneTrajectory()
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
            await that.curVehicleChartPrepare(k)
            that.$refs.speedChart.updateSpeedChartVehicleData()
            that.showDetailWindow()
            that.setDetailWindowPosition()
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
     * @description remove visualVehicle data by idx
     * @param tempIdx
     */
    removeOneVehicle_visualVehicles(tempIdx) {
      this.visualVehicles.vehicleIds.splice(tempIdx, 1)
      this.visualVehicles.bearings.splice(tempIdx, 1)
      this.visualVehicles.speeds.splice(tempIdx, 1)
      this.visualVehicles.vehicleInfos.splice(tempIdx, 1)
      this.visualVehicles.points.splice(tempIdx, 1)
    },
    /**
     * @description select and display the speed data of vehicleId k
     * @param k vehicleId
     */
    async curVehicleChartPrepare(k) {
      let _this = this
      let vehicleId = _this.visualVehicles.vehicleIds[k]
      _this.curVehicle.curVehicleInfo = _this.visualVehicles.vehicleInfos[k]
      /**
       * @get, url: /realTime/speed/?vehicleId={vehicleId}&curTime={realTimeDate+realTimeTime}
       * @dataType List<SpeedDateVo>
       */
      await _this.$axios
          .get(
              '/api/realTime/speed/?vehicleId=' +
              vehicleId +
              '&curTime=' +
              _this.realTimeDate +
              ' ' +
              _this.realTimeTime
          )
          .then((response) => {
            if (response && response.status === 200) {
              //last seven days
              _this.curVehicle.curVehicleSpeedList = response.data
            } else _this.dealResponse(response)
          })
          .catch((error) => {
            _this.dealError(error)
          })
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
              //remove the vehicle already arrival the end
              // if (tempVehicle.nextStop === '') _this.removeOneVehicle_visualVehicles(curVIdx)
              // else {
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
              // }
            }
          })
          _this.$message({
            message: 'Realtime Location Updated for ' + realTimeVehicleList.length + ' points',
            type: 'success'
          })
          //remove the vehicle not update with past 5 minutes
          // _this.visualVehicles.vehicleIds.forEach((curVehicle) => {
          //   let tempVIdx = _this.visualVehicles.vehicleIds.indexOf(curVehicle)
          //   let recordTime = new Date(_this.visualVehicles.vehicleInfos[tempVIdx].recordedTime)
          //   // if (curTimeDate.getTime() - recordTime.getTime() >= DELETEBEFORE) {
          //   //   _this.removeOneVehicle_visualVehicles(tempVIdx)
          //   // }
          // })
        } else _this.dealResponse(response)
      }).catch(error => {
        _this.dealError(error)
      })
      if (_this.mapLayers.canvasLayerBusVehicle != null)
        _this.updateCanvasBusVehicle() //update the display
    },
    /**
     * @description start the real time display
     */
    startDisplayVehicles() {
      if (this.timer !== null) {
        this.$message({
          message: 'Real-time bus data update has started',
          type: 'warning'
        })
        return
      }
      this.$message({
        message: 'Real-time bus data update is starting, please wait',
        type: 'success'
      })
      if (this.mapLayers.canvasLayerBusVehicle != null) {
        //update vehicle data
        this.updateVehicleData()
        this.updateCanvasBusVehicle()
      } else {
        this.displayVehicle_Canvas()
      }
    },
    /**
     * @description stop the real time display
     */
    async stopDisplayVehicles() {
      await this.$message({
        message: 'Stop real-time bus data updates',
        type: 'warning'
      })
      if (this.timer === null) {
        await this.$message({
          message: 'Real-time bus data update has stopped',
          type: 'error'
        })
        return
      }
      clearInterval(this.timer)
      this.timer = null
    },
    /**
     * @description clear display vehicles and update the display
     */
    async clearDisplayVehicles() {
      await this.$message({
        message: 'Bus point on the map is clearing, please wait',
        type: 'warning'
      })
      this.visualVehicles = {
        vehicleIds: [],
        vehicleInfos: [],
        bearings: [],
        points: [],
        speeds: []
      }
      this.nearestVehicleData = {
        idList: [],
        vehicleIds: [],
        vehicleInfos: [],
        bearings: [],
        points: [],
        speeds: []
      }
      this.updateCanvasBusVehicle()
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
    /**
     * @description updateCanvas Pointer
     * @for CanvasLayerPointer
     */
    updateCanvasPointer() {
      let _this = this
      const ctx = _this.mapLayers.canvasLayerPointer.canvas.getContext('2d') //init
      if (!ctx) {
        return
      }
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height) //clear
      for (let k = 0; k < _this.trajData.totalPoints.length; k++) {
        let pointsList = _this.trajData.totalPoints[k]
        if (pointsList.length !== 0) {
          let pixelPart = 0
          const pixelPartUnit = 40
          for (let i = 0, len = pointsList.length; i < len - 1; i += 1) {
            //init pixels
            const pixel = _this.map.pointToPixel(pointsList[i])
            const nextPixel = _this.map.pointToPixel(pointsList[i + 1])
            pixelPart +=
                ((nextPixel.x - pixel.x) ** 2 + (nextPixel.y - pixel.y) ** 2) **
                0.5
            if (pixelPart <= pixelPartUnit) {
              // too close continue;
            }
            pixelPart = 0
            ctx.beginPath()
            // Render arrows according to render pixel distance
            if (
                Math.abs(nextPixel.x - pixel.x) > 10 ||
                Math.abs(nextPixel.y - pixel.y) > 10
            ) {
              // An arrow needs five points:
              //    start point, end point, center point, arrow endpoint 1, and arrow endpoint 2
              const midPixel = new self.BMap.Pixel(
                  (pixel.x + nextPixel.x) / 2,
                  (pixel.y + nextPixel.y) / 2
              )
              // distance of start and end
              const distance =
                  ((nextPixel.x - pixel.x) ** 2 + (nextPixel.y - pixel.y) ** 2) **
                  0.5
              // Pointer length
              const pointerLong = 4
              const aPixel = arrowPoint(
                  pointerLong,
                  midPixel,
                  distance,
                  nextPixel,
                  pixel
              ).aPixel //set arrow point
              const bPixel = arrowPoint(
                  pointerLong,
                  midPixel,
                  distance,
                  nextPixel,
                  pixel
              ).bPixel
              ctx.moveTo(aPixel.x, aPixel.y)
              ctx.lineWidth = 2
              ctx.strokeStyle = 'green'
              ctx.lineTo(midPixel.x, midPixel.y)
              ctx.lineTo(bPixel.x, bPixel.y)
              ctx.lineCap = 'round'
              ctx.stroke() //to draw
            }
          }
        }
      }
    },
    /**
     * @description updateCanvas Back
     * @for CanvasLayerBack
     */
    updateCanvasBack() {
      let _this = this
      const ctx = _this.mapLayers.canvasLayerBack.canvas.getContext('2d') //init
      if (!ctx) {
        return
      }
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height) //clear
      for (let k = 0; k < _this.trajData.totalPoints.length; k++) {
        let pointsList = _this.trajData.totalPoints[k]
        if (pointsList.length !== 0) {
          for (let i = 0, len = pointsList.length; i < len - 2; i += 1) {
            //init pixels
            const pixel = _this.map.pointToPixel(pointsList[i])
            const nextPixel = _this.map.pointToPixel(pointsList[i + 1])
            ctx.beginPath()
            ctx.moveTo(pixel.x, pixel.y)
            ctx.lineWidth = 6
            ctx.strokeStyle = '#8b8b89'
            ctx.lineTo(nextPixel.x, nextPixel.y)
            ctx.lineCap = 'round'
            ctx.stroke() //to draw
          }
        }
      }
    },

    showDetailWindow() {
      this.$refs.detailWindow.style.display = 'block'
    },
    setDetailWindowPosition() {
      //calculate the position
      let curPixel = this.map.pointToPixel(this.curVehicle.curVehiclePoint)
      let detailWindow = document.getElementById('detailWindow')
      let top = curPixel.y - detailWindow.offsetHeight - 30
      let left = curPixel.x - detailWindow.offsetWidth / 2
      //set the detailWindow Position
      this.$refs.detailWindow.style.top = top + 'px'
      this.$refs.detailWindow.style.left = left + 'px'
    },
    /**
     * @description hidden detailwindow and clear the curVehicle data
     */
    hiddenDetailWindow() {
      this.$refs.detailWindow.style.display = 'none'
      this.curVehicle.curVehiclePoint = undefined
      this.curVehicle.curVehicleInfo = {
        id: "",
        routeID: "",
        agencyID: "",
        bearing: 0.0,
        tripID: "",
        nextStop: "",
        speed: 0.0
      }
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

    async handleClearPath(index) {
      this.drawerData.line_polygons.splice(index, 1)
      this.drawerData.line_label.splice(index, 1)
      // redraw the lines
      let overlays = this.map.getOverlays()
      for (let i = 0; i < overlays.length; i++) {
        // remove path
        if (overlays[i].content == 'path: ' + index) {
          this.map.removeOverlay(overlays[i])
        }
      }
    },
    /**
     * @description clear all drawer data and update the display
     */
    clearAllDraw() {
      let _this = this
      _this.drawerData = {
        //line, rect, marker
        line_polygons: [],
        line_label: [],
        rect_polygons: [],
        rect_label: [],
        marker_polygons: [],
        marker_label: [],
        marker_points: [],
        overlayIdx: []
      }
      _this.nearestTrajData = {
        //nearest data
        idList: [],
        trajectories: [],
        weights: [],
        totalPoints: [],
        stopData: []
      }
      _this.nearestVehicleData = {
        idList: [],
        vehicleIds: [],
        vehicleInfos: [],
        bearings: [],
        points: [],
        speeds: []
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
    },
    /**
     * @description update visualdata by realTimeDate
     */
    async updataVisualData() {
      let _this = this
      _this.realTimeDate = _this.realTimeDatePick
          .toLocaleDateString()
          .replaceAll('/', '-')
      await _this.$refs.arrivalTimeChart.updateArrivalTimeChartData(
          _this.realTimeDate
      )
    },
    submitRoutes() {
      let _this = this
      _this.$refs.routeChart.updateRouteChart(
          _this.selectedRouteList,
          _this.realTimeDate
      )
    },
    submitTrips() {
      let _this = this
      _this.$refs.tripChart.updateTripChart(
          _this.selectedTripList,
          _this.realTimeDate
      )
    },
    /**
     * @description Displays stop information on the map based on the selected row
     * @param row
     */
    clickStopRow(row) {
      let _this = this
      let point = new BMap.Point(row.lng, row.lat)
      _this.map.panTo(point) //set the map center
      _this.map.zoom(18)
      let layer = _this.mapLayers.canvasLayerStopText
      if (!layer.zr) {
        layer.zr = zrender.init(layer.canvas)
        layer.zr.resize()
      }
      if (_this.displayStopData.stopIdList.indexOf(row.stopId) === -1) {
        //update display data
        _this.displayStopData.stopIdList.push(row.stopId)
        _this.displayStopData.stopNameList.push(row.stopName)
        _this.displayStopData.stopTimeList.push(row.arrivalTime)
        _this.displayStopData.stopPointList.push(point)
        let pixel = _this.map.pointToPixel(point)
        let text = new zrender.Text({
          // draw the text label
          style: {
            textFill: 'rgb(0,0,0)',
            text: row.stopName + ' ' + row.stopTime,
            fontSize: 14
          },
          position: [pixel.x + 10, pixel.y + 10]
        })
        layer.zr.add(text)
        setTimeout(() => {
          //setTimeout to clear the data
          let tempIdx = _this.displayStopData.stopIdList.indexOf(row.stopId)
          _this.displayStopData.stopIdList.splice(tempIdx, 1)
          _this.displayStopData.stopNameList.splice(tempIdx, 1)
          _this.displayStopData.stopPointList.splice(tempIdx, 1)
          _this.displayStopData.stopTimeList.splice(tempIdx, 1)
        }, 5000)
      }
    },
    mouseMove(event) {
      this.mouseX = event.pageX
      this.mouseY = event.pageY
      return true
    }
  }
}
</script>





