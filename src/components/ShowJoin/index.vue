<template>
  <el-dialog
    title="已选择对象"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :show-close="false"
    custom-class="showJoin"
    width="40%"
    :modal="false"
    v-if="visible"
  >
    <div class="join-objects__checked" style="height: 300px; overflow: auto">
      <el-tag v-for="object in checkedObjects" :key="object.id">
        <i
          :class="object.isOrg ? 'el-icon-office-building' : 'el-icon-user'"
        ></i>
        {{ object.showName }}
      </el-tag>
    </div>
    <div style="text-align: center; padding-bottom: 20px">
      <el-button @click="handleCancel">返回</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { name } from "dayjs/locale/zh-cn";

export default {
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
    checkedObjectList: {
      type: [Array, Object],
    },
  },
  name: "ShowJoin",
  data() {
    return {
      checkedObjects: [],
    };
  },
  watch: {
    checkedObjectList: {
      handler(v) {
        if (v) {
          this.checkedObjects = [...v];
        }
      },
      immediate: true,
    },
  },
  methods: {
    handleCancel() {
      this.$emit("update:visible", false);
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep {
  .el-tag {
    margin-right: 5px;
    margin-bottom: 5px;
  }
}
</style>
<style lang="scss">
.el-dialog.showJoin {
  margin-left: 50vw;
}
</style>
