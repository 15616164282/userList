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
        <el-col :span="7">
          <el-input v-model="form.busNumber" placeholder="请输入公交车号"></el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="Search">查询</el-button>
        </el-col>
      </el-row>
      <transition name="el-zoom-in-top">
        <div v-show="drawer" class="transition-box drawer-box">
          <div class="drawer-title">
            <h5>交通态势路况</h5>
            <i class="el-icon-circle-close" @click="handleClose"></i>
          </div>
          <ul>
            <li v-for="(item, index) in trafficList" :key="index">
              <div class="traficname">
                <div style="color: #66b1ff; font-weight: bold">{{ item.loadName }}</div>
                <div :style="{ color: traDesc[status].color }">
                  <i class="iconfont icon-xingzhuangjiehe"></i>&ensp;{{ traDesc[status].description }}
                </div>
              </div>
              <div>{{ item.description }}</div>
            </li>
          </ul>
        </div>
      </transition>
    </div>
  </div>
</template>

https://restapi.amap.com/v3/traffic/status/road?name=北环大道&adcode=440300&key=<用户的key>
https://restapi.amap.com/v3/traffic/status/circle?location=116.3057764,39.98641364&radius=1500&key=<用户的key>

<script>
import BusInitMaps from "../utils/compositionBus";
import { toRefs } from "@vue/composition-api";
export default {
  name: "Bus",
  data() {
    return {
      traDesc: [
        { color: "#bfbfbf", description: "未知" },
        { color: "#16CE95", description: "畅通" },
        { color: "#F79D06", description: "缓行" },
        { color: "#D80304", description: "拥堵" },
        { color: "#8F0021", description: "严重拥堵" },
      ],
      busStop: "",
    };
  },
  components: {},
  setup() {
    const { state } = BusInitMaps;

    return toRefs(state);
  },
  methods: {
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          this.drawer = false;
        })
        .catch((_) => {});
    },
    autoInput(queryString) {
      let that = this;
      // var keywords = document.getElementById("input").value;
      AMap.plugin("AMap.Autocomplete", function () {
        // 实例化Autocomplete
        var autoOptions = {
          city: "长沙",
        };
        var autoComplete = new AMap.Autocomplete(autoOptions);
        autoComplete.search(queryString, function (status, result) {
          // 搜索成功时，result即是对应的匹配数据
          // var node = new PrettyJSON.view.Node({
          //   el: document.querySelector("#input-info"),
          //   data: result,
          // });
          that.queryResult = result.tips;
        });
      });
    },
    Search() {
      // this.stationSearch();
      this.lineSearch();
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
  .drawer-box {
    width: 400px;
    position: fixed;
    top: 120px;
    right: 10px;
    // bottom: 50px;
    background-color: #fff;
    overflow: hidden;
    margin: 0;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .drawer-title {
      margin: 10px;

      display: flex;
      flex-direction: row;
      justify-content: space-between;
      h5 {
        font-size: 16px !important;
      }
      .el-icon-circle-close {
        display: inline-block;
        color: #828282;
        font-size: 18px;
        cursor: pointer;
      }
    }
  }
}
ul {
  display: flex;
  flex-direction: column;
  li {
    padding: 0 10px 10px 10px;
    // box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .traficname {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .icon-xingzhuangjiehe {
        font-size: 18px;
      }
      div {
        // display: inline-block;
      }
    }
  }
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
  .info-top {
    position: relative;
    background: none repeat scroll 0 0 #f9f9f9;
    border-bottom: 1px solid #ccc;
    border-radius: 5px 5px 0 0;
  }
}

.info-top div {
  display: inline-block;
  color: #333333;
  font-size: 14px;
  font-weight: bold;
  line-height: 31px;
  padding: 0 10px;
}

.info-top img {
  position: absolute;
  top: 10px;
  right: 10px;
  transition-duration: 0.25s;
}

.info-top img:hover {
  box-shadow: 0px 0px 5px #000;
}

.info-middle {
  font-size: 12px;
  padding: 10px 6px;
  line-height: 20px;
}

.info-bottom {
  height: 0px;
  width: 100%;
  clear: both;
  text-align: center;
}

.info-bottom img {
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
