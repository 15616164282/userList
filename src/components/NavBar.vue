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
        v-for="tag in tags"
        :key="tag.name"
        size="small"
        :closable="true"
        type="success"
        class="tag-view"
        effect="dark "
        :disable-transitions="true"
        :hit="true"
        @close="closeTag(tag)"
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
        console.log(newRouter);
        // this.tags.push(newRouter);
        // this.tags = this.deleteobj(newRouter);
        // this.tags = this.tags.filter((o) => o.name != newRouter.name);
        if (this.tags.length == 0) {
          console.log("aaaa");
          this.tags.push(newRouter);
        } else {
          console.log("bbb");
          // let tagsView = this.tags.filter((o) => o.name != newRouter.name);
          this.tags.forEach((item) => {
            if (item.name !== newRouter.name) {
              console.log("wwww");
              this.tags.push(newRouter);
            }
          });
        }
        this.breadcrumb = newRouter.meta.breadcrumb;
      },
      immediate: true,
    },
  },
  components: {},
  methods: {
    deleteobj(obj) {
      var uniques = [];
      var stringify = {};
      for (var i = 0; i < obj.length; i++) {
        var keys = Object.keys(obj[i]);
        keys.sort(function (a, b) {
          return Number(a) - Number(b);
        });
        var str = "";
        for (var j = 0; j < keys.length; j++) {
          str += JSON.stringify(keys[j]);
          str += JSON.stringify(obj[i][keys[j]]);
        }
        if (!stringify.hasOwnProperty(str)) {
          uniques.push(obj[i]);
          stringify[str] = true;
        }
      }
      uniques = uniques;
      return uniques;
    },
    //关闭标签窗口
    closeTag(val) {
      console.log(val);
      this.tags = this.tags.filter((o) => o != val);
      const latestView = this.tags.slice(-1)[0];
      console.log(latestView);
      if (latestView) {
        this.$router.push(latestView.fullPath);
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        // if (view.name === "Dashboard") {
        //   // to reload home page
        //   this.$router.replace({ path: "/redirect" + view.fullPath });
        // } else {
        //
        // }
        this.$router.push("/");
      }
    },
    //监听展开还是收缩
    collapse() {
      this.flag = !this.flag;
      Bus.$emit("collapse", this.flag);
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
  margin-bottom: 10px;
  background-color: #fff;
  border-bottom: 1px solid #d8dce5;
  border-top: 2px solid #d8dce5;
  .tag-view {
    margin-left: 3px;
  }
}
</style>
