<template>
  <div class="statistical-analysis custom-main-container">
    <div class="statistical-category">
      <div
        class="statistical-category-item"
        v-for="item in categorys"
        :key="item.title"
        :style="{ 'background-image': `url(${item.bgImg})` }"
      >
        <p class="statistical-category-item__title">{{ item.title }}</p>
        <h3 class="statistical-category-item__count">{{ item.count }}</h3>
      </div>
    </div>
    <line-chart class="statistical-topic" />
    <bar-chart class="statistical-topic-types" />
  </div>
</template>

<script>
import { queryOrgTopicNum } from "@/api/statisticalAnalysis/index.js";
import LineChart from "./lineChart.vue";
import BarChart from "./barChart.vue";
import "@/styles/customMain/index.scss";

export default {
  components: {
    LineChart,
    BarChart,
  },
  data() {
    return {
      categorys: [
        {
          title: "百姓议事总数",
          bgImg: require("@/assets/img/statistical-1.png"),
          count: 0,
        },
        {
          title: "乡贤参事总数",
          bgImg: require("@/assets/img/statistical-2.png"),
          count: 0,
        },
        {
          title: "议事总数",
          bgImg: require("@/assets/img/statistical-3.png"),
          count: 0,
        },
      ],
    };
  },
  created() {
    this.queryOrgTopicNum();
  },
  methods: {
    async queryOrgTopicNum() {
      const { bxNum, xxNum, num } = await queryOrgTopicNum(
        this.$store.getters.orgInfo.id
      );
      this.categorys[0].count = bxNum;
      this.categorys[1].count = xxNum;
      this.categorys[2].count = num;
    },
  },
};
</script>

<style lang="scss" scoped>
.statistical {
  &-analysis {
  }
  &-category {
    display: flex;
    background-color: #fff;
    padding: 15px 0;
    border-radius: 10px;
    &-item {
      width: 24%;
      height: 110px;
      background-repeat: no-repeat;
      background-position: center;
      background-size: 100% 100%;
      padding: 20px 0 0 40px;
      border-radius: 16px;
      box-sizing: border-box;
      margin-right: 7%;
      &:first-child {
        margin-left: 7%;
      }
      &__title {
        margin-bottom: 21px;
        font-size: 16px;
        color: #f3f4fa;
      }
      &__count {
        margin: 0;
        font-size: 26px;
        font-weight: 500;
        color: #f3f4fa;
      }
    }
  }
}
</style>
