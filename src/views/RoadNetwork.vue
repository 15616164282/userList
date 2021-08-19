<template>
  <div style="width: 100%; height: 889px; position: relative">
    <div id="MAps"></div>
    <!-- <el-checkbox-group v-model="checkList" class="checkgroup">
      <el-checkbox v-model="checked1" label="路网" border></el-checkbox>
      <el-checkbox v-model="checked2" label="卫星" border></el-checkbox>
    </el-checkbox-group> -->
    <!-- <div class="checkgroup">
      <el-checkbox v-model="RoadNet" label="路网" @change="RoadNet ? map.add(roadNetLayer) : map.remove(roadNetLayer)" border></el-checkbox>
      <el-checkbox v-model="Satellite" label="卫星" @change="Satellite ? map.add(satelliteLayer) : map.remove(satelliteLayer)" border></el-checkbox>
      <el-checkbox v-model="Traffic" label="实时路况" @change="Traffic ? map.add(TrafficLayer) : map.remove(TrafficLayer)" border></el-checkbox>
      <el-checkbox v-model="Buildings" label="楼快" @change="Buildings ? map.add(BuildingsLayer) : map.remove(BuildingsLayer)" border></el-checkbox>
    </div> -->
    <div class="checkgroup">
      <div class="check-box" @mouseover="isShow = true" @mouseout="isShow = false">
        <span class="check-left"
          ><i class="iconfont icon-tuceng"></i>&ensp;图层<i :class="isShow ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i></span
        ><span class="check-right"></span>
        <ul v-show="isShow">
          <li>
            <div class="ifont"><i class="iconfont icon-ziyuan2"></i>&ensp;路网</div>
            <el-switch
              v-model="RoadNet"
              active-text="ON"
              inactive-text="OFF"
              :width="60"
              active-color="#409EFF"
              inactive-color="#C0CCDA"
              @change="RoadNet ? map.add(roadNetLayer) : map.remove(roadNetLayer)"
            >
            </el-switch>
          </li>
          <li>
            <div class="ifont"><i class="iconfont icon-weixing"></i>&ensp;卫星</div>
            <el-switch
              v-model="Satellite"
              active-text="ON"
              inactive-text="OFF"
              :width="60"
              active-color="#409EFF"
              inactive-color="#C0CCDA"
              @change="Satellite ? map.add(satelliteLayer) : map.remove(satelliteLayer)"
            >
            </el-switch>
          </li>
          <li>
            <div class="ifont"><i class="iconfont icon-shishilukuang"></i>&ensp;实时路况</div>
            <el-switch
              v-model="Traffic"
              active-text="ON"
              inactive-text="OFF"
              :width="60"
              active-color="#409EFF"
              inactive-color="#C0CCDA"
              @change="Traffic ? map.add(TrafficLayer) : map.remove(TrafficLayer)"
            >
            </el-switch>
          </li>
          <li>
            <div class="ifont"><i class="iconfont icon-jianzhu"></i>&ensp;楼快</div>
            <el-switch
              v-model="Buildings"
              active-text="ON"
              inactive-text="OFF"
              :width="60"
              active-color="#409EFF"
              inactive-color="#C0CCDA"
              @change="Buildings ? map.add(BuildingsLayer) : map.remove(BuildingsLayer)"
            >
            </el-switch>
          </li>
          <li>
            <div class="ifont"><i class="iconfont icon-relitu"></i>&ensp;热力图</div>
            <el-switch
              v-model="heatMaps"
              active-text="ON"
              inactive-text="OFF"
              :width="60"
              active-color="#409EFF"
              inactive-color="#C0CCDA"
              @change="heatMaps ? heatmap.show() : heatmap.hide()"
            >
            </el-switch>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { toRefs } from "@vue/composition-api";
import roadState from "../utils/compositionRoad";
export default {
  name: "RoadNetwork",
  setup() {
    const { state } = roadState;

    return toRefs(state);
  },
  data() {
    return {};
  },
  components: {},
  watch: {},
  methods: {},
  async mounted() {
    await this.initMaps();
    this.addClustererPoint();
    this.createHeatMap();
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
  .check-box {
    position: relative;
    width: 200px;
    height: 34px;
    border-radius: 5px;
    background-color: #fff;
    color: #333;
    span {
      margin-left: 0px !important;
      display: inline-block;
      line-height: 24px;
      font-size: 14px;
      cursor: pointer;
      // text-align: center;
    }
    // .check-left::hover,
    // .check-right::hover {
    // }
    .check-left {
      width: 52%;
      padding: 5px;
      position: relative;
      .icon-tuceng {
        // position: absolute;
        // left: 1rem;
        // top: 0.3rem;
      }
      .el-icon-arrow-down,
      .el-icon-arrow-up {
        position: absolute;
        left: 5.5rem;
        top: 0.6rem;
      }
    }
    .check-left::after {
      position: absolute;
      top: 0.6em;
      right: 0;
      content: "";
      width: 0;
      height: 17px;
      line-height: 24px;
      border-left: solid rgb(224, 224, 230) 1px;
    }
    .check-right {
      width: 37%;
      padding: 5px;
      // border-left: 2px solid #fff;
    }
    ul {
      width: 100%;
      list-style: none;
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 31px;
      left: 0;
      li {
        width: 190px;
        height: 24px;
        padding: 5px;
        font-size: 14px;
        line-height: 24px;
        background-color: #fff;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .ifont {
          width: 55%;
          height: 100%;
          line-height: 24px;
        }
        .el-switch {
          width: 30%;
          line-height: 24px;
          margin-left: 30px;
          padding-right: 10px;
        }
        /deep/.el-switch__label--right {
          margin-left: -27px;
          z-index: 125;
          line-height: 21px !important ;
          color: #fff !important;
        }
        /deep/.el-switch__label--left {
          margin-right: -31px;
          z-index: 125;
          line-height: 21px !important ;
          color: #fff !important;
        }
        /deep/.el-switch__label * {
          font-size: 12px !important ;
        }
        /deep/.el-switch__core:after {
          z-index: 127;
        }
      }
      li:last-child {
        border-end-end-radius: 5px;
      }
    }
  }
}
</style>
