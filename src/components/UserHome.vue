<template>
  <div class="">
    <el-row type="flex">
      <el-menu :default-active="$router.currentRoute.path" class="el-menu-vertical-demo" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" :collapse="isCollapse" :router="true"
        :unique-opened="true">
        <el-submenu :index="i" v-for="(item, i) in menu" :key="i">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="title">{{ item.name }}</span>
          </template>
          <el-menu-item :index="item.path" v-for="(item, index) in menu[i].child" :key="index">
            <i :class="item.ico"></i>
            <span slot="title">{{ item.name }}</span>
          </el-menu-item>
          <!-- <el-menu-item-group>
            <span slot="title">分组一</span>
            <el-menu-item index="1-1">选项1</el-menu-item>
            <el-menu-item index="1-2">选项2</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="分组2">
            <el-menu-item index="1-3">选项3</el-menu-item>
          </el-menu-item-group>
          <el-submenu index="1-4">
            <span slot="title">选项4</span>
            <el-menu-item index="1-4-1">选项1</el-menu-item>
          </el-submenu> -->
        </el-submenu>
        <!-- <el-menu-item v-for="item in menu" :key="item" :index="item.path">
          <i :class="item.ico"></i>
          <span slot="title">{{ item.name }}</span>
        </el-menu-item> -->
      </el-menu>
      <el-col :span="24" style="padding-left: 10px; padding-top: 10px">
        <Navbar></Navbar>
        <transition mode="out-in" name="slide-fade">
          <router-view />
        </transition>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Navbar from "./NavBar.vue";
import Bus from './bus';
export default {
  name: "UserHome",
  components: {
    Navbar,
  },
  data() {
    return {
      isCollapse:true,
      menu: [
        {
          path: "",
          name: "任务一",
          ico: "el-icon-setting",
          child: [
            { path: "/UserInfor", name: "个人信息", ico: "el-icon-s-custom" },
            { path: "/UserExper", name: "个人经历", ico: "el-icon-document-copy" },
            { path: "/UserEchart", name: "echarts图表", ico: "el-icon-pie-chart" },
          ],
        },
        {
          path: "",
          name: "任务二",
          ico: "el-icon-setting",
          child: [
            { path: "/CompanyAdd", name: "新增企业", ico: "" },
            { path: "/CompanyManag", name: "企业注册管理", ico: "el-icon-office-building" },
            { path: "/map", name: "map地图", ico: "el-icon-map-location" },
          ],
        },
      ],
    };
  },
  methods: {},
  mounted(){
    Bus.$on('collapse', collapse => {  
            // console.log(collapse);  
            this.isCollapse = collapse
        });  
  }
};
</script>

<style scoped lang="scss">
.el-menu-vertical-demo {
  text-align: center;
  height: 100vh;
  i {
    color: #fff;
  }
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 260px;
}
</style>
