<template>
  <div id="BusRoute_Chart"></div>
</template>
<script>
import * as echarts from "echarts/core";
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from "echarts/components";
import { LineChart } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
]);
const colorList = [
  "rgba(227,134,82,0.2)",
  "rgba(187,98,26,0.2)",
  "rgba(219, 107, 113,0.2)",
  "rgba(213, 157, 183,0.2)",
  "rgba(149, 112, 167,0.2)",
  "rgba(206, 78, 18,0.2)",
  // 'rgba(61,138,52,0.1)',
  // 'rgba(36,189,21,0.1)',
  // 'rgba(83,172,11,0.1)',
  // 'rgba(52,138,85,0.1)',
  // 'rgba(24,142,79,0.1)',
  // 'rgba(62,254,43,0.1)',
  // 'rgba(23,143,115,0.1)',
  // 'rgba(7,130,165,0.1)',
  // 'rgba(14,85,136,0.1)',
  // 'rgba(231,196,53,0.1)',
  // 'rgba(33,80,28,0.1)',
];
export default {
  name: "BusRoute_Chart",
  data() {
    const hours = ["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23"]
    const mins = ["00", "15", "30", "45"]
    var times = []
    for(let h in hours) {
      for (let m in mins) {
        times.push(h + ":" + m)
      }
    }
    return {
      BusRoute_Chart: null,
      routesInfo: [],
      routesId: [],
      tripsInfo: [],
      tripsId: [],
      times: times
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      let _this = this;
      //init chart
      var chartDomRoute = document.getElementById("BusRoute_Chart");
      _this.BusRoute_Chart = echarts.init(chartDomRoute);
      _this.BusRoute_Chart.showLoading();
      let optionRoute = {
        title: {
          text: "Bus Route Chart",
          right: 50,
          top: 20,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        legend: {
          data: _this.routesId,
          top: 20,
          left: 0,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: _this.times,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: _this.routesInfo,
      };
      _this.BusRoute_Chart.hideLoading();
      optionRoute && _this.BusRoute_Chart.setOption(optionRoute);
    },
    async routesDataPrepare(routeList, date) {
      let _this = this;
      if (routeList.length > 0) {
        /**
         * @get, url = "/realTime/routeSpeed"
         * @dataType List<SpeedDateVo>
         */
        await _this.$axios
          .post("/api/realTime/routeSpeed", { idList: routeList, dateStr: date })
          .then((response) => {
            if (response && response.status == 200) {
              let routeDataList = response.data;
              _this.routesId = [];
              _this.routesInfo = [];
              for (let ri = 0; ri < routeDataList.length; ri++) {
                let route = routeDataList[ri];
                let routeInfo = {};
                routeInfo.name = route.id;
                routeInfo.type = "line";
                // routeInfo.stack = 'Total';
                routeInfo.symbol = "none";
                routeInfo.areaStyle = {};
                routeInfo.smooth = true;
                routeInfo.emphasis = { focus: "series" };
                routeInfo.data = [];
                routeInfo.color = colorList[ri];
                //Take two decimal places
                routeInfo.data = route.speedList.map((speed) => {
                  return speed.toFixed(2);
                });
                _this.routesId.push(route.id);
                _this.routesInfo.push(routeInfo);
              }
            } else _this.dealResponse(response);
          })
          .catch((error) => {
            _this.dealError(error);
          });
      } else {
        _this.$message({
          message: "No route is chosen",
          type: "warning",
        });
      }
    },
    async updateRouteChart(routeList, date) {
      let _this = this;
      _this.$message({
        message: "The routes chart data is loading",
        type: "success",
      });
      _this.BusRoute_Chart.showLoading();
      await _this.routesDataPrepare(routeList, date);
      //update the data
      let option = _this.BusRoute_Chart.getOption();
      option.series = _this.routesInfo;
      option.legend[0].data = _this.routesId;
      _this.BusRoute_Chart.hideLoading();
      option && _this.BusRoute_Chart.setOption(option);
    },
    dealResponse(response) {
      this.$message({
        message: "Get " + response.status + " from server",
        type: "error",
      });
    },
    dealError(error) {
      if (error.response) {
        this.$message({
          message: "Get " + error.response.status + " from server",
          type: "error",
        });
      } else if (error.request) {
        this.$message({
          message: "Request without response",
          type: "error",
        });
      } else {
        this.$message({
          message: "Request sending failed",
          type: "error",
        });
      }
      console.log(error);
    },
  },
};
</script>

<style scoped>
#BusRoute_Chart {
  height: 100%;
  width: 700px;
}
</style>