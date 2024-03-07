<template>
  <div class="line-chart">
    <item-header title="议题分析" @timeChange="timeChange" />
    <div
      ref="chart"
      class="chart-container"
      style="height: 280px; width: 100%; margin-top: -40px"
    ></div>
  </div>
</template>

<script>
import { orgTopicGroupByMonth } from "@/api/statisticalAnalysis/index.js";
import resize from "@/mixins/resize.js";
import * as echarts from "echarts";
import ItemHeader from "./components/ItemHeader.vue";

export default {
  name: "LineChart",
  mixins: [resize],
  components: {
    ItemHeader,
  },
  data() {
    return {
      chart: null,
      timeObject: {},
      options: {
        legend: {
          type: "plain",
          top: 0,
          left: 120,
          itemGap: 64,
          itemWidth: 10,
          icon: "circle",
          selectedMode: false,
          textStyle: { padding: [0, 0, 0, 4] },
          data: ["百姓议事", "乡贤参事"],
        },
        grid: {
          left: 50,
          top: 50,
          bottom: 20,
          right: 50,
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
        },
        tooltip: {
          trigger: "axis",
          padding: [12, 17, 20, 23],
          textStyle: { color: "#424242" },
          renderMode: "html",
          className: "tooltip",
        },
        series: [
          {
            name: "百姓议事",
            type: "line",
            data: [],
            smooth: true,
            showSymbol: true,
            symbolSize: 6,
            symbol: "circle",
            itemStyle: { color: "#0539c2" },
            lineStyle: { width: 2, color: "#0539c2" },
            areaStyle: {
              opacity: 1,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(0, 110, 254, 0.1)",
                },
                {
                  offset: 1,
                  color: "rgba(0, 110, 254, 0)",
                },
              ]),
            },
          },
          {
            name: "乡贤参事",
            type: "line",
            data: [],
            smooth: true,
            showSymbol: true,
            symbolSize: 6,
            symbol: "circle",
            itemStyle: { color: "#47dedd" },
            lineStyle: { width: 2, color: "#47dedd" },
            areaStyle: {
              opacity: 1,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(27, 179, 137, 0.1)",
                },
                {
                  offset: 1,
                  color: "rgba(27, 179, 137, 0)",
                },
              ]),
            },
          },
        ],
      },
    };
  },
  methods: {
    async init() {
      const result = await orgTopicGroupByMonth({
        orgId: this.$store.getters.orgInfo.id,
        ...this.timeObject,
      });
      [
        this.options.series[0].data,
        this.options.series[1].data,
        this.options.xAxis.data,
      ] = result.reduce((res, { bxNum, xxNum, month }) => {
        (res[0] || (res[0] = [])).push(bxNum);
        (res[1] || (res[1] = [])).push(xxNum);
        (res[2] || (res[2] = [])).push(month);
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
.line-chart {
  background-color: #fff;
  margin: 20px 0;
}
</style>
