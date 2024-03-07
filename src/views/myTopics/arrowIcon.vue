<template>
  <i
    :class="[
      'el-icon',
      {
        'el-icon-arrow-down': activeNames.indexOf(num) > -1 || down,
        'el-icon-arrow-right': activeNames.indexOf(num) < 0 && !down,
      },
    ]"
  ></i>
</template>

<script>
export default {
  name: "arrowIcon",
  props: {
    num: {
      type: [Number, String],
    },
    down: { type: Boolean, default: false },
    activeNames: { type: Array, default: () => [] },
  },
};
</script>

<style lang="scss" scoped>
.el-icon-arrow-right,
.el-icon-arrow-down {
  width: 15px;
  color: #1492ff;
}
</style>
