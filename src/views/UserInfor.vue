<template>
  <div class="">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="ruleForm.sex">
          <el-radio label="男"></el-radio>
          <el-radio label="女"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="爱好" prop="region">
        <el-select v-model="ruleForm.region" multiple placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="身份证号码" prop="IDCard">
        <el-input v-model="ruleForm.IDCard"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="ruleForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="座机号码" prop="landline">
        <el-input v-model="ruleForm.landline"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="ruleForm.email"></el-input>
      </el-form-item>
      <el-form-item label="出生年月" prop="birthDate">
        <el-date-picker v-model="ruleForm.dateBirth" :picker-options="pickerOptions0" type="date" format="yyyy 年 MM 月 dd 日" placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="活动时间" required>
        <el-col :span="11">
          <el-form-item prop="date1">
            <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1" style="width: 100%"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-form-item prop="date2">
            <el-time-picker placeholder="选择时间" v-model="ruleForm.date2" style="width: 100%"></el-time-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="即时配送" prop="delivery">
        <el-switch v-model="ruleForm.delivery"></el-switch>
      </el-form-item>
      <el-form-item label="活动性质" prop="type">
        <el-checkbox-group v-model="ruleForm.type">
          <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
          <el-checkbox label="地推活动" name="type"></el-checkbox>
          <el-checkbox label="线下主题活动" name="type"></el-checkbox>
          <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="活动形式" prop="desc">
        <el-input type="textarea" v-model="ruleForm.desc"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
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
      ruleForm: {
        dateBirth: "",
        region: [],
        name: "",
        region: "",
        birthDate: "",
        IDCard: "",
        phone: "",
        landline: "",
        email: "",
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
          { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: ["blur", "change"] },
        ],
        IDCard: [
          { required: true, message: "请输入身份证号码", trigger: "blur" },
          { pattern: /^\d{15,18}$/, message: "请输入正确的身份证号码", trigger: ["blur", "change"] },
        ],
        phone: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { pattern: /^\d{11}$/, message: "请输入正确的手机号码", trigger: ["blur", "change"] },
        ],
        landline: [{ required: true, message: "请输入座机号码", trigger: "blur" }],
        region: [{ required: true, message: "请选择爱好", trigger: "change" }],
        birthDate: [{ type: "date", required: true, message: "请选择选择出身日期", trigger: "change" }],
        date2: [{ type: "date", required: true, message: "请选择时间", trigger: "change" }],
        type: [{ type: "array", required: true, message: "请至少选择一个活动性质", trigger: "change" }],
        sex: [{ required: true, message: "请选择性别", trigger: "change" }],
        email: [
          { required: true, message: "请填写邮箱", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"] },
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
  },
};
</script>

<style scoped lang="scss"></style>
