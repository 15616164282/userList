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
    initChart1() {
      // let ser_data = this.formatChart();
      // let count = this.arrCount(ser_data);
      // console.log(ser_data);
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
            // formatter: function (name) {
            //   //找到data中name和文本name值相同的对象
            //   const val = ser_data.filter((item) => {
            //     return item.name === name;
            //   });
            //   // return name + '  ' + ((val[0].value / count).toFixed(4)) * 100 + '%'
            //   return name + "  " + val[0].value + "(" + Math.round((val[0].value / count) * 10000) / 100 + "%" + ")";
            // },
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
      // let ser_data = this.formatChart();
      // let count = this.arrCount(ser_data);
      // console.log(ser_data);
      let myChart = echarts.init(document.getElementById("chart2"));
      myChart.setOption(
        {
          grid: {
            top: "15%",
            left: -30,
            bottom: 0,
            right: 0,
            containLabel: true,
          },
          xAxis: [
            {
              show: true,
              data: this.hobby.name,
              offset: "2",
              type: "category",
              axisLabel: {
                inside: true,
                textStyle: {
                  color: "#fff",
                },
              },
              axisTick: {
                show: true,
              },
              axisLine: {
                show: false,
              },
              splitArea: {
                // 网格区域
                show: false, // 是否显示，默认为false
              },
              splitLine: {
                // gird 区域中的分割线
                show: false, // 是否显示
                lineStyle: {
                  color: "#666",
                  width: 1,
                  type: "dashed",
                },
              },
              z: 10,
            },
            {
              show: true,
              data: [100, 89.2, 92.3, 98.4, 87.7, 88.3, 75.1, 92.5],
              // type: 'category',
              position: "top",
              axisLabel: {
                inside: true,
                textStyle: {
                  color: "#fff",
                },
              },
              axisTick: {
                show: false,
              },
              axisLine: {
                show: false,
              },
              splitArea: {
                // 网格区域
                show: false, // 是否显示，默认为false
              },
              splitLine: {
                // gird 区域中的分割线
                show: false, // 是否显示
                lineStyle: {
                  color: "#666",
                  width: 1,
                  type: "dashed",
                },
              },
              z: 10,
            },
          ],
          yAxis: {
            show: false,
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              textStyle: {
                color: "#999",
              },
            },
            barGap: "10%",
            splitLine: {
              // gird 区域中的分割线
              show: false, // 是否显示
              lineStyle: {
                color: "#666",
                width: 1,
                type: "dashed",
              },
            },
          },
          dataZoom: [
            {
              type: "inside",
            },
          ],
          // toolbox: {
          //   show: false
          // },
          // labelLine: {
          //   show: false
          // },
          series: [
            {
              type: "bar",
              showBackground: false,
              data: this.hobby.value,
              barWidth: "12px", //柱子宽度
              barGap: "-100%",
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: "#ffffff",
                    },
                    {
                      offset: 1,
                      color: "#333",
                    },
                  ]),
                  barBorderRadius: [30, 30, 30, 30],
                },
              },
              label: {
                normal: {
                  show: false,
                  position: "inside",
                  // formatter: '{b}',
                  color: "#464674",
                  textStyle: {
                    fontSize: "14",
                  },
                },
              },
              zlevel: 99,
            },
            {
              type: "bar",
              showBackground: false,
              data: [100, 100, 100, 100, 100, 100, 100, 100],
              barWidth: "24px", //柱子宽度
              barGap: "-150%",
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: "#8ab9ff",
                    },
                    {
                      offset: 1,
                      color: "#706dfc",
                    },
                  ]),
                  barBorderRadius: [30, 30, 30, 30],
                },
              },

              zlevel: 0,
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

<style scoped lang="scss"></style>
