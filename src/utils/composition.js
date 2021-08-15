import vue from "vue"
import VueComposition, {
  onMounted
} from "@vue/composition-api"
vue.use(VueComposition)

import {
  ref,
  reactive
} from "@vue/composition-api"

export default function BusInitMaps() {
  const busMaps = ref({})
  const maps = ref({})
  const getBusMaps = async () => {
    busMaps.value = await initMaps()
  }

  function initMaps() {
    let that = this;
    // 配置地图的基本显示
    maps = new AMap.Map("MAps", {
      center: [112.939981, 28.231061],
      layers: [
        // 卫星
        // new AMap.TileLayer.Satellite(),
        // 路网
        new AMap.TileLayer.RoadNet(),
      ],
      zoom: 11,
    });
    maps.on("click", showlnglat());
  }

  function showlnglat(e) {
    maps.remove(this.circleMarker);
    const lnglats = [e.lnglat.getLng(), e.lnglat.getLat()];
    axios
      .get("/gaodeTraffic/circle?location=" + lnglats[0] + "," + lnglats[1] + "&radius=" + this.radius + "&key=" + this.key + "&level=6")
      .then((res) => {
        maps.remove(this.markers);
        console.log(res.data);
        let datalength = res.data.trafficinfo.description.length;
        console.log(datalength);
        if (datalength) {
          this.drawer = true;
          this.status = res.data.trafficinfo.evaluation.status;
          let trafficinfo = res.data.trafficinfo.description.split("；");
          this.trafficList = trafficinfo.map((item) => {
            return {
              loadName: item.split("：")[0],
              description: item.split("：")[1],
            };
          });
          let marker = new AMap.Marker({
            icon: new AMap.Icon({
              image: this.trafficIcos[this.status],
              size: new AMap.Size(32, 32),
              imageSize: new AMap.Size(32, 32),
            }),
            // offset: new AMap.Pixel(-16, -32),
            position: lnglats,
            map: maps,
          });
          this.markers.push(marker);
          maps.setFitView();
          maps.setZoom(13)
        } else {
          this.$message({
            message: "该地区没有交通态势数据",
            type: "warning",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onMounted(getBusMaps)

  return {
    busMaps,
    getBusMaps
  }
}