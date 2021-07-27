<template>
  <div class="" style="display: flex">
    <div style="width: 12%; border-right: 1px solid #eee; padding: 1px 20px; margin-top: 30px">
      <el-timeline>
        <el-timeline-item v-for="(activity, index) in timeList" :key="index" size="normal" @click.native="changeStep(index + 1, activity.type)">
          <span slot="dot" :class="activity.type === '1' ? 'checkTimeIndex' : 'unchecktimeIndex'">{{ index + 1 }}</span>
          <p :class="activity.type === '1' ? 'checkName' : 'uncheckName'">{{ activity.name }}</p>
        </el-timeline-item>
      </el-timeline>
    </div>
    <div class="win-page-box" style="width: 85%">
      <div>
        <div class="wordTips">
          <p>提示：变更企业属性会重置列表，请先选择企业属性再填写表格</p>
        </div>
        <div v-show="Step === 1" style="width: 100%">
          <el-form :model="firmData" :rules="rules" ref="firmData" label-width="160px" class="form-box">
            <el-form-item label="企业属性：" prop="enterprise_attribute">
              <el-select v-model="firmData.enterprise_attribute" placeholder="请选择" style="width: 100%" @change="changeHandleClick">
                <el-option v-for="item in typeOp" :key="item.label" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="单位名称：" prop="entName">
              <el-input v-model="firmData.entName" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="单位归属：" prop="is_other_province">
              <el-select v-model="firmData.is_other_province" style="width: 100%">
                <el-option label="本省单位" value="0"></el-option>
                <el-option label="外省单位" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="企业组织机构代码：" prop="instCode">
              <el-input v-model="firmData.instCode" placeholder="请输入最少18位，最多30位的企业组织机构代码"></el-input>
            </el-form-item>
            <el-form-item label="单位简称：" prop="shortName">
              <el-input v-model="firmData.shortName" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="单位法人：" prop="legalName">
              <el-input v-model="firmData.legalName" placeholder="请输入内容"></el-input>
            </el-form-item>
            <!-- <el-form-item label="涉及业务：" prop="sjywMsg">
              <el-select style="width: 100%; height: 40px" v-model="firmData.sjywMsg" multiple placeholder="请选择">
                <el-option v-for="item in timeList" :key="item.id" :label="item.value" :value="item.id"></el-option>
              </el-select>
            </el-form-item> -->
            <!-- <el-form-item :label="gmLabel" prop="annual_waste_scale">
              <el-select v-model="firmData.annual_waste_scale" placeholder="请选择" style="width: 100%">
                <el-option v-for="item in selDataTsIII" :key="item.id" :label="item.value" :value="item.code"></el-option>
              </el-select>
            </el-form-item> -->

            <el-form-item label="设施详细地址：" prop="equipment_address">
              <el-input v-model="firmData.equipment_address"></el-input>
            </el-form-item>
            <el-form-item label="单位地址：" prop="registration_address">
              <el-input v-model="firmData.registration_address"></el-input>
            </el-form-item>
            <el-form-item label="设施所在地环保局：">
              <el-input v-model="firmDataEpaName" disabled></el-input>
            </el-form-item>
            <el-form-item label="设施经纬度：" prop="equipment_longitude" style="width: 100%">
              <el-input v-model="firmData.equipment_longitude" disabled style="width: 14%"></el-input>
              <el-input v-model="firmData.equipment_latitude" disabled style="width: 14%; margin-left: 20px"></el-input>
              <el-button type="primary" style="margin-left: 20px; display: inline-block" @click="markerAg">获取经纬度 </el-button>
            </el-form-item>
            <el-form-item label="联系人：" prop="contacts">
              <el-input v-model="firmData.contacts"></el-input>
            </el-form-item>
            <el-form-item label="联系电话：" prop="contactsTel">
              <el-input v-model="firmData.contactsTel" placeholder="请输入11位手机号码"></el-input>
            </el-form-item>
            <el-form-item label="年总产值（万元）：" prop="total_output_value">
              <el-input v-model="firmData.total_output_value"></el-input>
            </el-form-item>
            <el-form-item label="职工总数：" prop="staff_number">
              <el-input v-model="firmData.staff_number"></el-input>
            </el-form-item>
            <el-form-item label="占地面积（平方米）：" prop="floor_space">
              <el-input v-model="firmData.floor_space"></el-input>
            </el-form-item>
            <el-form-item label="环保负责人姓名：" prop="epb_head">
              <el-input v-model="firmData.epb_head"></el-input>
            </el-form-item>
            <el-form-item label="专职环保人员数：" prop="env_protection_person_count">
              <el-input v-model="firmData.env_protection_person_count"></el-input>
            </el-form-item>
            <el-form-item label="传真号码：" prop="fax">
              <el-input v-model="firmData.fax"></el-input>
            </el-form-item>
            <el-form-item label="邮政编码：" prop="zipCode">
              <el-input v-model="firmData.zipCode"></el-input>
            </el-form-item>
            <el-form-item label="邮箱：" prop="contactsEmail">
              <el-input v-model="firmData.contactsEmail"></el-input>
            </el-form-item>
            <el-form-item label="单位网址：" prop="website">
              <el-input v-model="firmData.website"></el-input>
            </el-form-item>

            <el-form-item label="涉及业务：" style="width: 100%" prop="contain_type">
              <el-checkbox-group v-model="firmData.contain_type" @change="changeqtyw" style="width: 100%">
                <el-checkbox label="1" @change="itemChange('1')">POPs持久性有机物</el-checkbox>
                <el-checkbox label="2" @change="itemChange('2')">渣场</el-checkbox>
                <el-checkbox label="3" @change="itemChange('3')">废弃危险化学品</el-checkbox>
                <el-checkbox label="4" @change="itemChange('4')">生活垃圾处置</el-checkbox>
                <el-checkbox label="5" @change="itemChange('5')">磷石膏</el-checkbox>
                <el-checkbox label="6" @change="itemChange('6')">食用菌</el-checkbox>
                <el-checkbox label="7" @change="itemChange('7')">以上全无</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </div>
        <!-- POPs -->
        <div v-show="Step === 2" style="width: 100%">
          <el-form :model="PopData" :rules="rules" ref="popData" label-width="260px" style="width: 100%">
            <el-form-item label="联系人：" prop="contact">
              <el-input v-model="PopData.contact"></el-input>
            </el-form-item>
            <el-form-item label="联系电话：" prop="contactTel">
              <el-input v-model="PopData.contactTel" placeholder="请输入11位手机号码"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <!-- 渣场 -->
        <div v-show="Step === 3" style="width: 100%">
          <el-form :model="ZcData" :rules="rules" ref="zcData" label-width="200px">
            <el-form-item label="所属企业：">
              <el-input v-model="ZcData.enterprise" disabled></el-input>
            </el-form-item>
            <el-form-item label="矿种（主要成分）：" prop="components">
              <el-select v-model="ZcData.components" placeholder="请选择矿种" multiple filterable allow-create style="width: 100%">
                <el-option v-for="item in kzList" :key="item.id" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="固废属性：" prop="property">
              <el-input v-model="ZcData.property"></el-input>
            </el-form-item>
            <el-form-item label="联系人：" prop="contact">
              <el-input v-model="ZcData.contact"></el-input>
            </el-form-item>
            <el-form-item label="渣场地址：" prop="address">
              <el-input v-model="ZcData.address"></el-input>
            </el-form-item>
            <el-form-item label="联系电话：" prop="contactPhone">
              <el-input v-model="ZcData.contactPhone" placeholder="请输入11位手机号码"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="submitBtn">
      <el-button :loading="IsLoading" type="primary" @click="addFirm('firmData')">保存 </el-button>
      <el-button :loading="IsLoading" style="margin-left: 50px" type="primary" @click="submitClick('firmData')">提交</el-button>
      <el-button style="margin-left: 50px" @click="closeFirm()">取 消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "CompanyAdd",
  data() {
    var checkEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if (!value) {
        return callback(new Error("请输入邮箱"));
      }
      if (mailReg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确的邮箱格式"));
      }
    };
    var checkPhone = (rule, value, callback) => {
      const mailReg = /^1[0-9]{10}$/;
      if (!value) {
        return callback(new Error("请输入联系电话"));
      }
      if (mailReg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确的11位手机号码"));
      }
    };
    var checkZZJGDM = (rule, value, callback) => {
      const mailReg = /^[0-9A-Z\-]*$/;
      if (!value) {
        return callback(new Error("请输入企业组织机构代码"));
      }
      if (mailReg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确格式的企业组织机构代码【大写英文字母(半角)和数字(半角)】"));
      }
    };
    //非负数字
    var checkNum = (rule, value, callback) => {
      if (value) {
        if (!/^\d+(\.\d{1,12})?$/.test(value)) {
          callback(new Error("请输入非负数字"));
        } else {
          callback();
        }
      } else {
        //callback(new Error("请输入贮存能力"));
      }
    };
    //非负整数
    var checkPerson = (rule, value, callback) => {
      if (value) {
        if (!/^\d+$/.test(value)) {
          callback(new Error("请输入非负整数"));
        } else {
          callback();
        }
      } else {
        //callback(new Error("请输入贮存能力"));
      }
    };
    //邮政编码
    var checkyzbm = (rule, value, callback) => {
      if (value) {
        if (!/^[1-9][0-9]{5}$/.test(value)) {
          callback(new Error("邮政编码只能有六位数字"));
        } else {
          callback();
        }
      } else {
      }
    };
    return {
      Step: 1,
      firmData: {
        enterprise: [],
        contain_type: [],
      },
      PopData: {},
      ZcData: {},
      timeList: [
        { name: "基本信息" },
        { name: "PoPs持久性有机物" },
        { name: "渣场" },
        { name: "废气危险化学品" },
        { name: "生活垃圾处理" },
        { name: "磷石膏" },
        { name: "食用菌" },
        { name: "审核情况" },
      ],
      typeOp: [
        {
          label: "产废单位",
          value: "QYSX_CF",
        },
        {
          label: "运输单位",
          value: "QYSX_YS",
        },
        {
          label: "处置单位",
          value: "QYSX_CZ",
        },
      ],
      rules: {
        enterprise_attribute: [{ required: true, message: "请选择企业属性", trigger: "change" }],
        entName: [{ required: true, message: "请输入单位名称", trigger: "blur" }],
        is_other_province: [{ required: true, message: "请选择单位归属", trigger: "blur" }],
        instCode: [
          { required: true, validator: checkZZJGDM, trigger: "blur" },
          { required: true, max: 30, min: 18, message: "请输入正确位数(最少18位，最多30位)的企业组织机构代码", trigger: "blur" },
        ],
        shortName: [{ required: true, message: "请输入单位简称", trigger: "blur" }],
        legalName: [{ required: true, message: "请输入单位法人", trigger: "blur" }],
        sjywMsg: [{ required: true, type: "array", message: "请选择涉及业务", trigger: "change" }],
        annual_waste_scale: [{ required: true, message: "请选择危废产废规模", trigger: "change" }],
        equipment_longitude: [{ required: true, message: "请获取经纬度", trigger: "change" }],
        // selDataTsI: [
        //     {required: true, message: "请选择工商注册地行政区", trigger: "change"}
        // ],
        equipment_address: [{ required: true, message: "请输入设施详细地址", trigger: "blur" }],
        registrationAreaCode: [{ required: true, message: "请输入所属管辖环保局行政区", trigger: "blur" }],
        registration_address: [{ required: true, message: "请输入单位地址", trigger: "blur" }],
        business_licence_no: [{ required: true, message: "请输入营业执照注册号", trigger: "blur" }],
        epb_head: [{ required: true, message: "请输入环保负责人姓名", trigger: "blur" }],
        env_protection_person_count: [
          { required: true, message: "请输入专职环保人员数", trigger: "blur" },
          { validator: checkPerson, required: true, trigger: "blur" },
        ],
        staff_number: [
          { required: true, message: "请输入职工总数", trigger: "blur" },
          { validator: checkPerson, required: true, trigger: "blur" },
        ],
        floor_space: [
          { required: true, message: "请输入占地面积（平方米）", trigger: "blur" },
          { validator: checkNum, required: true, trigger: "blur" },
        ],
        total_output_value: [
          { required: true, message: "请输入年总产值（万元）", trigger: "blur" },
          { validator: checkNum, required: true, trigger: "blur" },
        ],
        contacts: [{ required: true, message: "请输入联系人", trigger: "blur" }],
        contactsTel: [{ required: true, validator: checkPhone, trigger: "blur" }],
        fax: [{ required: true, message: "请输入传真号码,如果没有,请填无", trigger: "blur" }],
        zipCode: [
          { required: true, message: "请输入邮政编码", trigger: "blur" },
          // {max: 6, message: "邮政编码只能有六位数字", trigger: "blur"},
          { validator: checkyzbm, required: true, trigger: "blur" },
        ],
        contactsEmail: [{ required: true, validator: checkEmail, trigger: "blur" }],
        website: [{ required: true, message: "请输入单位网址,如果没有,请填无", trigger: "blur" }],
        industry: [{ required: true, message: "请选择行业类别", trigger: "change" }],
        enterprise_type: [{ required: true, message: "请输入单位类型", trigger: "change" }],
        registered_capital: [
          { required: true, message: "请输入注册资金（万元）", trigger: "blur" },
          { validator: checkNum, required: true, trigger: "blur" },
        ],
        product_sales_volume: [
          { required: true, message: "请输入产品销售额（万元）", trigger: "blur" },
          { validator: checkNum, required: true, trigger: "blur" },
        ],
        gross_investment: [
          { required: true, message: "请输入总投资（万元）", trigger: "blur" },
          { validator: checkNum, required: true, trigger: "blur" },
        ],
        firmDataEpaName: [{ required: true, message: "请输入设施环保局地址", trigger: "blur" }],
        contain_type: [{ required: true, message: "请选择其他业务", trigger: "blur" }],
        contact: [{ required: true, message: "请输入联系人", trigger: "blur" }],
        contact_tel: [{ required: true, validator: checkPhone, trigger: "blur" }],
        contactTel: [{ required: true, validator: checkPhone, trigger: "blur" }],
        contactPhone: [{ required: true, validator: checkPhone, trigger: "blur" }],
        components: [{ required: true, message: "请选择矿种", trigger: "blur" }],
        property: [{ required: true, message: "请输入固废属性", trigger: "blur" }],
        address: [{ required: true, message: "请输入渣场地址", trigger: "blur" }],
        wasteName: [{ required: true, message: "请选择危险化学品名称", trigger: "blur" }],
        status: [{ required: true, message: "请输入预处理及贮存情况", trigger: "blur" }],
        features: [{ required: true, message: "请选择危险特性", trigger: "blur" }],
        facilityName: [{ required: true, message: "请输入生活垃圾处置设施名称", trigger: "blur" }],
        areaCode: [{ required: true, message: "请选择所在市（州）", trigger: "blur" }],
        treatmentProcess: [{ required: true, message: "请选择处理工艺", trigger: "blur" }],
        completionTime: [{ required: true, message: "请选择建成时间", trigger: "blur" }],
        operationTime: [{ required: true, message: "请选择投运时间", trigger: "blur" }],
        designCapacity: [
          { required: true, message: "请输入处理设施能力", trigger: "blur" },
          { validator: checkNum, required: true, trigger: "blur" },
        ],
        leachateTreatmentCapacity: [
          { required: true, message: "请输入渗滤液处理能力", trigger: "blur" },
          { validator: checkNum, required: true, trigger: "blur" },
        ],
        actualLeachateTreatmentCapacity: [
          { required: true, message: "请输入渗滤液实际处理量", trigger: "blur" },
          { validator: checkNum, required: true, trigger: "blur" },
        ],
        isNormalOperation: [{ required: true, message: "请选择设施是否正常运行", trigger: "blur" }],
        isStopUse: [{ required: true, message: "请选择是否停用", trigger: "blur" }],
      },
    };
  },
  components: {},
  methods: {
    changeqtyw() {},
  },
};
</script>

<style lang="scss">
.el-timeline-item__dot {
  left: -9px;
}
.el-timeline-item__tail {
  border-left: 1px dashed #ddd;
}
.el-timeline-item__content {
  line-height: 33px;
  p {
    font-size: 16px;
  }
}
.checkTimeIndex {
  border: 2px solid #24a3e6;
  color: #24a3e6;
}
.unchecktimeIndex {
  border: 2px solid #666;
  color: #666;
}
.checkTimeIndex,
.unchecktimeIndex {
  border-radius: 50%;
  width: 26px;
  height: 26px;
  line-height: 26px;
  text-align: center;
  background: #fff;
  font-size: 16px;
}
.wordTips {
  width: 100% !important;
  margin: 20px 20px;
  background: inherit;
  background-color: rgba(225, 245, 255, 1);
  box-sizing: border-box;
  border-width: 1px;
  border-style: solid;
  border-color: rgba(199, 235, 246, 1);
  border-radius: 4px;
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
  box-shadow: none;
  > p {
    color: #3393cf;
    font-size: 14px;
    padding: 5px 20px;
  }
}
.el-form-item {
  display: inline-block;
  width: 50%;
}

.win-page-box {
  /* margin: 0 -20px;
        padding-left: 20px;*/
  height: 100%;
  /* position: absolute;*/
  bottom: 0;

  > div {
    display: flex;
    flex-wrap: wrap;
    justify-content: left;

    > div {
      width: 50%;
      display: flex;
      flex-wrap: nowrap;
      justify-content: left;
      margin: 10px 20px;

      > div:nth-of-type(1) {
        padding-right: 20px;
        width: 200px;
        text-align: right;
        line-height: 40px;
      }

      > div:nth-of-type(2) {
        width: calc(100% - 250px);
      }
    }
  }
}
.form-box {
  // display: flex;
  //         flex-wrap: wrap;
  //         justify-content: left;
}
.submitBtn {
  padding-bottom: 10px;
  position: fixed;
  bottom: 0;
  right: 0.8%;
  left: 13.8%;
  background: white;
  padding-top: 6px;
  z-index: 1;
  display: flex;
  justify-content: center !important;
}
</style>
