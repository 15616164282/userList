<template>
  <div class="UserExper">
    <el-switch v-model="workStudy" active-text="工作经历" inactive-text="学习经历"> </el-switch>
    <!-- 筛选 -->

    <el-form label-position="left">
      <el-row type="flex" justify="space-between">
        <el-col :span="5">
          <el-form-item label="姓名：">
            <el-input v-model="queryForm.name" clearable @blur="query" @clear="query" size="small"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="开始时间：">
            <el-date-picker
              v-model="queryForm.StartTime"
              :picker-options="pickerOptionsStart"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              @change="query"
              @clear="query"
              size="small"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="结束时间：">
            <el-date-picker
              v-model="queryForm.EndTime"
              :picker-options="pickerOptionsEnd"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              @change="query"
              @clear="query"
              size="small"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="5" v-if="workStudy">
          <el-form-item label="职位：">
            <el-input v-model="queryForm.position" clearable @blur="query" @clear="query" size="small"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="4" v-else>
          <el-form-item label="学历：">
            <el-select v-model="queryForm.position" clearable placeholder="请选择学历" @change="query" @clear="query" size="small">
              <el-option v-for="item in education" :key="item" :label="item" :value="item"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="爱好：" v-if="workStudy == false">
            <el-input v-model="queryForm.hobby" clearable @blur="query" @clear="query" size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 筛选 -->
    <el-row>
      <el-button size="small" @click="query" style="margin-left: 0px">查询</el-button>
      <el-button size="small" @click="handleAdd()" style="margin-left: 25px">新增</el-button>
      <el-button size="small" @click="clearFilter" style="margin-left: 25px">清除所有过滤器</el-button></el-row
    >
    <el-table :data="tableData" style="width: 100%" stripe ref="filterTable" empty-text="当前数据没有，请添加数据">
      <!-- <template slot="empty">暂无数据</template> -->
      <el-table-column label="姓名" width="90" prop="name" column-key="name" :filters="namefilter" :filter-method="filterHandler">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" width="130" prop="StartTime" column-key="StartTime" :filters="StartTimefilter" :filter-method="filterHandler">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.StartTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" width="130" prop="EndTime" column-key="EndTime" :filters="EndTimefilter" :filter-method="filterHandler">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.EndTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="workStudy ? '公司/单位：' : '学校：'" prop="company" width="220">
        <template slot-scope="scope">
          <i class="el-icon-office-building"></i>
          <span style="margin-left: 10px">{{ scope.row.company }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="workStudy ? '职称：' : '学历：'" prop="position" width="100">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.position }}</span>
        </template>
      </el-table-column>
      <el-table-column label="爱好：" width="100" prop="hobby" v-if="workStudy == false">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.hobby }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="dialog.title" :visible.sync="showdialog" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form label-width="110px">
        <el-form-item label="姓名：">
          <el-col :span="4">
            <el-input v-model="dialog.name" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="开始时间：">
          <el-col :span="8">
            <el-date-picker
              v-model="dialog.StartTime"
              :picker-options="pickerOptionsStart"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="结束时间：">
          <el-col :span="8">
            <el-date-picker v-model="dialog.EndTime" :picker-options="pickerOptionsEnd" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item :label="workStudy ? '公司/单位：' : '学校：'">
          <el-col :span="8">
            <el-input v-model="dialog.company" clearable></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="职位：" v-if="workStudy">
          <el-col :span="4">
            <el-input v-model="dialog.position" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="学历：" v-else>
          <el-col :span="4">
            <el-select v-model="dialog.position" clearable placeholder="请选择学历">
              <el-option v-for="item in education" :key="item" :label="item" :value="item"> </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="爱好：" v-if="workStudy == false">
          <el-col :span="8">
            <el-input v-model="dialog.hobby" clearable></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showdialog = false">取 消</el-button>
        <el-button type="primary" @click="define()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import userData from "../json/user.json";
export default {
  name: "UserExper",
  data() {
    return {
      tableData: "", //定义空对象表格会误认为有值 empty-text="当前数据没有，请添加数据"无效
      education: ["博士", "硕士", "本科", "大专"],
      workStudy: true,
      dialog: {},
      queryForm: {},
      namefilter: [],
      StartTimefilter: [],
      EndTimefilter: [],
      showdialog: false,
      add: false,
      // 开始结束日期限制
      pickerOptionsStart: {
        disabledDate: (time) => {
          if (this.dialog.EndTime) {
            return time.getTime() >= new Date(this.dialog.EndTime).getTime();
          }
        },
      },
      // 结束日期限制
      pickerOptionsEnd: {
        disabledDate: (time) => {
          if (this.dialog.StartTime) {
            return time.getTime() <= new Date(this.dialog.StartTime).getTime();
          }
        },
      },
    };
  },
  watch: {
    workStudy(newval, oldval) {
      if (newval == true) {
        this.tableData = userData.work;
      } else {
        this.tableData = userData.study;
      }
    },
  },
  components: {},
  methods: {
    empty(obj) {
      for (let key in obj) {
        return false; //非空
      }
      return true; //为空
    },
    query() {
      let filterList = {}; //筛选条件
      //判断筛选条件不为空把有属性值的放进筛选条件对象中
      const keys = Object.keys(this.queryForm);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (this.queryForm[key] != "") {
          filterList[key] = this.queryForm[key];
        }
      }
      //判断学生还是工作 使用json数据为原对象来过滤  利用every()判断满足筛选条件对象的值
      let workStudy = this.workStudy ? "work" : "study";
      this.tableData = userData[workStudy].filter((o) => {
        return Object.keys(filterList).every((key) => {
          return o[key] === filterList[key];
        });
      });
      // if (this.queryForm.hasOwnProperty("name") && this.queryForm.name != "") {
      //   this.tableData = this.tableData.filter((o) => o.name == this.queryForm.name);
      // }
      // if (this.queryForm.hasOwnProperty("StartTime") && this.queryForm.StartTime != "null") {
      //   this.tableData = this.tableData.filter((o) => o.StartTime == this.queryForm.StartTime);
      // }
      // if (this.queryForm.hasOwnProperty("EndTime") && this.queryForm.EndTime != "null") {
      //   this.tableData = this.tableData.filter((o) => o.EndTime == this.queryForm.EndTime);
      // }
      // if (this.queryForm.hasOwnProperty("position") && this.queryForm.position != "") {
      //   this.tableData = this.tableData.filter((o) => o.position == this.queryForm.position);
      // }
      // if (this.queryForm.hasOwnProperty("hobby") && this.queryForm.position != "") {
      //   this.tableData = this.tableData.filter((o) => o.hobby == this.queryForm.hobby);
      // }
    },
    //弹窗确定新增还是编辑
    define() {
      if (this.dialog.title == "新增数据") {
        this.tableData.push(this.dialog);
        this.showdialog = false;
      } else if (this.dialog.title == "编辑数据") {
        this.showdialog = false;
        this.tableData.splice([this.dialog.id], 1, this.dialog);
      }
    },
    //新增
    handleAdd() {
      this.dialog = {};
      this.del = true;
      this.showdialog = true;
      this.dialog = Object.assign({}, { title: "新增数据" });
    },
    //编辑
    handleEdit(index, row) {
      console.log(index, row);
      this.del = true;
      this.showdialog = true;
      this.dialog = Object.assign({}, row, { title: "编辑数据" });
    },
    //删除行数据
    handleDelete(index, row) {
      this.$confirm("确定删除这条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          console.log(index);
          this.tableData = this.tableData.filter((o) => o.id != row.id);
          console.log(this.tableData);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    resetDateFilter() {
      this.$refs.filterTable.clearFilter("date");
    },
    clearFilter() {
      console.log("fla");
      // this.$refs.filterTable.clearFilter();
      this.tableData = {};
      this.queryForm = {};
      if (this.workStudy == true) {
        this.tableData = userData.work;
      } else {
        this.tableData = userData.study;
      }
    },
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    //生成筛选条件
    filter() {
      const table = this.tableData;
      for (let i = 0; i < table.length; i++) {
        let name = { text: table[i].name, value: table[i].name };
        let staTime = { text: table[i].StartTime, value: table[i].StartTime };
        let endTime = { text: table[i].EndTime, value: table[i].EndTime };
        this.namefilter.push(name);
        this.StartTimefilter.push(staTime);
        this.EndTimefilter.push(endTime);
      }
    },
  },
  mounted() {
    this.tableData = userData.work;
    this.filter();
    // this.query();
  },
};
</script>

<style scoped lang="scss">
.UserExper {
  width: 63%;
  margin: 10px auto;
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
}
</style>
