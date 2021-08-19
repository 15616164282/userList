<template>
  <div class="userHome">
    <el-row type="flex">
      <el-menu
        :default-active="$router.currentRoute.path"
        class="el-menu-vertical-demo"
        background-color="#409eff"
        text-color="#333"
        active-text-color="#3280fc"
        :collapse="isCollapse"
        :router="true"
        :unique-opened="false"
      >
        <el-submenu :index="item.path" v-for="(item, i) in menu" :key="i">
          <template slot="title">
            <i :class="item.ico"></i>
            <span slot="title">{{ item.name }}</span>
          </template>
          <el-menu-item :index="item.path" v-for="(item, index) in menu[i].child" :key="index">
            <i :class="item.ico"></i>
            <span slot="title">{{ item.name }}</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
      <el-col :span="24" style="padding-left: 10px; padding-top: 10px">
        <Navbar></Navbar>
        <transition mode="out-in" name="slide-fade">
          <div class="view-box">
            <router-view />
          </div>
        </transition>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Navbar from "./NavBar.vue";
import Bus from "./bus";
export default {
  name: "UserHome",
  components: {
    Navbar,
  },
  data() {
    return {
      isCollapse: false,
      menu: [
        {
          path: "/1",
          name: "任务一",
          ico: "el-icon-map-location",
          child: [
            { path: "/UserInfor", name: "个人信息", ico: "el-icon-s-custom" },
            { path: "/UserExper", name: "个人经历", ico: "el-icon-document-copy" },
            { path: "/UserEchart", name: "echarts图表", ico: "el-icon-pie-chart" },
          ],
        },
        {
          path: "/2",
          name: "任务二",
          ico: "el-icon-map-location",
          child: [
            { path: "/CompanyAdd", name: "新增企业", ico: "el-icon-circle-plus" },
            { path: "/CompanyManag", name: "企业注册管理", ico: "el-icon-office-building" },
            { path: "/map", name: "map地图", ico: "el-icon-map-location" },
            { path: "/RoadNetwork", name: "高德地图路网", ico: "el-icon-map-location" },
            { path: "/Bus", name: "高德地图公交", ico: "el-icon-map-location" },
          ],
        },
      ],
    };
  },
  methods: {},
  mounted() {
    Bus.$on("collapse", (collapse) => {
      // console.log(collapse);
      this.isCollapse = collapse;
    });
  },
};
</script>

<style scoped lang="scss">
$silderColor: rgba(224, 234, 240, 0.5);
.userHome {
  .el-menu-vertical-demo {
    // text-align: center;
    background-color: $silderColor !important;
    /deep/.el-submenu__title {
      background-color: $silderColor !important;
    }
    /deep/.el-menu-item {
      background-color: $silderColor !important;
      color: #3280fc;
    }
    i {
      color: #3280fc;
    }
  }
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 260px;
  height: 100vh;
}
.view-box {
  width: 100%;
  height: calc(100vh - 79px);
  overflow: auto;
}
</style>
