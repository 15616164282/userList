import vue from "vue"
import VueComposition, {
  onMounted
} from "@vue/composition-api"
vue.use(VueComposition)
import axios from "axios"

import {
  ref,
  reactive
} from "@vue/composition-api"


const busMaps = ref({})
const state = reactive({
  maps: {},
  markers: [],
  trafficIcos: [
    require("../assets/images/unKnowCar.png"),
    require("../assets/images/unblockedCar.png"),
    require("../assets/images/slowlyCar.png"),
    require("../assets/images/congestionCar.png"),
    require("../assets/images/SevereCar.png"),
  ],
  drawer: false,
  status: 0,
  trafficList: [],
  initMaps
})
// let maps = reactive({})
// let markers = reactive([])
// const trafficIcos = [
//   require("../assets/images/unKnowCar.png"),
//   require("../assets/images/unblockedCar.png"),
//   require("../assets/images/slowlyCar.png"),
//   require("../assets/images/congestionCar.png"),
//   require("../assets/images/SevereCar.png"),
// ]
// let drawer = ref(false)
// let status = ref(0)
// let trafficList = ref([])
// const getBusMaps = () => {

//   busMaps.value = initMaps()
// }

function initMaps() {
  // let that = this;
  // 配置地图的基本显示
  state.maps = new AMap.Map("MAps", {
    center: [112.939981, 28.231061],
    layers: [
      // 卫星
      // new AMap.TileLayer.Satellite(),
      // 路网
      new AMap.TileLayer.RoadNet(),
    ],
    zoom: 11,
  });
  state.maps.on("click", showlnglat);

}

let showlnglat = function (e) {
  const lnglats = [e.lnglat.getLng(), e.lnglat.getLat()];
  maps.remove(markers);
  axios
    .get("/gaodeTraffic/circle?location=" + lnglats[0] + "," + lnglats[1] + "&radius=100&key=a50be5ec7c8a18ee46660e198e331499&level=6")
    .then((res) => {
      let datalength = res.data.trafficinfo.description.length;
      if (datalength) {

        drawer.value = true;
        status.value = res.data.trafficinfo.evaluation.status;
        let trafficinfo = res.data.trafficinfo.description.split("；");
        console.log(trafficList);
        trafficList.value = trafficinfo.map((item) => {
          return {
            loadName: item.split("：")[0],
            description: item.split("：")[1],
          };
        });
        let marker = new AMap.Marker({
          icon: new AMap.Icon({
            image: trafficIcos[status.value],
            size: new AMap.Size(32, 32),
            imageSize: new AMap.Size(32, 32),
          }),
          // offset: new AMap.Pixel(-16, -32),
          position: lnglats,
          map: maps,
        });
        markers.push(marker);
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
export default {
  initMaps,
  // drawer,
  // status,
  // trafficList,
  // markers
  state
}