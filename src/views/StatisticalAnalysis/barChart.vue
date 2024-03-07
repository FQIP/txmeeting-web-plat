<template>
  <div class="bar-chart">
    <item-header title="议题类型分析" @timeChange="timeChange" />
    <div
      ref="chart"
      class="chart-container"
      style="height: 250px; width: 100%"
    ></div>
  </div>
</template>

<script>
import { orgTopicGroupByType } from "@/api/statisticalAnalysis/index.js";
import resize from "@/mixins/resize.js";
import * as echarts from "echarts";
import ItemHeader from "./components/ItemHeader.vue";

let itemsPercent = [];

export default {
  name: "BarChart",
  mixins: [resize],
  components: {
    ItemHeader,
  },
  data() {
    return {
      chart: null,
      timeObject: {},
      options: {
        grid: {
          left: "0",
          right: "0%",
          top: "5%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: [],
          axisLine: { lineStyle: { color: "#ccc" } },
          axisLabel: {
            interval: 0,
            textStyle: {
              color: "#666666",
            },
          },
        },
        yAxis: {
          type: "value",
          splitLine: {
            lineStyle: {
              // 使用深浅的间隔色
              color: ["#B5B5B5"],
              type: "dashed",
              opacity: 0.5,
            },
          },
          axisLabel: {},
        },
        tooltip: {
          axisPointer: {
            type: "shadow",
          },
          borderColor: "rgba(255, 255, 255, 0.8)",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          formatter: function (params) {
            let str = `${params.name}<br />`;
            str += `<span style="display: inline-block; width: 40px; text-align: right; margin-right: 10px">议题数</span>${params.data}<br />`;
            str += `<span style="display: inline-block; width: 40px; text-align: right; margin-right: 10px">占比</span>${
              itemsPercent[params.dataIndex]
            }%`;
            return str;
          },
        },
        series: [
          {
            type: "bar",
            barWidth: "20%",
            itemStyle: {
              color: "#7781FF",
              borderRadius: [2, 2, 0, 0],
            },
            data: [],
          },
        ],
      },
    };
  },
  methods: {
    async init() {
      const result = await orgTopicGroupByType({
        orgId: this.$store.getters.orgInfo.id,
        ...this.timeObject,
      });
      const wrapText = (str) => str.replace(/(.{6})/g, "$1\n"); // 对文字进行换行
      [this.options.series[0].data, this.options.xAxis.data, itemsPercent] =
        result.reduce((res, { topicNum, topicTypeName, prop }) => {
          (res[0] || (res[0] = [])).push(topicNum);
          (res[1] || (res[1] = [])).push(wrapText(topicTypeName));
          (res[2] || (res[2] = [])).push(prop);
          return res;
        }, []);
      this.initChart();
    },
    initChart() {
      let chart = this.$refs["chart"];
      this.chart = echarts.init(chart);
      this.chart.setOption(this.options);
    },
    timeChange(timeRange) {
      [this.timeObject.startTime, this.timeObject.endTime] = timeRange || [];
      this.init();
    },
  },
};
</script>

<style lang="scss" scoped>
.bar-chart {
  background-color: #fff;
}
.chart-container {
  padding: 0 3%;
}
</style>
