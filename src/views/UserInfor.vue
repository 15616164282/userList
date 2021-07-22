<template>
  <div class="userinfor">
    <h3 style="text-align: center; line-height: 25px">个人信息</h3>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm">
      <el-form-item label="姓名：" prop="name" class="small">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>

      <el-form-item label="性别：" prop="sex">
        <el-radio-group v-model="ruleForm.sex">
          <el-radio label="男"></el-radio>
          <el-radio label="女"></el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="爱好：" prop="region">
        <el-select v-model="ruleForm.region" multiple placeholder="请选择" class="small-select">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="身份证号码：" prop="IDCard" class="small">
        <el-input v-model="ruleForm.IDCard"></el-input>
      </el-form-item>

      <el-form-item label="手机号码：" prop="phone" class="small">
        <el-input v-model="ruleForm.phone"></el-input>
      </el-form-item>

      <el-form-item label="座机号码：" prop="landline" class="small">
        <el-input v-model="ruleForm.landline"></el-input>
      </el-form-item>

      <el-form-item label="邮箱：" prop="email" class="small">
        <el-input v-model="ruleForm.email"></el-input>
      </el-form-item>

      <el-form-item label="出生年月：" prop="birthDate">
        <el-date-picker v-model="ruleForm.dateBirth" :picker-options="pickerOptions0" type="date" format="yyyy 年 MM 月 dd 日" placeholder="选择日期">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="家庭住址：" required>
        <el-col :span="7">
          <el-form-item prop="date1">
            <el-cascader size="large" :options="areaData" v-model="selectedOptions" @change="handleChange" class="small-select-ads"> </el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="详细地址：" prop="date2">
            <el-input type="textarea" placeholder="请输入内容" v-model="textarea" :autosize="true"> </el-input>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item label="最高学历：" required>
        <el-col :span="4">
          <el-form-item prop="education">
            <el-select v-model="ruleForm.education" placeholder="请选择最高学历">
              <el-option v-for="item in education" :key="item" :value="item"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="开始日期：" prop="eduStartTime">
            <el-date-picker type="date" placeholder="选择开始日期" v-model="ruleForm.eduStartTime" style="width: 100%"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="结束日期：" prop="eduEndTime">
            <el-date-picker type="date" placeholder="选择结束日期" v-model="ruleForm.eduEndTime" style="width: 100%"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="照片：" prop="imgurl">
            <el-upload
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :file-list="ruleForm.files"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :multiple="true"
            >
              <img v-if="eduImageUrl" :src="ruleForm.eduImageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { regionDataPlus } from "element-china-area-data";
const favorite = [
  {
    value: "篮球",
    label: "篮球",
  },
  {
    value: "跑步",
    label: "跑步",
  },
  {
    value: "看电影",
    label: "看电影",
  },
  {
    value: "打游戏",
    label: "打游戏",
  },
  {
    value: "做饭",
    label: "做饭",
  },
];
export default {
  name: "UserInfor",
  data() {
    return {
      eduImageUrl: true,
      options: favorite,
      education: ["博士", "硕士", "本科", "大专"],
      areaData: regionDataPlus,
      selectedOptions: [],
      textarea: "",
      ruleForm: {
        dateBirth: "",
        region: [],
        name: "",
        birthDate: "",
        IDCard: "",
        phone: "",
        landline: "",
        email: "",
        education: "",
        eduStartTime: "",
        eduEndTime: "",
        files: [],
        eduImageUrl: "",
        date2: "",
        delivery: false,
        type: [],
        sex: "",
        desc: "",
      },
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6;
        },
      },
      rules: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          {
            min: 2,
            max: 5,
            message: "长度在 2 到 5 个字符",
            trigger: ["blur", "change"],
          },
        ],
        IDCard: [
          { required: true, message: "请输入身份证号码", trigger: "blur" },
          {
            pattern: /^\d{15,18}$/,
            message: "请输入正确的身份证号码",
            trigger: ["blur", "change"],
          },
        ],
        phone: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          {
            pattern: /^\d{11}$/,
            message: "请输入正确的手机号码",
            trigger: ["blur", "change"],
          },
        ],
        landline: [{ required: true, message: "请输入座机号码", trigger: "blur" }],
        region: [{ required: true, message: "请选择爱好", trigger: "change" }],
        education: [{ required: true, message: "请选择学历", trigger: "change" }],
        birthDate: [
          {
            type: "date",
            required: true,
            message: "请选择选择出身日期",
            trigger: "change",
          },
        ],
        date2: [
          {
            type: "date",
            required: true,
            message: "请选择时间",
            trigger: "change",
          },
        ],
        type: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个活动性质",
            trigger: "change",
          },
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "change" }],
        email: [
          { required: true, message: "请填写邮箱", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  components: {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleChange(value) {
      console.log(value);
      console.log(CodeToText[value[0]], CodeToText[value[1]], CodeToText[value[2]]);
    },
    handleAvatarSuccess(res, file) {
      this.ruleForm.eduImageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
  },
};
</script>

<style lang="scss">
.small-select-ads {
  width: 100%;
}
.small-select {
  width: 35%;
}
.small {
  width: 25%;
}
.userinfor {
  padding-left: 10px;
}
.demo-ruleForm {
  width: 80%;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9 !important;
  border-radius: 6px !important;
  cursor: pointer !important;
  position: relative !important;
  overflow: hidden !important;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style>
