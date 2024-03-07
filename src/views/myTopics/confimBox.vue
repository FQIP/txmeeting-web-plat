<template>
  <div class="confim-box" v-show="confimFlag">
    <div class="closeBtn">
      <span>确认</span>
      <i class="el-icon-close" @click="cancel"></i>
    </div>
    <div class="concentBox">
      <div
        class="tip"
        :style="
          (programmeType == 1 && checkType == 2) ||
          ((voteState == 3 || voteState == 4) && checkType == 4) ||
          checkType == 3
            ? 'margin-bottom:2.5rem'
            : ''
        "
      >
        {{
          programmeType == 0 && checkType == 2
            ? "点击提交后立即通知参会对象，确认提交？"
            : programmeType == 1 && checkType == 2
            ? "确认提交？"
            : voteState == 5 && checkType == 4
            ? "点击提交后仍可以修改线下投票信息，点击提交并发布后无法修改，请确认？"
            : (voteState == 3 || voteState == 4) && checkType == 4
            ? "确认提交？"
            : checkType == 3
            ? "确认提交？"
            : checkType == 5
            ? "保存操作后仍可以继续修改，提交发布后则无法修改，请确认？"
            : ""
        }}
      </div>
      <div
        class="btn-box"
        v-if="checkType == 5 || (checkType == 4 && voteState != 3)"
      >
        <el-button style="width: 96px" type="primary" @click="submit(false)"
          >保存</el-button
        >
        <el-button style="width: 96px" type="primary" @click="submit(true)"
          >提交发布</el-button
        >
      </div>
      <div class="btn-box" v-else>
        <el-button
          style="width: 96px"
          type="default"
          @click="cancel"
          >取消</el-button
        >
        <el-button style="width: 96px" type="primary" @click="submit(false)" :loading="loading"
          >提交</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "confimBox",
  props: {
    programmeType: {
      type: [Number,String],
    },
    checkType: {
      type: [Number,String],
    },
    voteState: {
      type: [Number,String],
    },
    confimFlag: {
      type: Boolean,
      default:false
    },
    loading: {
      type: Boolean,
      default:false
    },
  },
  methods:{
    cancel(){
      this.$emit("cancel")
    },
    submit(flag){
      this.$emit("submit",flag)
    }
  }
};
</script>

<style lang="scss" scoped>
.confim-box {
  z-index: 99999;
  border-radius: 4px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 20rem;
  height: 11.25rem;
  background: #ffffff;
  border-radius: 3px;
  box-shadow: 0px 0px 10px 7px rgba(18, 59, 113, 0.12);
  .closeBtn {
     border-top-left-radius: 4px;
     border-top-right-radius: 4px;
    background: #1492ff;
    color: #fff;
    padding: 8px 10px;
    display: flex;
    justify-content: space-between;
    .el-icon-close {
      cursor: pointer;
    }
  }
  .concentBox {
    padding: 1.5rem 3rem;
    .tip {
      margin-bottom: 1.2rem;
      color: #333;
      font-size: 14px;
    }
    .btn-box {
      display: flex;
      justify-content: space-between;
    }
    .btn-box-right {
      justify-content: flex-end;
    }
  }
}
</style>
