<template>
  <div>
    <el-form :model="form" label-width="140px">
      <el-form-item label="投票方式" prop="voteWay">
        <el-radio-group v-model="form.voteWay" :disabled="true">
          <el-radio label="0">单选</el-radio>
          <el-radio label="1">多选</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="投票对象" prop="voteObject">
        <el-input
          disabled
          v-show="form.voteObject != ''"
          class="showNameBox"
          :value="form.voteObject"
          @click.native="
            (visible = true), (checkedObjectList = form.checkedObjectList)
          "
        />
      </el-form-item>
      <el-form-item
        label="投票内容"
        prop="voteContent"
        v-if="form.voteContent != ''"
      >
        <el-input
          :disabled="true"
          type="textarea"
          :rows="4"
          v-model="form.voteContent"
          maxlength="300"
          :show-word-limit="true"
        >
        </el-input>
      </el-form-item>
    </el-form>
    <ShowJoin :visible.sync="visible" :checkedObjectList="checkedObjectList" />
  </div>
</template>

<script>
import ShowJoin from "@/components/ShowJoin";
export default {
  components: { ShowJoin },
  computed: {},
  name: "meetingVote",
  props: {
    form: { type: Object, default: () => null },
  },
  data() {
    return {
      visible: false,
      checkedObjectList: [],
      visible: false,
    };
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
::v-deep {
  .el-form {
    width: 80% !important;
  }
}
</style>
