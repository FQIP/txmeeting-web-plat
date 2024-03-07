<template>
  <div class="data-list__item">
    <el-checkbox
      v-model="checkedIds[source.id]"
      @change="searchItemChange($event, source)"
    >
      <span class="data-list__item--name">{{ source.showName }}</span>
    </el-checkbox>
  </div>
</template>

<script>
export default {
  name: "SearchItem",
  props: {
    source: {
      type: Object,
      default() {
        return {};
      },
    },
    checkedIds: {
      type: Object,
      default() {
        return {};
      },
    },
    searchItemChange: {
      type: Function,
      default: () => {},
    },
  },
  methods: {},
};
</script>

<style scoped lang="scss"></style>
