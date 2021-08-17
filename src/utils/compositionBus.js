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


const state = reactive({
  maps: {},
  markersCar: [],
  markersBus: [],
  form: {},
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
  queryResult: [],
  infoWindow: {},
  busImg: require("../assets/images/BUS2.png"),

  createInfoWindow,
  initMaps,
  showlnglat,
  stationSearch,
  querySearch,
  stationSearch_CallBack,
  handleSelect,
  markerClick,
})

//初始化地图
function initMaps () {
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
//点击位置的交通态势
function showlnglat (e) {
  const lnglats = [e.lnglat.getLng(), e.lnglat.getLat()];
  state.maps.remove(state.markersCar);
  axios
    .get("/gaodeTraffic/circle?location=" + lnglats[0] + "," + lnglats[1] + "&radius=100&key=a50be5ec7c8a18ee46660e198e331499&level=6")
    .then((res) => {
      let datalength = res.data.trafficinfo.description.length;
      if (datalength) {

        state.drawer = true;
        state.status = res.data.trafficinfo.evaluation.status;
        let trafficinfo = res.data.trafficinfo.description.split("；");
        console.log(state.trafficList);
        state.trafficList = trafficinfo.map((item) => {
          return {
            loadName: item.split("：")[0],
            description: item.split("：")[1],
          };
        });
        let marker = new AMap.Marker({
          icon: new AMap.Icon({
            image: state.trafficIcos[state.status],
            size: new AMap.Size(32, 32),
            imageSize: new AMap.Size(32, 32),
          }),
          // offset: new AMap.Pixel(-16, -32),
          position: lnglats,
          map: state.maps,
        });
        state.markersCar.push(marker);
        state.maps.setFitView();
        state.maps.setZoom(13)
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
//选择输入框联想的结果
function handleSelect (item) {

  console.log(item);
  state.form.busStop = item.name;
  state.maps.remove(state.markersBus);
  state.infoWindow = new AMap.InfoWindow({ isCustom: true, offset: new AMap.Pixel(15, -30) });
  let marker = new AMap.Marker({
    icon: new AMap.Icon({
      image: state.busImg,
      size: new AMap.Size(32, 32),
      imageSize: new AMap.Size(32, 32),
    }),
    // offset: new AMap.Pixel(-16, -32),
    position: item.location,
    map: state.maps,
    title: item.name,
  });
  //实例化信息窗体
  let contents = [];
  contents.push("<img src='http://tpc.googlesyndication.com/simgad/5843493769827749134'>地址：北京市朝阳区阜通东大街6号院3号楼东北8.3公里");
  contents.push("电话：010-64733333");
  contents.push("<a href='https://ditu.amap.com/detail/B000A8URXB?citycode=110105'>详细信息</a>");
  marker.content = createInfoWindow(item.name, contents.join("<br/>"));
  marker.on("mouseover", function (e) {
    e.target.info.open(state.maps, e.target.getPosition());
  });
  marker.on("click", markerClick);
  marker.emit("click", { target: marker });
  state.markersBus.push(marker);
  state.maps.setFitView();
}
//构建自定义信息窗体
function createInfoWindow (title, content) {
  var info = document.createElement("div");
  info.className = "custom-info input-cards content-window-card";

  //可以通过下面的方式修改自定义窗体的宽高
  //info.style.width = "400px";
  // 定义顶部标题
  var top = document.createElement("div");
  var titleD = document.createElement("div");
  var closeX = document.createElement("img");
  top.className = "info-top";
  titleD.innerHTML = title;
  closeX.src = "https://webapi.amap.com/images/close2.gif";
  closeX.onclick = closeInfoWindow;

  top.appendChild(titleD);
  top.appendChild(closeX);
  info.appendChild(top);

  // 定义中部内容
  var middle = document.createElement("div");
  middle.className = "info-middle";
  middle.style.backgroundColor = "white";
  middle.innerHTML = content;
  info.appendChild(middle);

  // 定义底部内容
  var bottom = document.createElement("div");
  bottom.className = "info-bottom";
  bottom.style.position = "relative";
  bottom.style.top = "0px";
  bottom.style.margin = "0 auto";
  var sharp = document.createElement("img");
  sharp.src = "https://webapi.amap.com/images/sharp.png";
  bottom.appendChild(sharp);
  info.appendChild(bottom);
  return info;
}
function markerClick (e) {
  console.log(e);
  // let infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(0, -30) });
  state.infoWindow.setContent(e.target.content);
  state.infoWindow.open(state.maps, e.target.getPosition());
}
function closeInfoWindow () {
  state.maps.clearInfoWindow();
}

/*公交站点查询*/
function stationSearch (queryString) {
  state.markersBus = [];
  // let stationKeyWord = this.form.busStop;
  if (!queryString) return;
  //实例化公交站点查询类
  var station = new AMap.StationSearch({
    pageIndex: 1, //页码
    pageSize: 60, //单页显示结果条数
    city: "183", //确定搜索城市
  });
  // let queryResult = [];
  station.search(queryString, function (status, result) {
    if (status === "complete" && result.info === "OK") {
      console.log(result);
      state.queryResult = result.stationInfo;
      stationSearch_CallBack(result);
    }
  });
  console.log(that.queryResult);
}
function querySearch (queryString, cb) {
  state.markersBus = [];
  // let stationKeyWord = this.form.busStop;
  if (!queryString) return;
  //实例化公交站点查询类
  var station = new AMap.StationSearch({
    pageIndex: 1, //页码
    pageSize: 60, //单页显示结果条数
    city: "183", //确定搜索城市
  });
  // let queryResult = [];
  station.search(queryString, function (status, result) {
    if (status === "complete" && result.info === "OK") {
      cb(result.stationInfo);
      state.queryResult = result.stationInfo;
      stationSearch_CallBack(result);
    }
  });
  // var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
  // 调用 callback 返回建议列表的数据
  // console.log(this.queryResult);
}
/*公交站点查询返回数据解析*/
function stationSearch_CallBack (searchResult) {
  let stationArr = searchResult.stationInfo;
  let searchNum = stationArr.length;
  if (searchNum > 0) {
    state.infoWindow = new AMap.InfoWindow({ isCustom: true, offset: new AMap.Pixel(15, -30) });
    for (let i = 0; i < searchNum; i++) {
      console.log(stationArr[i]);
      var marker = new AMap.Marker({
        icon: new AMap.Icon({
          image: state.busImg,
          size: new AMap.Size(32, 32),
          imageSize: new AMap.Size(32, 32),
        }),
        // offset: new AMap.Pixel(-16, -32),
        position: stationArr[i].location,
        map: state.maps,
        title: stationArr[i].name,
      });
      //实例化信息窗体
      let contents = [];
      contents.push("<img src='http://tpc.googlesyndication.com/simgad/5843493769827749134'>地址：北京市朝阳区阜通东大街6号院3号楼东北8.3公里");
      contents.push("电话：010-64733333");
      // contents.push("<a href='https://ditu.amap.com/detail/B000A8URXB?citycode=110105'>详细信息</a>");
      marker.content = createInfoWindow(stationArr[i].name, contents.join("<br/>"));
      marker.on("mouseover", function (e) {
        e.target.info.open(state.maps, e.target.getPosition());
      });
      marker.on("click", markerClick);
      marker.emit("click", { target: marker });
      state.markersBus.push(marker);
    }
    state.maps.setFitView();
  }
}
export default { state }