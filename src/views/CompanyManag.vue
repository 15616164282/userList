<template>
  <div class="CompanyManag">
    <el-timeline>
      <el-timeline-item timestamp="基本信息" placement="top" icon="el-icon-success" color="#24A3E6" size="large">
        <span slot="dot" class="timeIndex">1</span>
        <div class="normalForm">
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td>单位名称</td>
              <td colspan="3">{{ firmData.entName || "-" }}</td>
            </tr>
            <tr>
              <td>企业属性</td>
              <td>
                {{
                  firmData.enterprise_attribute == "QYSX_CF"
                    ? "产废单位"
                    : firmData.enterprise_attribute == "QYSX_YS"
                    ? "运输单位"
                    : firmData.enterprise_attribute == "QYSX_CZ"
                    ? "处置单位"
                    : "-"
                }}
              </td>
              <td>单位归属</td>
              <td>{{ firmData.is_other_province == "0" ? "本省单位" : firmData.is_other_province == "1" ? "外省单位" : "-" }}</td>
            </tr>
            <tr>
              <td>单位简称</td>
              <td>{{ firmData.shortName || "-" }}</td>
              <td>企业组织机构代码</td>
              <td>{{ firmData.instCode || "-" }}</td>
            </tr>
            <tr>
              <td>单位法人</td>
              <td>{{ firmData.legalName || "-" }}</td>
              <td>邮政编码</td>
              <td>{{ firmData.zipCode || "-" }}</td>
            </tr>
            <tr>
              <td>涉及业务</td>
              <td>{{ firmData.sjywMsg || "-" }}</td>
              <td>
                {{
                  firmData.enterprise_attribute == "QYSX_CF"
                    ? "危废产废规模"
                    : firmData.enterprise_attribute == "QYSX_YS"
                    ? "危废运输规模"
                    : firmData.enterprise_attribute == "QYSX_CZ"
                    ? "危废经营规模"
                    : "-"
                }}
              </td>
              <td>{{ firmData.annual_waste_scale || "-" }}</td>
            </tr>
            <tr>
              <td>单位地址</td>
              <td colspan="3">{{ firmData.equipment_address || "-" }}</td>
            </tr>
            <tr>
              <td>设施详细地址</td>
              <td colspan="3">{{ firmData.equipment_address || "-" }}</td>
            </tr>
            <tr>
              <td>设施经纬度</td>
              <td>{{ firmData.equipment_longitude }}-{{ firmData.equipment_latitude }}</td>
              <td>所属管辖环保局行政区</td>
              <td>{{ firmData.area_code || "-" }}</td>
            </tr>
            <tr>
              <td>设施所在地环保局</td>
              <td>{{ firmData.firmDataEpaName || "-" }}</td>
              <td>环保负责人姓名</td>
              <td>{{ firmData.epb_head || "-" }}</td>
            </tr>
            <tr>
              <td>专职环保人员数</td>
              <td>{{ firmData.env_protection_person_count || "-" }}</td>
              <td>职工总数</td>
              <td>{{ firmData.staff_number || "-" }}</td>
            </tr>
            <tr>
              <td>占地面积（平方米）</td>
              <td>{{ firmData.floor_space || "-" }}</td>
              <td>年总产值（万元）</td>
              <td>{{ firmData.total_output_value || "-" }}</td>
            </tr>
            <tr>
              <td>联系人</td>
              <td>{{ firmData.contacts || "-" }}</td>
              <td>联系电话</td>
              <td>{{ firmData.contactsTel || "-" }}</td>
            </tr>
            <tr>
              <td>所属行业</td>
              <td colspan="3">{{ firmData.industry || "-" }}</td>
            </tr>
            <tr>
              <td>单位类型</td>
              <td>{{ firmData.enterprise_type || "-" }}</td>
              <td>总投资（万元）</td>
              <td>{{ firmData.gross_investment || "-" }}</td>
            </tr>
            <tr>
              <td>传真号码</td>
              <td>{{ firmData.fax || "-" }}</td>
              <td>注册资金（万元）</td>
              <td>{{ firmData.registered_capital || "-" }}</td>
            </tr>
            <tr>
              <td>邮箱</td>
              <td>{{ firmData.contactsEmail || "-" }}</td>
              <td>产品销售额（万元）</td>
              <td>{{ firmData.product_sales_volume || "-" }}</td>
            </tr>
            <tr>
              <td>单位网址</td>
              <td colspan="3">{{ firmData.website || "-" }}</td>
            </tr>
          </table>
        </div>
      </el-timeline-item>
      <el-timeline-item
        v-if="firmData.enterprisePopsInfo !== null"
        timestamp="POPs持久性有机物"
        placement="top"
        icon="el-icon-success"
        color="#24A3E6"
        size="large"
      >
        <span slot="dot" class="timeIndex">2</span>
        <div class="normalForm">
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td>联系人</td>
              <td>{{ PopData.contact || "-" }}</td>
              <td>联系电话</td>
              <td>{{ PopData.contactTel || "-" }}</td>
            </tr>
          </table>
        </div>
      </el-timeline-item>
      <el-timeline-item v-else timestamp="POPs持久性有机物" placement="top" icon="el-icon-success" color="#24A3E6" size="large">
        <span slot="dot" class="timeIndex">2</span>
        <div class="normalForm">
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td>是否涉及</td>
              <td colspan="3">否</td>
            </tr>
          </table>
        </div>
      </el-timeline-item>
      <el-timeline-item
        v-if="this.firmData.entInfoSlagFieldBaseInformation !== null"
        timestamp="渣场"
        placement="top"
        icon="el-icon-success"
        color="#24A3E6"
        size="large"
      >
        <span slot="dot" class="timeIndex">3</span>
        <div class="normalForm">
          <table cellpadding="0" cellspacing="0">
            <tr>
              <!--<td>所属企业</td><td>{{ZcData.enterprise||'-'}}</td>-->
              <td>矿种（主要成分）</td>
              <td>{{ ZcData.components || "-" }}</td>
              <td>固废属性</td>
              <td>{{ ZcData.property || "-" }}</td>
            </tr>
            <tr>
              <td>联系人</td>
              <td>{{ ZcData.contact || "-" }}</td>
              <td>联系电话</td>
              <td>{{ ZcData.contactPhone || "-" }}</td>
            </tr>
            <tr>
              <td>渣场地址</td>
              <td colspan="3">{{ ZcData.address || "-" }}</td>
            </tr>
          </table>
        </div>
      </el-timeline-item>
      <el-timeline-item v-else timestamp="渣场" placement="top" icon="el-icon-success" color="#24A3E6" size="large">
        <span slot="dot" class="timeIndex">3</span>
        <div class="normalForm">
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td>是否涉及</td>
              <td colspan="3">否</td>
            </tr>
          </table>
        </div>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import companyData from "../json/company.json";
export default {
  name: "CompanyManag",
  data() {
    return {
      firmData: companyData.company,
      PopData: companyData.company.enterprisePopsInfo,
    };
  },
  components: {},
  methods: {},
};
</script>

<style lang="scss">
.CompanyManag {
  padding: 20px;
  .timeIndex,
  .timeIndexUnfinished {
    width: 26px;
    height: 26px;
    text-align: center;
    border-radius: 50%;
    background: #fff;
    font-size: 16px;
    line-height: 22px;
    font-weight: 600;
    font-family: "华文中宋";
  }
  .timeIndex {
    border: 2px solid #24a3e6;
    color: #24a3e6;
  }
  .timeIndexUnfinished {
    border: 2px solid #666;
    color: #666;
  }
  .el-timeline-item__dot {
    left: -9px;
  }
  .el-timeline-item__tail {
    border-left: 1px dashed #ddd;
  }
  .el-timeline-item__timestamp {
    color: #24a3e6;
    font-size: 16px;
  }
  .el-timeline-item__timestamp.is-top {
    padding-top: 8px;
  }

  /deep/.el-form-item {
    display: inline-block;
    width: 50%;
  }
  /deep/.el-input.is-disabled .el-input__inner {
    background: #fff;
    color: #606266;
  }

  .normalForm {
    font-size: 14px;
    > table {
      width: 100%;
      margin: 0 auto;
      box-sizing: content-box;
      //border-collapse: inherit;
      border-top: 1px solid #e9e9e9;
      border-collapse: separate;
      border-radius: 4px;

      > tr {
        box-sizing: content-box;
        > td {
          background: transparent;
          color: #333333;
          //border : 1px solid #e9e9e9;
          border-bottom: 1px solid #e9e9e9;
          line-height: 35px;
          height: 35px;
          padding: 3px 10px;
          &:nth-child(2n-1) {
            background: #e3f1ff none repeat scroll 0 0;
            width: 300px;
            border-left: 1px solid #e9e9e9;
            border-right: 1px solid #e9e9e9;
          }
          &:nth-child(2n) {
            width: 450px;
            background: #fff none repeat scroll 0 0;
          }
          &:last-child {
            border-right: 1px solid #e9e9e9;
          }
        }
      }
    }
  }
}
</style>
