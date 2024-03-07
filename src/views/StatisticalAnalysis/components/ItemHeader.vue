<template>
  <div class="item-header">
    <span class="item-header__title">{{ title }}</span>
    <slot></slot>
    <div class="item-header__time-picker">
      <el-date-picker
        v-model="monthRange"
        type="monthrange"
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="开始月份"
        end-placeholder="结束月份"
        align="right"
        :picker-options="pickerOptions"
        @change="$emit('timeChange', $event)"
      />
    </div>
  </div>
</template>

<script>
import { recentOneYear } from "@/utils/index.js";
export default {
  name: "ItemHeader",
  props: {
    title: String,
  },
  data() {
    return {
      monthRange: [],
      pickerOptions: {
        onPick(date) {},
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
    };
  },
  mounted() {
    this.monthRange = recentOneYear();
    this.$emit("timeChange", this.monthRange);
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.item-header {
  padding: 20px;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 99;
  &::before {
    content: "";
    display: inline-block;
    height: 17px;
    width: 6px;
    background-color: #387bfc;
    border-radius: 5px;
    margin-right: 12px;
  }
  &__title {
    font-size: 14px;
    font-weight: bold;
    color: #666666;
  }
  &__time-picker {
    position: absolute;
    right: 20px;
    ::v-deep {
      .el-input__icon {
        height: 32px;
      }
    }
  }
}
</style>
