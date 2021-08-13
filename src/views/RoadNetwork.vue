<template>
  <div style="width: 100%; height: 889px; position: relative">
    <div id="MAps"></div>
    <!-- <el-checkbox-group v-model="checkList" class="checkgroup">
      <el-checkbox v-model="checked1" label="路网" border></el-checkbox>
      <el-checkbox v-model="checked2" label="卫星" border></el-checkbox>
    </el-checkbox-group> -->
    <!-- <div class="checkgroup">
      <el-checkbox v-model="RoadNet" label="路网" @change="RoadNet ? map.add(roadNetLayer) : map.remove(roadNetLayer)" border></el-checkbox>
      <el-checkbox v-model="Satellite" label="卫星" @change="Satellite ? map.add(satelliteLayer) : map.remove(satelliteLayer)" border></el-checkbox>
      <el-checkbox v-model="Traffic" label="实时路况" @change="Traffic ? map.add(TrafficLayer) : map.remove(TrafficLayer)" border></el-checkbox>
      <el-checkbox v-model="Buildings" label="楼快" @change="Buildings ? map.add(BuildingsLayer) : map.remove(BuildingsLayer)" border></el-checkbox>
    </div> -->
    <div class="checkgroup">
      <div class="check-box" @mouseover="selectStyle" @mouseout="outStyle">
        <span class="check-left"><i class="iconfont icon-tuceng"></i>图层<i :class="isShow ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i></span
        ><span class="check-right">OFF - ON</span>
        <ul v-show="isShow">
          <li>
            <div class="ifont"><i class="iconfont icon-ziyuan2"></i>&ensp;路网</div>
            <el-switch
              v-model="RoadNet"
              active-text="ON"
              inactive-text="OFF"
              :width="60"
              inactive-color="#8CC5FF"
              @change="RoadNet ? map.add(roadNetLayer) : map.remove(roadNetLayer)"
            >
            </el-switch>
          </li>
          <li>
            <div class="ifont"><i class="iconfont icon-weixing"></i>&ensp;卫星</div>
            <el-switch
              v-model="Satellite"
              active-text="ON"
              inactive-text="OFF"
              :width="60"
              inactive-color="#8CC5FF"
              @change="Satellite ? map.add(satelliteLayer) : map.remove(satelliteLayer)"
            >
            </el-switch>
          </li>
          <li>
            <div class="ifont"><i class="iconfont icon-shishilukuang"></i>&ensp;实时路况</div>
            <el-switch
              v-model="Traffic"
              active-text="ON"
              inactive-text="OFF"
              :width="60"
              inactive-color="#8CC5FF"
              @change="Traffic ? map.add(TrafficLayer) : map.remove(TrafficLayer)"
            >
            </el-switch>
          </li>
          <li>
            <div class="ifont"><i class="iconfont icon-jianzhu"></i>&ensp;楼快</div>
            <el-switch
              v-model="Buildings"
              active-text="ON"
              inactive-text="OFF"
              :width="60"
              inactive-color="#8CC5FF"
              @change="Buildings ? map.add(BuildingsLayer) : map.remove(BuildingsLayer)"
            >
            </el-switch>
          </li>
          <li>
            <div class="ifont"><i class="iconfont icon-relitu"></i>&ensp;热力图</div>
            <el-switch
              v-model="heatMaps"
              active-text="ON"
              inactive-text="OFF"
              :width="60"
              inactive-color="#8CC5FF"
              @change="heatMaps ? heatmap.show() : heatmap.hide()"
            >
            </el-switch>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import wcJson from "../json/response_1628238808198.json";
import heatmapData from "../json/heatMap.json";
export default {
  name: "RoadNetwork",
  data() {
    return {
      map: {},
      circles: [],
      markers: [],
      cluster: [],
      wcJsonData: [],
      RoadNet: false,
      Satellite: false,
      Traffic: false,
      Buildings: false,
      isShow: false,
      heatMaps: false,
      heatmap: null,
      layers: [],
      roadNetLayer: new AMap.TileLayer.RoadNet(),
      satelliteLayer: new AMap.TileLayer.Satellite(),
      TrafficLayer: new AMap.TileLayer.Traffic(),
      BuildingsLayer: new AMap.Buildings(),
      checkList: [0],
      WC: require("../assets/images/WC.png"),
      WCdisabled: require("../assets/images/WCdisabled.png"),
    };
  },
  components: {},
  watch: {
    checkList(val, newval) {
      // console.log(this.checkList.length);
      // if (this.checkList.length) {
      //   this.layers = [new AMap.TileLayer.RoadNet(), new AMap.Buildings()];
      //   this.initMaps();
      // } else {
      //   this.layers = [new AMap.TileLayer.Satellite()];
      //   this.initMaps();
      // }
    },
  },
  methods: {
    selectStyle() {
      this.isShow = true;
    },
    outStyle() {
      this.isShow = false;
    },
    initMaps() {
      if (!this.isSupportCanvas()) {
        alert("热力图仅对支持canvas的浏览器适用,您所使用的浏览器不能使用热力图功能,请换个浏览器试试~");
      }
      // 配置地图的基本显示
      let that = this;
      that.map = new AMap.Map("MAps", {
        center: [112.939981, 28.231061],
        // layers: [new AMap.TileLayer.RoadNet()],
        resizeEnable: true,
        zoom: 9,
      });
      //添加标记
      let wcJsonData = wcJson.data;
      this.wcJsonData = wcJsonData;
      let wcDisabled = wcJson.disabledData;
      var wcDisabledData = [];
      for (let i = 0; i < wcDisabled.length; i++) {
        // this.wcJsonData = this.wcJsonData.filter((o) => o.address != wcDisabled[i].address);
        let DisabledData = this.wcJsonData.findIndex((o) => o.address == wcDisabled[i].address);
        wcDisabledData.push(DisabledData);
      }
      console.log(wcDisabledData);
      for (let i = 0; i < this.wcJsonData.length; i++) {
        let WCMarker = new AMap.Marker({
          position: new AMap.LngLat(wcJsonData[i].location.split(",")[0], wcJsonData[i].location.split(",")[1]),
          // 将一张图片的地址设置为 icon
          icon: new AMap.Icon({
            image: this.WC,
            size: new AMap.Size(20, 20),
            imageSize: new AMap.Size(20, 20),
          }),
          // 设置了 icon 以后，设置 icon 的偏移量，以 icon 的 [center bottom] 为原点
          // offset: new AMap.Pixel(-13, -30),
          // map: this.map,
          title: wcJsonData[i].name,
        });
        WCMarker.info = new AMap.InfoWindow({
          content: wcJsonData[i].name,
          // offset: new AMap.Pixel(0, -30),
        });
        WCMarker.on("mouseover", function (e) {
          e.target.info.open(this.map, e.target.getPosition());
        });
        this.markers.push(WCMarker);
      }
      for (let index = 0; index < wcDisabledData.length; index++) {
        // removeMarkers(markers:Array<Marker>)
        this.markers[wcDisabledData[index]].setIcon(
          new AMap.Icon({
            image: this.WCdisabled,
            size: new AMap.Size(48, 48),
            imageSize: new AMap.Size(48, 48),
            offset: new AMap.Pixel(-60, -60),
          })
        );
        // offset: new AMap.Pixel(-13, -30),
        this.circleMark(wcJsonData[wcDisabledData[index]].location);
      }

      //行政区修改样式
      let disProvince = new AMap.DistrictLayer.Province({
        zIndex: 12,
        adcode: [430100],
        depth: 2,
        styles: {
          fill: function (properties) {
            var adcode = properties.adcode;
            return that.getColorByAdcode(adcode);
          },
          "province-stroke": "cornflowerblue",
          "city-stroke": "white", // 中国地级市边界
          "county-stroke": "rgba(255,255,255,0.5)", // 中国区县边界
        },
      });
      //半径、层数、中心点、{填充颜色、初始透明度}
      // that.CircleShow(600, 5, { fillColor: "#FF4D50", fillOpacity: 0.5 });
      //参数：每一层播放的间隔时间、每一层扩散至最大所花费的总时间。
      //循环每一层执行动画
      // for (let [index, circle] of this.circles) {
      //   animateStart(new Date().getTime() + index * distance, circle, index);
      // }
      disProvince.setMap(this.map);
      // this.map.setFitView();
    },
    createHeatMap() {
      if (!this.isSupportCanvas()) {
        return this.$msg.error("热力图仅对支持canvas的浏览器适用,您所使用的浏览器不能使用热力图功能,请换个浏览器试试。");
      }
      let __this = this;
      this.map.plugin(["AMap.Heatmap"], function () {
        //初始化heatmap对象
        __this.heatmap = new AMap.Heatmap(__this.map, {
          visible: true,
          radius: 25, //给定半径
          opacity: [0, 0.8],
        });
        //设置数据集：该数据为北京部分“公园”数据
        __this.heatmap.setDataSet({
          data: heatmapData,
          max: 100,
        });
      });
      __this.heatmap.hide();
    },
    //圆形标记
    circleMark(location) {
      let circleNum = 0;
      let circleNumTwo = 0;
      let circleNumThree = 0;
      let cricleArr = [];
      for (let i = 0; i < 3; i++) {
        let circleMarker = new AMap.Circle({
          center: new AMap.LngLat(location.split(",")[0], location.split(",")[1]),
          radius: 1, //半径
          borderWeight: 3,
          strokeColor: "#FF4D50",
          strokeOpacity: 0.2,
          strokeWeight: 1,
          strokeOpacity: 0.2,
          fillOpacity: 0.2,
          strokeStyle: "dashed",
          // strokeDasharray: [10, 10],
          // 线样式还支持 'dashed'
          fillColor: "#FF4D50",
          zIndex: 50,
        });
        cricleArr.push(circleMarker);
        cricleArr.forEach((item) => {
          this.map.add(item);
          // console.log(item);
        });
        this.CircleNumId = setInterval(() => {
          cricleArr[0].setRadius((circleNum += 20));
          if (circleNum > 200) {
            circleNum = 0;
          }
        }, 400);
        setTimeout(() => {
          this.CircleNumIdTwo = setInterval(() => {
            cricleArr[1].setRadius((circleNumTwo += 20));
            if (circleNumTwo > 200) {
              circleNumTwo = 0;
            }
          }, 400);
        }, 1200);
        setTimeout(() => {
          this.CircleNumIdThree = setInterval(() => {
            cricleArr[2].setRadius((circleNumThree += 20));
            if (circleNumThree > 200) {
              circleNumThree = 0;
            }
          }, 400);
        }, 2400);
        // circleMarker.setMap(this.map)
        // 缩放地图到合适的视野级别
        // this.map.setFitView([ circleMarker ])
      }
    },
    //判断浏览区是否支持canvas
    isSupportCanvas() {
      var elem = document.createElement("canvas");
      return !!(elem.getContext && elem.getContext("2d"));
    },
    //行政区颜色
    getColorByAdcode(adcode) {
      let colors = {};
      if (!colors[adcode]) {
        var gb = Math.random() * 155 + 50;
        colors[adcode] = "rgba(" + gb + "," + gb + ",255,0.2)";
      }
      return colors[adcode];
    },
    //自定义点聚合样式
    _renderClusterMarker(context) {
      let count = this.markers.length;
      var factor = Math.pow(context.count / count, 1 / 20);
      var div = document.createElement("div");
      div.style.backgroundImage = "url(" + require("../assets/images/WC.png") + ")";
      div.style.backgroundSize = "100% 100%";
      var size = Math.round(30 + Math.pow(context.count / count, 1 / 5) * 20);
      div.style.width = div.style.height = size + "px";
      div.innerHTML = context.count;
      div.style.lineHeight = size + "px";
      div.style.color = "transparent";
      div.style.fontSize = "14px";
      div.style.textAlign = "center";
      context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2));
      context.marker.setContent(div);
    },
    //添加标记
    addPoint() {
      this.cluster = new AMap.MarkerClusterer(this.map, this.markers, {
        // styles: sts,
        renderClusterMarker: this._renderClusterMarker,
        gridSize: 80,
      });
    },
    /*公交站点查询*/
    stationSearch() {
      let that = this;
      let stationKeyWord = "长沙公交车站";
      if (!stationKeyWord) return;
      //实例化公交站点查询类
      var station = new AMap.StationSearch({
        pageIndex: 1, //页码
        pageSize: 120, //单页显示结果条数
        city: "183", //确定搜索城市
      });
      // let queryResult = [];
      station.search(stationKeyWord, function (status, result) {
        if (status === "complete" && result.info === "OK") {
          console.log(result.stationInfo);
          // that.queryResult = result.stationInfo;
          that.stationSearch_CallBack(result.stationInfo);
        }
      });
      console.log(that.queryResult);
    },
    stationSearch_CallBack(searchResult) {
      for (let i = 0; i < searchResult.length; i++) {
        console.log(searchResult[i]);
      }
    },
  },
  async mounted() {
    await this.initMaps();
    this.addPoint();
    this.createHeatMap();
    this.stationSearch();
  },
};
</script>

<style scoped lang="scss">
#MAps {
  width: 100%;
  height: 100%;
}
.checkgroup {
  position: absolute;
  left: 0;
  top: 0;
  background-color: #fff;
  .check-box {
    position: relative;
    width: 200px;
    height: 34px;
    border-radius: 5px;
    background-color: #fff;
    color: #333;
    span {
      margin-left: 0px !important;
      display: inline-block;
      line-height: 24px;
      font-size: 14px;
      cursor: pointer;
      text-align: center;
    }
    // .check-left::hover,
    // .check-right::hover {
    // }
    .check-left {
      width: 52%;
      padding: 5px;
      position: relative;
      .icon-tuceng {
        position: absolute;
        left: 1rem;
        top: 0.3rem;
      }
      .el-icon-arrow-down,
      .el-icon-arrow-up {
        position: absolute;
        left: 5.5rem;
        top: 0.6rem;
      }
    }
    .check-left::after {
      position: absolute;
      top: 0.6em;
      right: 0;
      content: "";
      width: 0;
      height: 17px;
      line-height: 24px;
      border-left: solid rgb(224, 224, 230) 1px;
    }
    .check-right {
      width: 37%;
      padding: 5px;
      // border-left: 2px solid #fff;
    }
    ul {
      width: 100%;
      list-style: none;
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 31px;
      left: 0;
      li {
        width: 190px;
        height: 24px;
        padding: 5px;
        font-size: 14px;
        line-height: 24px;
        background-color: #fff;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .ifont {
          width: 55%;
          height: 100%;
          line-height: 24px;
        }
        .el-switch {
          width: 30%;
          line-height: 24px;
          margin-left: 30px;
          padding-right: 10px;
        }
        /deep/.el-switch__label--right {
          margin-left: -27px;
          z-index: 125;
          line-height: 21px !important ;
          color: #333 !important;
        }
        /deep/.el-switch__label--left {
          margin-right: -31px;
          z-index: 125;
          line-height: 21px !important ;
          color: #333 !important;
        }
        /deep/.el-switch__label * {
          font-size: 12px !important ;
        }
        /deep/.el-switch__core:after {
          z-index: 127;
        }
      }
      li:last-child {
        border-end-end-radius: 5px;
      }
    }
  }
}
</style>
