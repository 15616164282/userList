<template>
  <div style="width: 100%; height: 889px; position: relative">
    <div id="MAps"></div>
    <div class="input-card form-box" style="width: 32rem">
      <el-input v-model="form.busStop" placeholder="请输入公交车站"></el-input>
      <el-input v-model="form.busNumber" placeholder="请输入公交车号"></el-input>
      <el-button type="primary" @click="Search">查询</el-button>
    </div>
    <div id="tip"></div>
  </div>
</template>

<script>
export default {
  name: "Bus",
  data() {
    return { map: {}, busStop: "", form: {}, markers: [] };
  },
  components: {},
  methods: {
    initMaps() {
      // 配置地图的基本显示
      this.map = new AMap.Map("MAps", {
        center: [112.939981, 28.231061],
        layers: [
          // 卫星
          // new AMap.TileLayer.Satellite(),
          // 路网
          new AMap.TileLayer.RoadNet(),
        ],
        zoom: 13,
      });
    },

    Search() {
      this.stationSearch();
      this.lineSearch();
    },
    /*公交站点查询*/
    stationSearch() {
      let that = this;
      this.markers = [];
      let stationKeyWord = this.form.busStop;
      if (!stationKeyWord) return;
      //实例化公交站点查询类
      var station = new AMap.StationSearch({
        pageIndex: 1, //页码
        pageSize: 60, //单页显示结果条数
        city: "183", //确定搜索城市
      });
      station.search(stationKeyWord, function (status, result) {
        if (status === "complete" && result.info === "OK") {
          console.log(result);
          that.stationSearch_CallBack(result);
        } else {
          console.log(result);
          document.getElementById("tip").innerHTML = JSON.stringify(result);
        }
      });
    },
    /*公交站点查询返回数据解析*/
    stationSearch_CallBack(searchResult) {
      let stationArr = searchResult.stationInfo;
      let searchNum = stationArr.length;
      if (searchNum > 0) {
        document.getElementById("tip").innerHTML = "查询结果：共" + searchNum + "个相关站点";
        for (let i = 0; i < searchNum; i++) {
          var marker = new AMap.Marker({
            icon: new AMap.Icon({
              image: "//a.amap.com/jsapi_demos/static/resource/img/pin.png",
              size: new AMap.Size(32, 32),
              imageSize: new AMap.Size(32, 32),
            }),
            offset: new AMap.Pixel(-16, -32),
            position: stationArr[i].location,
            map: this.map,
            title: stationArr[i].name,
          });
          marker.info = new AMap.InfoWindow({
            content: stationArr[i].name,
            offset: new AMap.Pixel(0, -30),
          });
          marker.on("mouseover", function (e) {
            e.target.info.open(this.map, e.target.getPosition());
          });
          this.markers.push(marker);
        }
        this.map.setFitView();
      }
    },

    /*公交线路查询*/
    lineSearch() {
      let that = this;
      let busLineName = this.form.busNumber;
      if (!busLineName) return;
      //实例化公交线路查询类，只取回一条路线
      let linesearch;
      if (!linesearch) {
        linesearch = new AMap.LineSearch({
          pageIndex: 1,
          city: "长沙",
          pageSize: 1,
          extensions: "all",
        });
      }
      //搜索“536”相关公交线路
      linesearch.search(busLineName, function (status, result) {
        that.map.clearMap();
        if (status === "complete" && result.info === "OK") {
          that.lineSearch_Callback(result);
        } else {
          alert(result);
        }
      });
    },
    /*公交路线查询服务返回数据解析概况*/
    lineSearch_Callback(data) {
      let that = this;
      let lineArr = data.lineInfo;
      let lineNum = data.lineInfo.length;
      if (lineNum == 0) {
      } else {
        for (let i = 0; i < lineNum; i++) {
          let pathArr = lineArr[i].path;
          let stops = lineArr[i].via_stops;
          let startPot = stops[0].location;
          let endPot = stops[stops.length - 1].location;
          if (i == 0)
            //作为示例，只绘制一条线路
            that.drawbusLine(startPot, endPot, pathArr);
        }
      }
    },
    drawbusLine(startPot, endPot, BusArr) {
      //绘制起点，终点
      new AMap.Marker({
        map: this.map,
        position: startPot, //基点位置
        icon: "https://webapi.amap.com/theme/v1.3/markers/n/start.png",
        zIndex: 10,
        // offset: 3,
        anchor: "top-left",
      });
      new AMap.Marker({
        map: this.map,
        position: endPot, //基点位置
        icon: "https://webapi.amap.com/theme/v1.3/markers/n/end.png",
        zIndex: 10,
        // offset: 3,
        anchor: "top-left",
      });
      //绘制乘车的路线
      let busPolyline = new AMap.Polyline({
        map: this.map,
        path: BusArr,
        strokeColor: "#09f", //线颜色3
        strokeOpacity: 0.8, //线透明度
        isOutline: true,

        outlineColor: "white",
        strokeWeight: 6, //线宽
      });
      // 将 busPolyline 显示在地图中心并自动缩放地图到合适级别。
      // true表示需要动画过程，[60,200,60,60]表示上下左右避让像素
      this.map.setFitView(busPolyline, true, [60, 200, 60, 60]);
    },
  },
  mounted() {
    this.initMaps();
  },
};
</script>

<style lang="scss">
#MAps {
  width: 100%;
  height: 100%;
}
.input-card {
  background-color: #fff;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  display: flex;
  flex-direction: row;
  // .form-box {

  // }
}
// #show {
//   height: 100px;
//   width: 100px;
//   background: chocolate;
// }
// #panel {
//   position: absolute;
//   background-color: white;
//   max-height: 90%;
//   overflow-y: auto;
//   top: 10px;
//   right: 10px;
//   width: 280px;
// }
</style>
