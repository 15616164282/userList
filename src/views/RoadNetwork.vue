<template>
  <div style="width: 100%; height: 889px; position: relative">
    <div id="MAps"></div>
    <!-- <el-checkbox-group v-model="checkList" class="checkgroup">
      <el-checkbox v-for="(city, i) in cities" :label="city.label" :key="i"></el-checkbox>
    </el-checkbox-group> -->
    <div class="checkgroup">
      <el-checkbox v-model="checked1" label="路网" border disabled></el-checkbox>
      <el-checkbox v-model="checked2" label="卫星" border disabled></el-checkbox>
    </div>
    <!-- <el-checkbox label="复选框 C"></el-checkbox> -->
  </div>
</template>

<script>
import wcJson from "../json/response_1628238808198.json";
export default {
  name: "RoadNetwork",
  data() {
    return {
      map: {},
      markers: [],
      cluster: [],
      checked1: "aa",
      checked2: "a",
      layers: [new AMap.TileLayer.RoadNet(), new AMap.TileLayer.Satellite()],
      cities: [
        {
          label: "卫星",
          layers: 1,
        },
        {
          label: "路网",
          layers: 0,
        },
      ],
      checkList: ["路网"],
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
        layers: this.layers.slice(0, this.checkList.length - 1),
        resizeEnable: true,
        zoom: 13,
      });
      let wcJsonData = wcJson.data;
      let a = [12, 23, 21, 22];
      console.log(a[(1, 0)]);
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

      cluster = new AMap.MarkerClusterer(this.map, WCMarker, {
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
.checkgroup {
  position: absolute;
  left: 0;
  top: 0;
  background-color: #fff;
}
</style>
