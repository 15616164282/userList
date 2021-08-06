<template>
  <div style="width: 100%; height: 889px; position: relative">
    <div id="MAps"></div>
    <el-switch
      style="display: block"
      class="switch"
      v-model="value2"
      active-color="#13ce66"
      inactive-color="#ff4949"
      active-text="卫星"
      inactive-text="路网"
    >
    </el-switch>
  </div>
</template>

<script>
import wcJson from "../json/response_1628238808198.json";
export default {
  name: "RoadNetwork",
  data() {
    return { map: {}, markers: [], cluster: [], layers: [new AMap.TileLayer.RoadNet()], value2: true, WC: require("../assets/images/WC.png") };
  },
  components: {},
  watch: {
    value2(val, newval) {
      console.log(this.value2);
      if (this.value2) {
        this.layers = [new AMap.TileLayer.RoadNet(), new AMap.Buildings()];
        this.initMaps();
      } else {
        this.layers = [new AMap.TileLayer.Satellite()];
        this.initMaps();
      }
    },
  },
  methods: {
    initMaps() {
      // 配置地图的基本显示
      let that = this;
      that.map = new AMap.Map("MAps", {
        center: [112.939981, 28.231061],
        layers: this.layers,
        resizeEnable: true,
        zoom: 13,
      });
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
          map: this.map,
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

      cluster = new AMap.MarkerClusterer(map, markers, {
        styles: {
          url: "https://a.amap.com/jsapi_demos/static/images/darkRed.png",
          size: new AMap.Size(48, 48),
          offset: new AMap.Pixel(-24, -24),
        },
        gridSize: 80,
      });
      this.map.setFitView();
    },
    //添加标记
    addPoint() {},
  },
  mounted() {
    this.initMaps();
    this.addPoint();
  },
};
</script>

<style scoped lang="scss">
#MAps {
  width: 100%;
  height: 100%;
}
.switch {
  position: absolute;
  left: 0;
  top: 0;
  background-color: #fff;
}
</style>
