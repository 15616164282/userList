<template>
  <div class="">
    <div id="chart1" style="height: 100%"></div>
    <div id="chart2" style="height: 100%"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import userData from "../json/user.json";
export default {
  name: "UserEchart",
  data() {
    return {
      hobby: userData.echarts,
    };
  },
  components: {},
  methods: {
    getArrayProps(array, key) {
      let key = key || "value";
      let res = [];
      if (array) {
        array.forEach(function (t) {
          res.push(t[key]);
        });
      }
      return res;
    },
    initChart1() {
      let myChart = echarts.init(document.getElementById("chart1"));
      myChart.setOption(
        {
          legend: {
            orient: "vertical",
            show: true,
            x: "50%",
            // y: '%',
            // width: '250px',
            // height: '150px',
            icon: "circle",
            textStyle: {
              color: "#464674",
              fontSize: 14,
              lineHeight: 15,
            },
          },
          tooltip: {
            trigger: "item",
            show: true,
            position: ["12%", "55%"],
          },
          series: [
            {
              name: "",
              type: "pie",
              clockWise: false,
              radius: ["30%", "90%"], //调整饼图的大小，两个值的差=圆的宽度
              center: ["24%", "55%"], //调整饼图的位置，xy上的值
              avoidLabelOverlap: false,
              label: {
                normal: {
                  position: "center",
                  show: false,
                },
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: "16",
                  fontWeight: "bold",
                  position: ["12%", "40%"],
                  formatter: "{b}\n{c}个({d}%)",
                },
              },
              hoverAnimation: true,
              data: this.hobby,
            },
          ],
        },
        true
      );
    },
    initChart2() {
      let myChart = echarts.init(document.getElementById("chart2"));
      myChart.setOption(
        {
          tooltip: {
            trigger: "axis",
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
            },
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true,
          },
          xAxis: [
            {
              type: "category",
              data: this.getArrayProps(this.hobby, "name"),
              axisTick: {
                alignWithLabel: true,
              },
            },
          ],
          yAxis: [
            {
              type: "value",
              scale: true,
              max: 100,
              min: 0,
              splitNumber: 5,
              lineHeight: "100px",
              boundaryGap: [0.2, 0.2],
            },
          ],
          series: [
            {
              name: "",
              type: "bar",
              barWidth: "60%",
              data: this.getArrayProps(this.hobby, "value"),
            },
          ],
        },
        true
      );
    },
  },
  mounted() {
    this.initChart1();
    this.initChart2();
  },
};
</script>

<style scoped lang="scss">
#chart2 {
  margin-top: 25px;
}
</style>
