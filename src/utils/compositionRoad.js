import vue from "vue"
import VueComposition, {
  onMounted
} from "@vue/composition-api"
vue.use(VueComposition)
import axios from "axios"

import wcJson from "../json/response_1628238808198.json";
import heatmapData from "../json/heatMap.json";

import {
  ref,
  reactive
} from "@vue/composition-api"

const state = reactive({
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
  initMaps,
  createHeatMap,
  addPoint
})

function initMaps () {
  // 配置地图的基本显示
  state.map = new AMap.Map("MAps", {
    center: [112.939981, 28.231061],
    // layers: [new AMap.TileLayer.RoadNet()],
    resizeEnable: true,
    zoom: 9,
  });
  //添加标记
  let wcJsonData = wcJson.data;
  state.wcJsonData = wcJsonData;
  let wcDisabled = wcJson.disabledData;
  var wcDisabledData = [];
  for (let i = 0; i < wcDisabled.length; i++) {
    // this.wcJsonData = this.wcJsonData.filter((o) => o.address != wcDisabled[i].address);
    let DisabledData = state.wcJsonData.findIndex((o) => o.address == wcDisabled[i].address);
    wcDisabledData.push(DisabledData);
  }
  // console.log(wcDisabledData);
  for (let i = 0; i < state.wcJsonData.length; i++) {
    let WCMarker = new AMap.Marker({
      position: new AMap.LngLat(wcJsonData[i].location.split(",")[0], wcJsonData[i].location.split(",")[1]),
      // 将一张图片的地址设置为 icon
      icon: new AMap.Icon({
        image: state.WC,
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
      e.target.info.open(state.map, e.target.getPosition());
    });
    state.markers.push(WCMarker);
  }
  for (let index = 0; index < wcDisabledData.length; index++) {
    // removeMarkers(markers:Array<Marker>)
    state.markers[wcDisabledData[index]].setIcon(
      new AMap.Icon({
        image: state.WCdisabled,
        size: new AMap.Size(48, 48),
        imageSize: new AMap.Size(48, 48),
        offset: new AMap.Pixel(-60, -60),
      })
    );
    // offset: new AMap.Pixel(-13, -30),
    circleMark(wcJsonData[wcDisabledData[index]].location);
  }

  //行政区修改样式
  let disProvince = new AMap.DistrictLayer.Province({
    zIndex: 12,
    adcode: [430100],
    depth: 2,
    styles: {
      fill: function (properties) {
        var adcode = properties.adcode;
        return getColorByAdcode(adcode);
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
  disProvince.setMap(state.map);
  // this.map.setFitView();
}
function createHeatMap () {
  this.map.plugin(["AMap.Heatmap"], function () {
    //初始化heatmap对象
    state.heatmap = new AMap.Heatmap(state.map, {
      visible: true,
      radius: 25, //给定半径
      opacity: [0, 0.8],
    });
    //设置数据集：该数据为北京部分“公园”数据
    state.heatmap.setDataSet({
      data: heatmapData,
      max: 100,
    });
  });
  state.heatmap.hide();
}
//圆形标记
function circleMark (location) {
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
      state.map.add(item);
      // console.log(item);
    });
    const CircleNumId = setInterval(() => {
      cricleArr[0].setRadius((circleNum += 20));
      if (circleNum > 200) {
        circleNum = 0;
      }
    }, 400);
    setTimeout(() => {
      const CircleNumIdTwo = setInterval(() => {
        cricleArr[1].setRadius((circleNumTwo += 20));
        if (circleNumTwo > 200) {
          circleNumTwo = 0;
        }
      }, 400);
    }, 1200);
    setTimeout(() => {
      const CircleNumIdThree = setInterval(() => {
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
}
//判断浏览区是否支持canvas
function isSupportCanvas () {
  var elem = document.createElement("canvas");
  return !!(elem.getContext && elem.getContext("2d"));
}
//行政区颜色
function getColorByAdcode (adcode) {
  let colors = {};
  if (!colors[adcode]) {
    var gb = Math.random() * 155 + 50;
    colors[adcode] = "rgba(" + gb + "," + gb + ",255,0.2)";
  }
  return colors[adcode];
}
//自定义点聚合样式
function _renderClusterMarker (context) {
  let count = state.markers.length;
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
}
//添加标记
function addPoint () {
  state.cluster = new AMap.MarkerClusterer(state.map, state.markers, {
    // styles: sts,
    renderClusterMarker: _renderClusterMarker,
    gridSize: 80,
  });
}

export default {
  state
}