(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-14ca9c48"],{1859:function(t,e,i){},"77f7":function(t,e,i){"use strict";i("1859")},"8f3c":function(t,e,i){"use strict";i.r(e);var a=function(){var t=this,e=t.$createElement;t._self._c;return t._m(0)},n=[function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{},[i("div",{staticStyle:{height:"100%"},attrs:{id:"chart1"}}),i("div",{staticStyle:{height:"400px"},attrs:{id:"chart2"}})])}],o=i("313e"),r=i("e86a"),m={name:"UserEchart",data(){return{hobby:r.echarts}},components:{},methods:{getArrayProps(t,e){e=e||"value";var i=[];return t&&t.forEach((function(t){i.push(t[e])})),i},initChart1(){let t=o["a"](document.getElementById("chart1"));t.setOption({legend:{orient:"vertical",show:!0,x:"50%",icon:"circle",textStyle:{color:"#464674",fontSize:14,lineHeight:15}},tooltip:{trigger:"item",show:!0,position:["12%","55%"]},series:[{name:"",type:"pie",clockWise:!1,radius:["30%","90%"],center:["24%","55%"],avoidLabelOverlap:!1,label:{normal:{position:"center",show:!1}},emphasis:{label:{show:!0,fontSize:"16",fontWeight:"bold",position:["12%","40%"],formatter:"{b}\n{c}个({d}%)"}},hoverAnimation:!0,data:this.hobby}]},!0)},initChart2(){let t=o["a"](document.getElementById("chart2"));t.setOption({tooltip:{trigger:"axis",axisPointer:{type:"shadow"}},grid:{left:"3%",right:"4%",bottom:"3%",containLabel:!0},xAxis:[{type:"category",data:this.getArrayProps(this.hobby,"name"),axisTick:{alignWithLabel:!0}}],yAxis:[{type:"value",scale:!0,max:100,min:0,splitNumber:10,boundaryGap:[.2,.2]}],series:[{name:"",type:"bar",barWidth:"60%",data:this.getArrayProps(this.hobby,"value")}]},!0)}},mounted(){this.initChart1(),this.initChart2()}},s=m,c=(i("77f7"),i("2877")),d=Object(c["a"])(s,a,n,!1,null,"191266a7",null);e["default"]=d.exports},e86a:function(t){t.exports=JSON.parse('{"work":[{"id":0,"name":"小王","StartTime":"2021-07-15","EndTime":"2022-09-04","company":"湖南成功软件有限公司","position":"实习生"},{"id":1,"name":"小王","StartTime":"2021-07-15","EndTime":"2022-09-01","company":"湖南成功软件ddd有限公司","position":"实习"},{"id":2,"name":"小四","StartTime":"2020-06-11","EndTime":"2021-07-12","company":"湖南堆和栈","position":"前端工程师"},{"id":3,"name":"小张","StartTime":"2020-03-21","EndTime":"2021-05-23","company":"云珠大数据有限公司","position":"前端工程师"},{"id":4,"name":"王五","StartTime":"2017-06-23","EndTime":"2019-09-31","company":"凯普沃克","position":"实习生"},{"id":5,"name":"李四","StartTime":"2020-06-12","EndTime":"2021-09-10","company":"新锐和达","position":"产品经理"}],"study":[{"id":0,"name":"李四","StartTime":"2019-09-01","EndTime":"2021-06-30","company":"湖南涉外经济学院","position":"本科","hobby":"跳舞"},{"id":1,"name":"李武","StartTime":"2019-09-01","EndTime":"2021-06-30","company":"潇湘中学","position":"大专","hobby":"跑步"},{"id":2,"name":"宋天","StartTime":"2019-09-01","EndTime":"2021-06-30","company":"长郡中学","position":"高中","hobby":"看电影"},{"id":3,"name":"立白","StartTime":"2019-09-01","EndTime":"2021-06-30","company":"湖南大学","position":"硕士","hobby":"旅游"},{"id":4,"name":"雕牌","StartTime":"2019-09-01","EndTime":"2021-06-30","company":"北京大学","position":"博士","hobby":"滑行"},{"id":5,"name":"雕牌","StartTime":"2019-09-01","EndTime":"2021-06-30","company":"北京大学","position":"大专","hobby":"滑行"}],"echarts":[{"value":22,"name":"跳舞"},{"value":23,"name":"唱歌"},{"value":25,"name":"滑滑板"},{"value":79,"name":"篮球"},{"value":45,"name":"看书"}]}')}}]);