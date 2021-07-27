<template>
  <div>
    <div class="navbar">
      <div class="hidden-menu"><i class="el-icon-s-fold"></i></div>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>活动管理</el-breadcrumb-item>
        <el-breadcrumb-item>活动列表</el-breadcrumb-item>
        <el-breadcrumb-item>活动详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </div>
</template>

<script>
export default {
  name: "NavBar",
  data() {
    return {};
  },
  components: {},
  methods: {},
};
</script>

<style scoped lang="scss">
.navbar {
  width: 100%;
  height: 50px;
  .hidden-menu {
    float: left;
    margin-right: 15px;
    i {
      font-size: 24px;
    }
  }
  .breadcrumb {
    float: left;
    line-height: 24px;
  }
}
</style>
