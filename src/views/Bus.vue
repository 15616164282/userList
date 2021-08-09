<template>
  <div style="width: 100%; height: 889px; position: relative">
    <div id="MAps"></div>
    <div class="input-card form-box" style="">
      <el-row>
        <el-col :span="13">
          <el-autocomplete
            class="inline-input"
            v-model="form.busStop"
            :fetch-suggestions="querySearch"
            placeholder="请输入公交车站"
            :trigger-on-focus="false"
            @select="handleSelect"
            ><template slot-scope="{ item }">
              <div class="name">{{ item.name }}</div>
            </template>
          </el-autocomplete>
        </el-col>
        <el-col :span="7"><el-input v-model="form.busNumber" placeholder="请输入公交车号"></el-input></el-col>
        <el-col :span="4"><el-button type="primary" @click="Search">查询</el-button></el-col>
      </el-row>
    </div>
    <div id="tip"></div>
  </div>
</template>
<script type="text/javascript" src="https://a.amap.com/jsapi_demos/static/demo-center/js/jquery-1.11.1.min.js"></script>
<script type="text/javascript" src="https://a.amap.com/jsapi_demos/static/demo-center/js/underscore-min.js"></script>
<script type="text/javascript" src="https://a.amap.com/jsapi_demos/static/demo-center/js/backbone-min.js"></script>
<script type="text/javascript" src="https://a.amap.com/jsapi_demos/static/demo-center/js/prety-json.js"></script>
<script>
export default {
  name: "Bus",
  data() {
    return { map: {}, busStop: "", form: {}, markers: [], busImg: require("../assets/images/BUS2.png"), queryResult: [], infoWindow: {} };
  },
  components: {},
  methods: {
    initMaps() {
      // 配置地图的基本显示
      this.map = new AMap.Map("MAps", {
        center: [112.939981, 28.231061],
        layers: [
          // 卫星
          // new AMap.TileLayer.Satellite(),
          // 路网
          new AMap.TileLayer.RoadNet(),
        ],
        zoom: 13,
      });
    },
    // autoInput(queryString) {
    //   let that = this;
    //   // var keywords = document.getElementById("input").value;
    //   AMap.plugin("AMap.Autocomplete", function () {
    //     // 实例化Autocomplete
    //     var autoOptions = {
    //       city: "长沙",
    //     };
    //     var autoComplete = new AMap.Autocomplete(autoOptions);
    //     autoComplete.search(queryString, function (status, result) {
    //       // 搜索成功时，result即是对应的匹配数据
    //       // var node = new PrettyJSON.view.Node({
    //       //   el: document.querySelector("#input-info"),
    //       //   data: result,
    //       // });
    //       that.queryResult = result.tips;
    //     });
    //   });
    // },
    handleSelect(item) {
      this.form.busStop = item.name;
      this.map.remove(this.markers);
      this.infoWindow = new AMap.InfoWindow({ isCustom: true, offset: new AMap.Pixel(15, -30) });
      let marker = new AMap.Marker({
        icon: new AMap.Icon({
          image: this.busImg,
          size: new AMap.Size(32, 32),
          imageSize: new AMap.Size(32, 32),
        }),
        // offset: new AMap.Pixel(-16, -32),
        position: item.location,
        map: this.map,
        title: item.name,
      });
      //实例化信息窗体
      let contents = [];
      contents.push("<img src='http://tpc.googlesyndication.com/simgad/5843493769827749134'>地址：北京市朝阳区阜通东大街6号院3号楼东北8.3公里");
      contents.push("电话：010-64733333");
      contents.push("<a href='https://ditu.amap.com/detail/B000A8URXB?citycode=110105'>详细信息</a>");
      marker.content = this.createInfoWindow(item.name, contents.join("<br/>"));
      marker.on("mouseover", function (e) {
        e.target.info.open(this.map, e.target.getPosition());
      });
      marker.on("mouseover", function (e) {
        e.target.info.open(this.map, e.target.getPosition());
      });
      marker.on("click", this.markerClick);
      marker.emit("click", { target: marker });
      this.markers.push(marker);
      this.map.setFitView();
      console.log(item);
    },
    Search() {
      // this.stationSearch();
      this.lineSearch();
    },
    /*公交站点查询*/
    stationSearch(queryString) {
      let that = this;
      this.markers = [];
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
          that.queryResult = result.stationInfo;
          that.stationSearch_CallBack(result);
        }
      });
      console.log(that.queryResult);

      return this.queryResult;
    },
    querySearch(queryString, cb) {
      let that = this;
      this.markers = [];
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
          that.queryResult = result.stationInfo;
          that.stationSearch_CallBack(result);
        }
      });
      // var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      // console.log(this.queryResult);
    },
    /*公交站点查询返回数据解析*/
    stationSearch_CallBack(searchResult) {
      let stationArr = searchResult.stationInfo;
      let searchNum = stationArr.length;
      if (searchNum > 0) {
        // document.getElementById("tip").innerHTML = "查询结果：共" + searchNum + "个相关站点";
        this.infoWindow = new AMap.InfoWindow({ isCustom: true, offset: new AMap.Pixel(15, -30) });
        for (let i = 0; i < searchNum; i++) {
          console.log(stationArr[i]);
          var marker = new AMap.Marker({
            icon: new AMap.Icon({
              image: this.busImg,
              size: new AMap.Size(32, 32),
              imageSize: new AMap.Size(32, 32),
            }),
            // offset: new AMap.Pixel(-16, -32),
            position: stationArr[i].location,
            map: this.map,
            title: stationArr[i].name,
          });
          //实例化信息窗体
          let contents = [];
          contents.push("<img src='http://tpc.googlesyndication.com/simgad/5843493769827749134'>地址：北京市朝阳区阜通东大街6号院3号楼东北8.3公里");
          contents.push("电话：010-64733333");
          // contents.push("<a href='https://ditu.amap.com/detail/B000A8URXB?citycode=110105'>详细信息</a>");
          marker.content = this.createInfoWindow(stationArr[i].name, contents.join("<br/>"));
          marker.on("mouseover", function (e) {
            e.target.info.open(this.map, e.target.getPosition());
          });
          // marker.on("click", function () {
          //   // console.log(e);
          //   marker.info.open(this.map, marker.getPosition());
          //   // e.target.info.open(this.map, e.target.getPosition());
          // });

          // var infoWindow = new AMap.InfoWindow({
          //   isCustom: true, //使用自定义窗体
          //   content: this.createInfoWindow(title, content.join("<br/>")),
          //   offset: new AMap.Pixel(16, -45),
          // });
          marker.on("click", this.markerClick);
          marker.emit("click", { target: marker });
          // AMap.event.addListener(marker, "click", function () {
          //   infoWindow.open(this.map, marker.getPosition());
          // });
          this.markers.push(marker);
        }
        this.map.setFitView();
      }
    },
    markerClick(e) {
      console.log(e);
      // let infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(0, -30) });
      this.infoWindow.setContent(e.target.content);
      this.infoWindow.open(this.map, e.target.getPosition());
    },
    //构建自定义信息窗体
    createInfoWindow(title, content) {
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
      closeX.onclick = this.closeInfoWindow;

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
    },
    closeInfoWindow() {
      this.map.clearInfoWindow();
    },
    /*公交线路查询*/
    lineSearch() {
      let that = this;
      let busLineName = this.form.busNumber;
      if (!busLineName) return;
      //实例化公交线路查询类，只取回一条路线
      let linesearch;
      if (!linesearch) {
        linesearch = new AMap.LineSearch({
          pageIndex: 1,
          city: "长沙",
          pageSize: 1,
          extensions: "all",
        });
      }
      //搜索公交线路
      linesearch.search(busLineName, function (status, result) {
        that.map.clearMap();
        if (status === "complete" && result.info === "OK") {
          that.lineSearch_Callback(result);
        } else {
          alert(result);
        }
      });
    },
    /*公交路线查询服务返回数据解析概况*/
    lineSearch_Callback(data) {
      let that = this;
      let lineArr = data.lineInfo;
      let lineNum = data.lineInfo.length;
      if (lineNum == 0) {
      } else {
        for (let i = 0; i < lineNum; i++) {
          let pathArr = lineArr[i].path;
          let stops = lineArr[i].via_stops;
          let startPot = stops[0].location;
          let endPot = stops[stops.length - 1].location;
          if (i == 0)
            //作为示例，只绘制一条线路
            that.drawbusLine(startPot, endPot, pathArr);
        }
      }
    },
    drawbusLine(startPot, endPot, BusArr) {
      //绘制起点，终点
      new AMap.Marker({
        map: this.map,
        position: startPot, //基点位置
        icon: "https://webapi.amap.com/theme/v1.3/markers/n/start.png",
        zIndex: 10,
        // offset: 3,
        anchor: "top-left",
      });
      new AMap.Marker({
        map: this.map,
        position: endPot, //基点位置
        icon: "https://webapi.amap.com/theme/v1.3/markers/n/end.png",
        zIndex: 10,
        // offset: 3,
        anchor: "top-left",
      });
      //绘制乘车的路线
      let busPolyline = new AMap.Polyline({
        map: this.map,
        path: BusArr,
        strokeColor: "#09f", //线颜色3
        strokeOpacity: 0.8, //线透明度
        isOutline: true,

        outlineColor: "white",
        strokeWeight: 6, //线宽
      });
      // 将 busPolyline 显示在地图中心并自动缩放地图到合适级别。
      // true表示需要动画过程，[60,200,60,60]表示上下左右避让像素
      this.map.setFitView(busPolyline, true, [60, 200, 60, 60]);
    },
  },
  mounted() {
    this.initMaps();
  },
};
</script>

<style lang="scss">
#MAps {
  width: 100%;
  height: 100%;
}
.input-card {
  background-color: #fff;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  display: flex;
  flex-direction: row;
  .inline-input {
    width: 100%;
  }
  // .form-box {

  // }
}
.content-window-card {
  position: relative;
  box-shadow: none;
  bottom: 0;
  left: 0;
  width: auto;
  padding: 0;
}

.content-window-card p {
  height: 2rem;
}

.custom-info {
  border: solid 1px silver;
}

div.info-top {
  position: relative;
  background: none repeat scroll 0 0 #f9f9f9;
  border-bottom: 1px solid #ccc;
  border-radius: 5px 5px 0 0;
}

div.info-top div {
  display: inline-block;
  color: #333333;
  font-size: 14px;
  font-weight: bold;
  line-height: 31px;
  padding: 0 10px;
}

div.info-top img {
  position: absolute;
  top: 10px;
  right: 10px;
  transition-duration: 0.25s;
}

div.info-top img:hover {
  box-shadow: 0px 0px 5px #000;
}

div.info-middle {
  font-size: 12px;
  padding: 10px 6px;
  line-height: 20px;
}

div.info-bottom {
  height: 0px;
  width: 100%;
  clear: both;
  text-align: center;
}

div.info-bottom img {
  position: relative;
  z-index: 104;
}

span {
  margin-left: 5px;
  font-size: 11px;
}

.info-middle img {
  float: left;
  margin-right: 6px;
}
// #show {
//   height: 100px;
//   width: 100px;
//   background: chocolate;
// }
// #panel {
//   position: absolute;
//   background-color: white;
//   max-height: 90%;
//   overflow-y: auto;
//   top: 10px;
//   right: 10px;
//   width: 280px;
// }
</style>
