<template>
  <div class="companyAdd" style="display: flex">
    <div style="width: 12%; border-right: 1px solid #eee; padding: 1px 20px; margin-top: 30px">
      <el-timeline>
        <el-timeline-item v-for="(activity, index) in activitieList" :key="index" size="normal" @click.native="changeStep(index + 1, activity.type)">
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
              <el-select v-model="firmData.enterprise_attribute" placeholder="请选择" style="width: 100%">
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
            <el-form-item label="法定代表人：" prop="legalName">
              <el-input v-model="firmData.legalName" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="涉及业务：" prop="sjywMsg">
              <el-input v-model="firmData.sjywMsg" placeholder="请输入内容"></el-input>
              <!-- <el-select style="width: 100%; height: 40px" v-model="firmData.sjywMsg" multiple placeholder="请选择">
                <el-option v-for="item in timeList" :key="item.id" :label="item.value" :value="item.id"></el-option>
              </el-select> -->
            </el-form-item>
            <!-- <el-form-item :label="gmLabel" prop="annual_waste_scale">
              <el-select v-model="firmData.annual_waste_scale" placeholder="请选择" style="width: 100%">
                <el-option v-for="item in selDataTsIII" :key="item.id" :label="item.value" :value="item.code"></el-option>
              </el-select>
            </el-form-item> -->

            <el-form-item label="设施详细地址：" prop="equipment_address">
              <el-input v-model="firmData.equipment_address" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="单位地址：" prop="registration_address">
              <el-input v-model="firmData.registration_address" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="设施所在地环保局：">
              <el-input v-model="firmData.EpaName" disabled placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="设施经度：" prop="equipment_longitude">
              <el-input v-model="firmData.equipment_longitude" disabled> </el-input>
            </el-form-item>
            <el-form-item label="设施纬度：" prop="equipment_longitude">
              <el-input v-model="firmData.equipment_latitude" disabled>
                <el-button
                  slot="append"
                  type="primary"
                  @click="initMap()"
                  style="color: #fff; background-color: #409eff; border-color: #409eff; border-radius: 0px"
                  >获取经纬度</el-button
                >
              </el-input>
            </el-form-item>
            <el-form-item label="联系人：" prop="contacts">
              <el-input v-model="firmData.contacts" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="联系电话：" prop="contactsTel">
              <el-input v-model="firmData.contactsTel" placeholder="请输入11位手机号码"></el-input>
            </el-form-item>
            <el-form-item label="年总产值：" prop="total_output_value">
              <el-input v-model="firmData.total_output_value" placeholder="请输入内容">
                <template slot="append">万元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="职工总数：" prop="staff_number">
              <el-input v-model="firmData.staff_number" placeholder="请输入内容">
                <template slot="append">人</template>
              </el-input>
            </el-form-item>
            <el-form-item label="占地面积：" prop="floor_space">
              <el-input v-model="firmData.floor_space" placeholder="请输入内容">
                <template slot="append">平方米</template>
              </el-input>
            </el-form-item>
            <el-form-item label="注册资金：" prop="floor_space">
              <el-input v-model="firmData.money" placeholder="请输入内容">
                <template slot="append">万元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="环保负责人姓名：" prop="epb_head">
              <el-input v-model="firmData.epb_head" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="专职环保人员数：" prop="env_protection_person_count">
              <el-input v-model="firmData.env_protection_person_count" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="传真号码：" prop="fax">
              <el-input v-model="firmData.fax" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="邮政编码：" prop="zipCode">
              <el-input v-model="firmData.zipCode" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="邮箱：" prop="contactsEmail">
              <el-input v-model="firmData.contactsEmail" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="单位网址：" prop="website">
              <el-input v-model="firmData.website" placeholder="请输入内容"></el-input>
            </el-form-item>

            <el-form-item label="涉及业务：" style="width: 100%" prop="contain_type">
              <el-checkbox-group v-model="firmData.contain_type" @change="changeqtyw" style="width: 100%">
                <el-checkbox label="1" @change="itemChange('1')">POPs持久性有机物</el-checkbox>
                <el-checkbox label="2" @change="itemChange('2')">渣场</el-checkbox>
                <el-checkbox label="3" @change="itemChange('3')" disabled>废弃危险化学品</el-checkbox>
                <el-checkbox label="4" @change="itemChange('4')" disabled>生活垃圾处置</el-checkbox>
                <el-checkbox label="5" @change="itemChange('5')" disabled>磷石膏</el-checkbox>
                <el-checkbox label="6" @change="itemChange('6')" disabled>食用菌</el-checkbox>
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
                <el-option v-for="item in kzList" :key="item" :value="item"></el-option>
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
      <el-button style="margin-left: 50px" type="primary" @click="submitClick('firmData')">提交</el-button>
      <el-button style="margin-left: 50px" @click="closeFirm()">取 消</el-button>
    </div>
    <!-- 地图弹窗 -->
    <div class="map-show-box" v-show="dialogVisible">
      <div class="map-tit">
        <div class="map-tit-txt">
          <div>经度：</div>
          <div style="margin-right: 20px">
            <el-input v-model="firmData.equipment_longitude"></el-input>
          </div>
          <div>纬度：</div>
          <div>
            <el-input v-model="firmData.equipment_latitude"></el-input>
          </div>
        </div>
        <div>
          <el-button type="primary" @click="dialogVisible = false">确定</el-button>
          <el-button type="primary" @click="dialogVisible = false">返回</el-button>
        </div>
      </div>
      <div id="map-address"></div>
    </div>
    <div class="modal" v-show="dialogVisible"></div>
  </div>
</template>

<script>
import axios from "axios";
import qs from "qs";
import "ol/ol.css";
import { Map, Feature, View, Overlay } from "ol";
import { Point } from "ol/geom";
import { Vector as VectorSource, OSM, XYZ, TileArcGISRest, TileWMS } from "ol/source";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { Circle, Fill, Stroke, Style, Text, Icon } from "ol/style";
import { click, pointerMove, altKeyOnly } from "ol/events/condition";
import { transform } from "ol/proj";
export default {
  name: "CompanyAdd",
  components: {},
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
      map: null,
      center: [107.246058, 26.644852],
      overlay: null,
      siteDesObj: {},
      overlayId: 1,
      pointImage: require("../assets/point_normal.png"),
      layers: {
        pointLayer: null,
        riverLayer: null,
        contourLayer: null,
        drawLayer: null,
      },
      olUid: 0,
      selectedFeature: null,
      plotFunctions: null,
      Step: 1,
      firmData: {
        enterprise: [],
        contain_type: [],
        is_other_province: "",
        equipment_longitude: "",
        equipment_latitude: "",
      },
      PopData: {},
      ZcData: {},
      dialogVisible: false,
      kzList: ["锡矿", "铜矿", "铅矿", "煤矿"],
      activitieList: [
        { name: "基本信息", type: "1", value: "0" },
        { name: "POPs持久性有机物", type: "0", value: "1" },
        { name: "渣场", type: "0", value: "2" },
        { name: "废弃危险化学品", type: "0", value: "3" },
        { name: "生活垃圾处置", type: "0", value: "4" },
        { name: "磷石膏", type: "0", value: "5" },
        { name: "食用菌", type: "0", value: "6" },
        { name: "审核情况", type: "0", value: "7" },
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
        is_other_province: [{ required: true, message: "请选择单位归属", trigger: ["blur", "change"] }],
        instCode: [
          { required: true, validator: checkZZJGDM, trigger: "blur" },
          { required: true, max: 30, min: 18, message: "请输入正确位数(最少18位，最多30位)的企业组织机构代码", trigger: "blur" },
        ],
        shortName: [{ required: true, message: "请输入单位简称", trigger: "blur" }],
        legalName: [{ required: true, message: "请输入单位法人", trigger: "blur" }],
        sjywMsg: [{ required: true, message: "请选择涉及业务", trigger: "blur" }],
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
  methods: {
    changeStep(step, type) {
      console.log(step, type);
      this.Step = step;
      if (type === "1") {
        if (step === 2) {
          if (this.PopData.contact === "") {
            this.PopData.contact = this.firmData.contacts;
          }
          if (this.PopData.contactTel === "") {
            this.PopData.contactTel = this.firmData.contactsTel;
          }
        } else if (step === 3) {
          // this.queryKZDatas();
          this.ZcData.enterprise = this.firmData.entName;
          if (this.ZcData.contact === "") {
            this.ZcData.contact = this.firmData.contacts;
          }
          if (this.ZcData.contactPhone === "") {
            this.ZcData.contactPhone = this.firmData.contactsTel;
          }
        } else if (step === 7) {
          if (this.SyjData.contact === "") {
            this.SyjData.contact = this.firmData.contacts;
          }
          if (this.SyjData.contactTel === "") {
            this.SyjData.contactTel = this.firmData.contactsTel;
          }
        }
      }
    },
    //切换其他业务复选框
    changeqtyw(val) {
      // for (let j = 1; j < this.activitieList.length; j++) {
      //   this.activitieList[j].type = "0";
      //   for (let i = 0; i <script val.length; i++) {
      //     if (val[i] === this.activitieList[j].value) {
      //       this.activitieList[j].type = "1";
      //     }
      //   }
      // }
    },
    //获取当前点击【其他业务】复选框
    itemChange(val) {
      if (val === "7") {
        this.firmData.contain_type = ["7"];
      } else {
        if (this.firmData.contain_type.indexOf("7") === 0) {
          this.firmData.contain_type.splice(0, 1);
        }
      }
    },
    //提交校验
    submitClick(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.firmData.contain_type[0] === "7") {
            this.submit();
          } else {
            this.firmData.contain_type.forEach((item) => {
              if (item === "1") {
                this.$refs["popData"].validate((valid) => {
                  if (!valid) {
                    this.$message({
                      message: "请点击左侧POPs持久性有机物，把相关信息填写完整！",
                      type: "warning",
                    });
                    console.log("error submit!!");
                    return false;
                  } else {
                    this.firmData.enterprisePopsInfo = this.PopData;
                    this.submit();
                  }
                });
              } else if (item === "2") {
                this.$refs["zcData"].validate((valid) => {
                  if (!valid) {
                    this.$message({
                      type: "error",
                      message: "请点击左侧渣场，把相关信息填写完整！",
                    });
                    return false;
                  } else {
                    this.firmData.entInfoSlagFieldBaseInformation = this.ZcData;
                    this.submit();
                  }
                });
              }
            });
          }
        } else {
          this.$message({
            message: "请填写完基本信息",
            type: "warning",
          });
          console.log("error submit!!");
          return false;
        }
      });
    },
    //提交
    submit() {
      axios
        .post("/api", qs.stringify(this.firmData, { arrayFormat: "indices", allowDots: true }))
        .then((res) => {
          console.log(res.data);
          if (res.data.ret) {
          } else {
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //初始化地图
    initMap() {
      this.dialogVisible = true;
      this.map = new Map({
        //地图div id
        target: "map-address",
        //图层，可以添加多个，也可以之后再添加
        //crossOrigin: 'anonymous' 为跨域地图的处理，不然canvas不能导出图片
        layers: [
          //街景地图
          new TileLayer({
            source: new OSM(),
            crossOrigin: "anonymous",
          }),
          //XYZ地图
          new TileLayer({
            source: new XYZ({
              url: "http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=469cfd9c133f30baaf3f94a9cd848c47",
              crossOrigin: "anonymous",
            }),
          }),
          new TileLayer({
            source: new XYZ({
              url: "http://t1.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=469cfd9c133f30baaf3f94a9cd848c47",
              crossOrigin: "anonymous",
            }),
          }),

          //切片影像图
          // new TileLayer({
          //   source: new TileWMS({
          //     url: 'https://ahocevar.com/geoserver/wms',
          //     params: {
          //       'LAYERS': 'ne:NE1_HR_LC_SR_W_DR'
          //     },
          //     crossOrigin: 'anonymous'
          //   })
          // }),
          //滇池流域矢量图（Arcgis地图）
          // new TileLayer({
          //   source: new TileArcGISRest({
          //     url: "http://192.168.2.21:6080/arcgis/rest/services/dcly_hlm/MapServer"
          //   }),
          // }),
        ],
        //视图，这里设置坐标系
        view: new View({
          center: this.center,
          zoom: 7.8,
          minZoom: 7,
          maxZoom: 18,
          projection: "EPSG:4326",
        }),
      });
      // //添加点位图层
      this.layers.pointLayer = new VectorLayer({
        source: new VectorSource(),
        //设置渲染方式
        renderMode: "vector",
        //渲染方式为"vector"时，图层可以在交互时渲染
        updateWhileInteracting: true,
        //渲染方式为"ventor"时，图层可以在移动时渲染，可以解决地图移动结束以后点位图标才改变的情况
        updateWhileAnimating: true,
      });
      this.map.addLayer(this.layers.pointLayer);
      this.layers.pointLayer.setZIndex(0);
      this.map.on("click", (e) => {
        console.log(Math.round(e.coordinate[0] * 1000000) / 1000000);
        let longitude = Math.round(e.coordinate[0] * 1000000) / 1000000;
        let latitude = Math.round(e.coordinate[1] * 1000000) / 1000000;
        this.addPoint(longitude, latitude);
      });
    },

    //   // 添加点位数据
    addPoint(x, y, attributes) {
      let vectorSource = this.layers.pointLayer.getSource();
      if (this.olUid > 0) {
        vectorSource.removeFeature(vectorSource.getFeatureById(this.olUid));
        this.olUid = this.olUid - 1;
      }
      const point = new Feature({
        geometry: new Point([x, y]),
        type: "point",
      });
      point.setStyle(
        new Style({
          image: new Icon({
            src: this.pointImage,
            anchor: [0.5, 0.5], //锚点
          }),
          zIndex: 110,
        })
      );
      // point.setProperties(attributes);
      //设置点位id，这样可以用source.getFeatureById 找到
      this.olUid = this.olUid + 1;
      point.setId(this.olUid);
      this.firmData.equipment_longitude = x;
      this.firmData.equipment_latitude = y;
      this.layers.pointLayer.getSource().addFeature(point);
    },
  },
  mounted() {
    // this.initMap();
  },
};
</script>

<style lang="scss">
.companyAdd {
  #map-address {
    // position: relative;
    width: 100%;
    height: 640px;
  }
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
  .checkName {
    color: #24a3e6;
  }
  .uncheckName {
    color: #666;
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

      margin-bottom: 56px;
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
  .map-show-box {
    position: fixed;
    z-index: 999;
    top: 160px;
    left: 280px;
    width: calc(100vw - 400px);
    // height: 700px;
    overflow: auto;
    margin: 0;
    background-color: #ffffff;
    border: 1px solid #cccccc;

    .map-tit {
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      padding: 0 20px;
      height: 60px;
      line-height: 60px;

      .map-tit-txt {
        display: flex;
        justify-content: flex-start;
      }
    }

    /deep/ .amap-logo {
      display: none !important;
    }

    /deep/ .amap-container {
      cursor: default;
    }

    .map-txt {
      position: absolute;
      right: 5px;
      bottom: 5px;
      color: #ffffff;
      pointer-events: none;
    }
  }
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(51, 48, 47, 0.5);
    z-index: 900;
  }
}
</style>
