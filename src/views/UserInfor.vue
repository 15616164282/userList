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
        <el-input v-model="ruleForm.IDCard" type="number"></el-input>
      </el-form-item>

      <el-form-item label="手机号码：" prop="phone" class="small">
        <el-input v-model="ruleForm.phone" type="number"></el-input>
      </el-form-item>

      <el-form-item label="座机号码：" prop="landline" class="small">
        <el-input v-model="ruleForm.landline" type="number"></el-input>
      </el-form-item>

      <el-form-item label="邮箱：" prop="email" class="small">
        <el-input v-model="ruleForm.email" type="email"></el-input>
      </el-form-item>

      <el-form-item label="出生年月：" prop="birthDate">
        <el-date-picker v-model="ruleForm.birthDate" :picker-options="pickerOptions0" type="date" format="yyyy 年 MM 月 dd 日" placeholder="选择日期">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="家庭住址：" required>
        <el-col :span="7">
          <el-form-item prop="address">
            <el-cascader
              size="large"
              placeholder="请选择地址"
              :options="areaData"
              v-model="ruleForm.address"
              @change="handleChange"
              class="small-select-ads"
            >
            </el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="详细地址：" prop="addressArea">
            <el-input type="textarea" placeholder="请填写详细地址" v-model="ruleForm.addressArea" :autosize="true" class="address"> </el-input>
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
          <el-form-item label="照片：" prop="coverFile">
            <el-upload
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              v-model="ruleForm.coverFile"
              :multiple="false"
            >
              <img v-if="ruleForm.coverUrl" :src="ruleForm.coverUrl" class="avatar" />
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
import axios from "axios";
import qs from "qs";
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
      options: favorite,
      education: ["博士", "硕士", "本科", "大专"],
      areaData: regionDataPlus,

      textarea: "",
      ruleForm: {
        address: [],
        dateBirth: "",
        addressArea: "",
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
        coverFile: "",
        coverUrl: "",
        type: [],
        sex: "",
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
        address: [{ required: true, message: "请选择地址", trigger: "change" }],
        addressArea: [{ required: true, message: "请填写详细地址", trigger: ["blur", "change"] }],
        education: [{ required: true, message: "请选择学历", trigger: "change" }],
        coverFile: [{ required: true, message: "请上传学历照片", trigger: "change" }],
        education: [{ required: true, message: "请选择学历", trigger: "change" }],
        education: [{ required: true, message: "请选择学历", trigger: "change" }],
        birthDate: [
          {
            type: "date",
            required: true,
            message: "请选择选择出身日期",
            trigger: "change",
          },
        ],
        eduStartTime: [
          {
            type: "date",
            required: true,
            message: "请选择开始时间",
            trigger: "change",
          },
        ],
        eduEndTime: [
          {
            type: "date",
            required: true,
            message: "请选择结束时间",
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
      console.log(formName);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("submit!");
          let formData = new FormData();
          formData.append("name", this.ruleForm[0]);
          axios
            .post("/api", qs.stringify(this.ruleForm, { arrayFormat: "indices", allowDots: true }))
            .then((res) => {
              console.log(res.data);
              if (res.data.ret) {
                console.log("添加成功");
              } else {
                console.log("添加失败");
              }
            })
            .catch((err) => {
              console.log(err);
            });
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
    imagePreview: function (file) {
      var self = this;
      //定义一个文件阅读器
      var reader = new FileReader();
      //文件装载后将其显示在图片预览里
      reader.onload = function (e) {
        //将bade64位图片保存至数组里供上面图片显示
        self.ruleForm.coverUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt1M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isPNG) {
        this.$message.error("上传头像图片只能是 JPG 或 PNG 格式!");
      } else if (!isLt1M) {
        this.$message.error("上传头像图片大小不能超过 1MB!");
      } else {
        this.ruleForm.coverFile = file;
        this.imagePreview(this.ruleForm.coverFile);
      }

      // 不使用upload自带的上传方式，而是使用axios，所以阻止upload自带的上传
      return false;
    },
  },
};
</script>

<style lang="scss">
.address {
  textarea {
    min-height: 40px !important;
    height: 40px !important;
  }
}
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

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}
/* chrome */

input[type="number"] {
  -moz-appearance: textfield; /* firefox */
}
</style>
