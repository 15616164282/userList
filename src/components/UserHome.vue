<template>
  <div class="">
    <el-row type="flex">
      <el-menu
        :default-active="$router.currentRoute.path"
        class="el-menu-vertical-demo"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        :collapse="false"
        :router="true"
      >
        <el-menu-item v-for="item in menu" :key="item" :index="item.path">
          <i :class="item.ico"></i>
          <span slot="title">{{ item.name }}</span>
        </el-menu-item>
      </el-menu>
      <el-col :span="24" style="">
        <transition mode="out-in" name="slide-fade"> <router-view :key="key" /> </transition
      ></el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      menu: [
        { path: "/UserInfor", name: "个人信息", ico: "el-icon-s-custom" },
        { path: "/UserExper", name: "个人经历", ico: "el-icon-document-copy" },
        { path: "/UserEchart", name: "echarts图表", ico: "el-icon-pie-chart" },
      ],
    };
  },
  components: {},
  methods: {},
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
