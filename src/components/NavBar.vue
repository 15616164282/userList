<template>
  <div>
    <div class="navbar">
      <div class="hidden-menu" @click="collapse"><i :class="flag ? 'el-icon-s-unfold fontsize' : 'el-icon-s-fold fontsize'"></i></div>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-for="item in breadcrumb" :key="item">{{ item }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="tag-box">
      <el-tag
        v-for="(tag, i) in tags"
        :key="i"
        size="small"
        :closable="true"
        type="success"
        class="tag-view"
        :effect="isActive(tag) ? 'dark' : 'plain'"
        :disable-transitions="true"
        :hit="true"
        @close="closeTag(tag, i)"
        @click="$router.push(tag.path)"
      >
        {{ tag.meta.title }}
      </el-tag>
    </div>
  </div>
</template>

<script>
import Bus from "./bus";
export default {
  name: "NavBar",
  data() {
    return {
      flag: false,
      breadcrumb: [],
      tags: [],
    };
  },
  watch: {
    $route: {
      handler(newRouter) {
        if (this.tags.length === 0) {
          this.tags.push(newRouter);
        } else {
          let a = true;
          for (let i = 0; i < this.tags.length; i++) {
            if (this.tags[i].name == newRouter.name) {
              a = false;
            }
          }
          a ? this.tags.push(newRouter) : "";
        }
        this.breadcrumb = newRouter.meta.breadcrumb;
      },
      immediate: true,
    },
  },
  components: {},
  methods: {
    //关闭标签窗口
    closeTag(tag, i) {
      this.tags = this.tags.filter((o) => o != tag);
      const latestView = this.tags.slice(i)[0];
      latestView != undefined ? this.$router.push(latestView.fullPath) : this.$router.push("/");
    },
    //监听展开还是收缩
    collapse() {
      this.flag = !this.flag;
      Bus.$emit("collapse", this.flag);
    },

    isActive(tag) {
      return tag.path == this.$route.path;
    },
  },
};
</script>

<style lang="scss">
.navbar {
  width: 100%;
  height: 30px;
  .hidden-menu {
    float: left;
    margin-right: 15px;
    cursor: pointer;
    .fontsize {
      font-size: 24px;
    }
  }

  .breadcrumb {
    float: left;
    line-height: 24px;
  }
}
.tag-box {
  width: 100%;
  height: 30px;
  padding: 3px 0;
  // margin-bottom: 10px;
  line-height: 30px;
  background-color: #fff;
  border-bottom: 2px solid #d8dce5;
  border-top: 1px solid #d8dce5;
  .tag-view {
    margin-left: 3px;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
}
</style>
