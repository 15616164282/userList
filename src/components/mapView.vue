<template>
  <div class="">
    <div id="map">
      <!--地图信息弹窗-->
      <div class="overlay-container">
        <div id="overlay" class="ol-popup">
          <h1 class="pop-title">
            <span class="name">{{ siteDesObj.slagName }}</span>
            <span class="close" @click="closeOverlay()">X</span>
          </h1>
          <div style="margin: 10px; padding-left: 10px; border-left: 3px solid rgb(52, 137, 255)">基本信息</div>
          <ul>
            <li style="width: 100%">
              所属管控单元：
              <span class="gkdymc">{{ siteDesObj.hjgkdymc }}</span>
            </li>
            <li style="width: 100%">
              风险源级别：<span class="gkdymc">{{ siteDesObj.risk_grade }}</span>
            </li>
            <li style="width: 100%">
              地址：<span>{{ siteDesObj.address }}</span>
            </li>
            <li style="width: 100%">
              所属企业：<span>{{ siteDesObj.enterprise }}</span>
            </li>
            <li style="width: 100%">
              矿种(主要成分)：<span>{{ siteDesObj.components }}</span>
            </li>
            <li style="width: 100%">
              固废属性：<span>{{ siteDesObj.property }}</span>
            </li>
            <li style="width: 100%">
              联系人：<span>{{ siteDesObj.contact }}</span>
            </li>
            <li style="width: 100%">
              联系电话：<span>{{ siteDesObj.contactPhone }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="left-echarts">
        <div>
          <div class="echarts-title">
            <h4>有害垃圾总量变化趋势</h4>
            <div style="width: 245px; display: flex; flex-direction: row; justify-content: space-between">
              <el-select v-model="categoryValue" placeholder="请选择" size="small">
                <el-option v-for="item in options" :key="item" :value="item"> </el-option>
              </el-select>
              <el-date-picker v-model="categoryYear" size="small" type="year" placeholder="选择年" style="width: 189px"> </el-date-picker>
            </div>
          </div>
          <div id="category" class="category"></div>
        </div>
        <div>
          <div class="echarts-title">
            <h4>有害垃圾地区排放量统计</h4>
            <el-date-picker v-model="categoryYear" size="small" type="year" placeholder="选择年" style="width: 109px"> </el-date-picker>
          </div>
          <div id="bar" class="bar"></div>
        </div>

        <div>
          <div class="echarts-title">
            <h4>有害垃圾地区排放公司</h4>
          </div>
          <div class="companys">
            <ul>
              <li v-for="(item, i) in pointsData" :key="i" @click="companyPoint(item)">
                <el-tooltip class="item" effect="light" :content="item.slagName" placement="top">
                  <span>{{ item.slagName }}</span>
                </el-tooltip>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//ol组件，按需引用
import "ol/ol.css";
import { Map, Feature, View, Overlay } from "ol";
import { Point } from "ol/geom";
import { Vector as VectorSource, OSM, XYZ, TileArcGISRest, TileWMS } from "ol/source";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { Circle, Fill, Stroke, Style, Text, Icon } from "ol/style";
// import {RenderFunction} from "ol/style/Style";
import { click, pointerMove, altKeyOnly } from "ol/events/condition";
import { Select, Draw } from "ol/interaction";
import { defaults as defaultControls, ScaleLine } from "ol/control";
import GeoJSON from "ol/format/GeoJSON.js";
import EsriJSON from "ol/format/EsriJSON.js";
import { easeOut } from "ol/easing";
import { unByKey } from "ol/Observable";
//echarts引用
import * as echarts from "echarts";
//模拟数据
// import pljData from "../json/plj";
// import contourData from "../json/contour";
import pointsData from "../json/points.json";
import company from "../json/company.json";
export default {
  name: "mapView",
  data() {
    return {
      map: null,
      center: [107.246058, 26.644852],
      overlay: null,
      siteDesObj: {},
      overlayId: 1,
      // overlayContent: "",
      pointImage: {
        normal: require("../assets/point_normal.png"),
        selected: require("../assets/point_selected.png"),
      },
      layers: {
        pointLayer: null,
        riverLayer: null,
        contourLayer: null,
        drawLayer: null,
      },
      pointsData: pointsData,
      //plot
      plotFunctions: null,
      companyEcharts: company.echarts,
      echartsTitle: "总排放量（mg TEQ）",
      categoryYear: "2021",
      categoryValue: "全部",
      options: {},
    };
  },
  components: {},
  methods: {
    getArrayProps(array, key) {
      var key = key || "value";
      var res = [];
      if (array) {
        array.forEach(function (t) {
          res.push(t[key]);
        });
      }
      return res;
    },
    initChart1() {
      let myChart = echarts.init(document.getElementById("category"));
      myChart.setOption(
        {
          title: {
            text: this.echartsTitle,
            textStyle: {
              fontSize: 14,
              fontWeight: "normal",
            },
          },
          grid: {
            x: 35,
            x2: 30,
            y: 30,
            y2: 50,
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: "line", // 默认为直线，可选为：'line' | 'shadow'
            },
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: this.getArrayProps(this.companyEcharts.categoryData, "name"),
            axisTick: {
              show: false, //不显示坐标轴刻度线
            },
          },
          yAxis: {
            type: "value",
            // splitLine: {
            //   //网格线
            //   show: false,
            // },
          },
          series: [
            {
              // data: [820, 932, 901, 934, 1290, 1330, 1320],
              data: this.getArrayProps(this.companyEcharts.categoryData, "value"),
              type: "line",
              areaStyle: {},
              smooth: true,
            },
          ],
        },
        true
      );
    },
    initChart2() {
      let myChart = echarts.init(document.getElementById("bar"));
      myChart.setOption(
        {
          title: {
            text: this.echartsTitle,
            textStyle: {
              fontSize: 14,
              fontWeight: "normal",
            },
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
            },
          },
          legend: {
            data: this.companyEcharts.echartLegend,
            left: "right",
            textStyle: {
              color: "#333",
            },
          },
          grid: {
            // top: "13%",
            // left: "0%",
            // right: "4%",
            // bottom: "3%",
            // containLabel: true,
            x: 35,
            x2: 30,
            y: 30,
            y2: 50,
          },
          xAxis: [
            {
              type: "category",
              data: this.getArrayProps(this.companyEcharts.barData, "name"),
              axisTick: {
                alignWithLabel: true,
              },
              boundaryGap: false,
              axisTick: {
                show: false, //不显示坐标轴刻度线
              },
              axisLabel: { rotate: 30 },
            },
          ],
          yAxis: [
            {
              type: "value",
              scale: true,
              max: 100,
              min: 0,
              splitNumber: 10,
              boundaryGap: [0.2, 0.2],
            },
          ],
          series: [
            {
              name: "二噁英",
              type: "bar",
              barWidth: "20%",
              data: this.getArrayProps(this.companyEcharts.barData, "value"),
            },
          ],
        },
        true
      );
    },
    //初始化地图
    initMap() {
      this.map = new Map({
        //地图div id
        target: "map",
        //图层，可以添加多个，也可以之后再添加
        //crossOrigin: 'anonymous' 为跨域地图的处理，不然canvas不能导出图片
        layers: [
          //街景地图
          new TileLayer({
            source: new OSM(),
            crossOrigin: "anonymous",
          }),
          //XYZ地图
          new TileLayer({
            source: new XYZ({
              url: "http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=469cfd9c133f30baaf3f94a9cd848c47",
              crossOrigin: "anonymous",
            }),
          }),
          new TileLayer({
            source: new XYZ({
              url: "http://t1.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=469cfd9c133f30baaf3f94a9cd848c47",
              crossOrigin: "anonymous",
            }),
          }),
        ],
        //视图，这里设置坐标系
        view: new View({
          center: this.center,
          zoom: 7.8,
          minZoom: 7,
          maxZoom: 18,
          projection: "EPSG:4326",
        }),
        //控制组件：比例尺
        controls: defaultControls().extend([new ScaleLine()]),
      });

      //添加点位图层
      this.layers.pointLayer = new VectorLayer({
        source: new VectorSource(),
        //设置渲染方式
        renderMode: "vector",
        //渲染方式为"vector"时，图层可以在交互时渲染
        updateWhileInteracting: true,
        //渲染方式为"ventor"时，图层可以在移动时渲染，可以解决地图移动结束以后点位图标才改变的情况
        updateWhileAnimating: true,
      });
      this.map.addLayer(this.layers.pointLayer);
      this.layers.pointLayer.setZIndex(0);

      //初始化信息窗口
      this.overlay = new Overlay({
        element: document.getElementById("overlay"),
        autoPan: true,
        autoPanAnimation: {
          duration: 250,
        },
        offset: [0, -30],
      });
      this.map.addOverlay(this.overlay);

      //点击,使用箭头函数，让里面的this指向不改变
      const clickSelect = new Select({
        condition: click,
        layers: [this.layers.pointLayer],
      });
      clickSelect.on("select", (e) => {
        const features = e.selected;
        features.forEach((feature) => {
          if (feature === this.selectedByAttriFeature) {
            return;
          }
          this.onPointClick(feature, feature.getProperties().geometry.flatCoordinates);
        });
      });
      clickSelect.on("deselect", (e) => {});
      this.map.addInteraction(clickSelect);
    },
    // 添加点位数据
    addPoint(x, y, attributes) {
      const point = new Feature({
        geometry: new Point([x, y]),
        type: "point",
      });
      point.setStyle(
        new Style({
          image: new Icon({
            src: this.pointImage.normal,
            anchor: [0.5, 0.5], //锚点
          }),
          zIndex: 110,
        })
      );
      point.setProperties(attributes);
      //设置点位id，这样可以用source.getFeatureById 找到
      point.setId(attributes.id);

      this.layers.pointLayer.getSource().addFeature(point);
    },
    //点位数据加载
    onButton1Click() {
      pointsData.forEach((point) => {
        this.addPoint(point.longitude, point.latitude, {
          name: point.slagName,
          id: point.id,
        });
      });
    },
    // 点位波纹样式
    highLight(clickedFeature) {
      const duration = 2000;
      let start = new Date().getTime();
      let highLightedFeature;

      //点击事件传入点击的feature，首先与上一个点对比，如果是同一个点，则不执行
      if (clickedFeature === this.selectedByAttriFeature) {
        return;
      }

      const listenerKey = this.map.on("postcompose", (event) => {
        const feature = this.selectedByAttriFeature;
        //如果当前没有点选的点位，则取消事件
        if (!feature) {
          unByKey(listenerKey);
          return;
        }
        //如果点选了其他点位，则取消事件
        if (highLightedFeature && highLightedFeature !== feature) {
          unByKey(listenerKey);
          return;
        }
        if (!highLightedFeature) {
          highLightedFeature = feature;
        }

        //style生成
        const flashGeom = feature.getGeometry().clone();
        const elapsed = event.frameState.time - start;
        const elapsedRatio = elapsed / duration;
        // radius will be 5 at start and 30 at end.
        const radius = easeOut(elapsedRatio) * 25 + 5;
        const opacity = easeOut(1 - elapsedRatio);
        const style = new Style({
          image: new Circle({
            radius: radius,
            stroke: new Stroke({
              color: "rgba(255, 0, 0, " + opacity + ")",
              width: 0.25 + opacity,
            }),
            fill: new Fill({
              color: "rgba(255, 0, 0, " + opacity / 3 + ")",
            }),
          }),
        });
        event.vectorContext.setStyle(style);
        event.vectorContext.drawGeometry(flashGeom);
        //设置重复运行
        if (elapsed > duration) {
          start = new Date().getTime();
        }
        this.map.render();
      });
    },
    //公司点击事件
    companyPoint(item) {
      let vectorSource = this.layers.pointLayer.getSource().getFeatureById(item.id);
      this.onPointClick(vectorSource);
    },
    //点位点击事件
    onPointClick(feature) {
      const attributes = feature.getProperties();
      //信息窗
      this.overlay.setPosition(attributes.geometry.flatCoordinates);
      // this.overlayContent = attributes.name;
      this.siteDesObj = pointsData[attributes.id];
      //高亮动画
      // this.highLight(feature);
      //更改图标
      feature.setStyle(
        new Style({
          image: new Icon({
            src: this.pointImage.selected,
            anchor: [0.5, 0.5], //锚点
          }),
          zIndex: 110,
        })
      );

      //设置清除上一个点(注意顺序)
      // this.clearSelectByAttribute();
      // this.selectedByAttriFeature = feature;
      //地图中心移动
      this.panToCoordinate(attributes.geometry.flatCoordinates);
      //刷新图层（如果改变了图标，这一步是必要的）
      this.layers.pointLayer.getSource().addFeature(feature);
      // this.layers.pointLayer.getSource().refresh();
    },
    //移动地图至点位
    panToCoordinate(coordinate) {
      this.map.getView().animate({
        center: coordinate,
        duration: 500,
      });
    },
    //清除上一个选择的点位 注意：会将所有点位清楚
    clearSelectByAttribute() {
      if (this.selectedByAttriFeature) {
        this.selectedByAttriFeature.getStyle().setImage(
          new Icon({
            src: this.pointImage.normal,
            anchor: [0.5, 0.5], //锚点
          })
        );
        this.selectedByAttriFeature = null;
      }
      //刷新图层
      this.layers.pointLayer.getSource().refresh();
    },
    //关闭信息窗口
    closeOverlay() {
      const interactions = this.map.getInteractions();

      this.overlay.setPosition(undefined);
      // this.clearSelectByAttribute();
    },
  },
  mounted() {
    this.initMap();
    this.onButton1Click();
    this.initChart1();
    this.initChart2();
  },
};
</script>

<style scoped lang="scss">
#map {
  width: 100%;
  height: calc(100vh - 79px);
  position: relative;
}
.overlay-container {
  display: none;
}
.ol-popup {
  position: absolute;
  background-color: white;
  -webkit-filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  bottom: 12px;
  left: -50px;
  min-width: 400px;
  text-align: left;
}

.ol-popup:after,
.ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}

.ol-popup:after {
  border-top-color: white;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}

.ol-popup:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}

.no-coords-overlay {
  position: absolute;
  width: 350px;
  top: 100px;
  right: 400px;
  z-index: 10;
  background: #fff;
  /*box-shadow: 1px 1px 8px #f1f1f1;*/
  text-align: left;
}

.pop-title {
  margin: 0;
  font-size: 14px;
  color: #fff;
  padding: 0 10px;
  line-height: 40px;
  width: calc(100% - 20px);
  height: 40px;
  text-align: left;
  background: #3393cf;

  position: relative;
  display: flex;
  justify-content: space-between;
  span {
    display: inline-block;
  }
  span.name {
    width: 280px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  span.close {
    font-size: 14px;
    cursor: pointer;
  }
}

.ol-popup {
  ul {
    display: flex;
    flex-wrap: wrap;
    margin: 0 auto;
    width: 95%;
    li {
      width: 50%;
      line-height: 26px;
      color: #999;
      font-size: 14px;
      list-style: none;
      span {
        color: #6492ff;
      }
    }
  }
}
.left-echarts {
  width: 450px;
  height: calc(100% - 0px);
  position: absolute;
  top: 0;
  left: 0;
  z-index: 900;
  // background-color: #fff;
  display: flex;
  flex-direction: column;
  .echarts-title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    h4 {
      width: 200px;
      height: 32px;
      padding: 0 10px;
      line-height: 32px;
      margin-right: 5px;
      color: #fff;
      background: url("../assets/images/title-bj.png") no-repeat;
      background-size: 100% 100%;
    }
  }
  .category,
  .bar {
    width: 100%;
    height: 200px;
  }
  .companys {
    height: 320px;
    padding: 10px;
    ul {
      list-style: none;
      display: flex;
      flex-direction: column;
      li {
        width: 100%;
        height: 25px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
      }
    }
  }
  > div:nth-child(-n + 3) {
    width: 100%;
    margin-bottom: 5px;
    background-color: #fff;
    background: url("../assets/images/bj.png") no-repeat;
    background-size: 100% 100%;
  }
}
</style>
