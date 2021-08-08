<template>
  <div style="width: 100%; height: 889px; position: relative">
    <div id="MAps"></div>
    <!-- <el-checkbox-group v-model="checkList" class="checkgroup">
      <el-checkbox v-model="checked1" label="路网" border></el-checkbox>
      <el-checkbox v-model="checked2" label="卫星" border></el-checkbox>
    </el-checkbox-group> -->
    <div class="checkgroup">
      <el-checkbox v-model="RoadNet" label="路网" @change="RoadNet ? map.add(roadNetLayer) : map.remove(roadNetLayer)" border></el-checkbox>
      <el-checkbox v-model="Satellite" label="卫星" @change="Satellite ? map.add(satelliteLayer) : map.remove(satelliteLayer)" border></el-checkbox>
      <el-checkbox v-model="Traffic" label="实时路况" @change="Traffic ? map.add(TrafficLayer) : map.remove(TrafficLayer)" border></el-checkbox>
      <el-checkbox v-model="Buildings" label="楼快" @change="Buildings ? map.add(BuildingsLayer) : map.remove(BuildingsLayer)" border></el-checkbox>
    </div>
  </div>
</template>

<script>
import wcJson from "../json/response_1628238808198.json";
import wcimg from "../assets/images/WC.png";
export default {
  name: "RoadNetwork",
  data() {
    return {
      map: {},
      markers: [],
      cluster: [],
      RoadNet: true,
      Satellite: false,
      Traffic: false,
      Buildings: false,
      layers: [],
      roadNetLayer: new AMap.TileLayer.RoadNet(),
      satelliteLayer: new AMap.TileLayer.Satellite(),
      TrafficLayer: new AMap.TileLayer.Traffic(),
      BuildingsLayer: new AMap.Buildings(),
      checkList: [0],
      WC: require("../assets/images/WC.png"),
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
    initMaps() {
      // 配置地图的基本显示
      let that = this;
      that.map = new AMap.Map("MAps", {
        center: [112.939981, 28.231061],
        // layers: this.layers,
        resizeEnable: true,
        zoom: 9,
      });
      //添加标记
      let wcJsonData = wcJson.data;
      for (let i = 0; i < wcJsonData.length; i++) {
        let WCMarker = new AMap.Marker({
          position: new AMap.LngLat(wcJsonData[i].real_lon, wcJsonData[i].real_lat),
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
      disProvince.setMap(this.map);
      // this.map.setFitView();
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
  },
  async mounted() {
    await this.initMaps();
    this.addPoint();
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
}
</style>
