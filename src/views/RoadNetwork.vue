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
export default {
  name: "RoadNetwork",
  data() {
    return { map: {}, layers: [new AMap.TileLayer.RoadNet()], value2: true };
  },
  components: {},
  watch: {
    value2(val, newval) {
      console.log(this.value2);
      if (this.value2) {
        this.layers = [new AMap.TileLayer.RoadNet()];
        this.initMaps();
      } else {
        this.layers = [new AMap.TileLayer.RoadNet(), new AMap.TileLayer.Satellite()];
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
        zoom: 13,
      });
    },
  },
  mounted() {
    this.initMaps();
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
