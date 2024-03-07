<template>
  <div class="data-list__item"  v-loading="source.loading">
    <el-checkbox
      v-model="checkedIds[source.id]"
      @change="treeItemChange($event, source)"
    >
        <el-tooltip  :offset="20" effect="dark" :content="source.count!=null?source.showName+'('+source.count+')':source.showName" placement="top-start">
           <span class="data-list__item--name">{{ source.showName }} {{source.count!=null?'('+source.count+')':''}}</span>
    </el-tooltip>

    </el-checkbox>
    <i
      v-if="!source.isPeople"
      :class="nextClass(source)"
      @click="toNext(source)"
    ></i>
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
    treeItemChange: {
      type: Function,
      default: () => {},
    },
    toNext: {
      type: Function,
      default: () => {},
    },
  },
  methods: {
    nextClass(item) {
      const { id, isNextEmpty } = item || {};
      return [
        "el-icon-arrow-right",
        "data-list__item--next",
        {
          "data-list__item--next--disabled": this.checkedIds[id] || isNextEmpty,
        },
      ];
    },
  },
};
</script>

<style scoped lang="scss">
.data-list__item--name{
  display: inline-block;
  max-width:12rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: top;
}
</style>
