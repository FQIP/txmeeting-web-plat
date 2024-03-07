<template>
  <div class="selectObjects">
    <div class="item" v-for="(org, index) in confimArry" :key="index">
      <el-breadcrumb
        separator-class="el-icon-arrow-right"
        style="font-size: 12px"
      >
        <el-breadcrumb-item v-for="(orgName, i) in org.orgNameArry" :key="i">
          {{ orgName }}
        </el-breadcrumb-item>
      </el-breadcrumb>
              <!-- 删除的 -->
          <!-- closable
          @close="delUser(index, userIndex)" -->
      <div class="name">
        <el-tag v-for="(user, userIndex) in org.peopleArr" :key="userIndex">

          {{ user.username }}
        </el-tag>
      </div>
      <div class="handle" v-if="!see">
        <span class="edit" @click="setFn(index)">
          <i class="el-icon el-icon-edit-outline" ></i>
        </span>
        <span class="del"  @click="delFn(index)">
          <i class="el-icon el-icon-delete"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "selectObjects",
  props: {
    confimArry: { type: [Array], default: () => [] },
    see:{
      type:Boolean,default:false
    }
  },
  data() {
    return {};
  },
  methods: {
    delFn(index) {
      this.$confirm("确认删除？", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        type: "warning",
      })
        .then(() => {
          this.$emit("delFn", index);
          console.log(index);
        })
        .catch(() => {});
    },
    setFn(index) {
       this.$emit("setFn", index);
    },
    // delUser(index, userIndex) {
    //   this.$confirm("确认删除人员？", "删除", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     closeOnClickModal: false,
    //     type: "warning",
    //   })
    //     .then(() => {
    //       this.$emit("delUser", index, userIndex);
    //       console.log(index);
    //     })
    //     .catch(() => {});
    // },
  },
};
</script>

<style lang="scss" scoped>
.selectObjects {
  .item {
    border: 1px solid #e5e7ed;
    border-radius: 3px 3px 0px 0px;
    padding: 8px;
    position: relative;
  }
  .name {
    margin-top: 5px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    .el-tag {
      font-size: 12px;
      padding: 0 5px;
      .el-icon-close {
        font-size: 6px;
      }
    }
  }
  .handle {
    position: absolute;
    right: -70px;
    top: 50%;
    transform: translate(0, -50%);

    .edit,
    .del {
      color: #1492ff;
      font-size: 16px;
      cursor: pointer;
      padding: 5px;
      border: 1px solid #1492ff;
    }
    .del {
      color: #dd413e;
      border-color: #dd413e;
      margin-left: 5px;
    }
  }
}
</style>
