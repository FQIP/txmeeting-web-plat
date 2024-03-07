<template>
  <div class="checkes-container">
    <el-tooltip content="关闭" placement="right">
      <span class="close" @click="closeFn">x</span>
    </el-tooltip>
    <div class="full-check-container">
      <div class="users-container">
        <el-tree
          :data="deptTreeData"
          node-key="treeId"
          ref="tree"
          :load="handleNodeExpand"
          lazy
          show-checkbox
          :props="defaultProps"
          v-bind="$attrs"
          v-loading="loading"
          @node-click="handleNodeClick"
          @check="handleCheckChange"
        >
          <!-- @node-expand="handleNodeExpand" -->
          <span
            :class="[
              'custom-tree-node',
              'el-tree-node__label',
              { 'el-tree-node__disabled': node.disabled },
            ]"
            slot-scope="{ node }"
          >
            <el-tooltip
              class="item"
              effect="dark"
              :open-delay="500"
              placement="bottom-start"
            >
              <div slot="content" v-html="node.label"></div>
              <span v-html="node.label"></span>
            </el-tooltip>
          </span>
        </el-tree>
      </div>
    </div>
  </div>
</template>

<script>
import { digui, findTreeDataByUserId } from "@/utils/tree";
import CusCheckBox from "@/components/CusCheckBox";
import { mergeTableData, duplicateById } from "@/utils/list";
import { getTree, getAllUser } from "@/api/publishTopics";
import treeLoader from "@/utils/treeLoader";
export default {
  name: "LeftOrgCheckTree",
  components: { CusCheckBox },
  model: {
    prop: "peopleData",
    event: "change",
  },
  props: {
    peopleData: {
      type: Array,
      default: () => [],
    },
    checkArr: {
      type: Array,
      default: () => [],
    },
    loadDataFun: {
      type: Function,
      require: true,
    },
    // deptData: {
    //   type: Array,
    //   default: () => []
    // },
    // treeData: {
    //   type: Array,
    //   default: () => []
    // },
  },
  data() {
    return {
      searchWord: "",
      deptTreeData: [],
      defaultProps: {
        children: "children",
        label: "label",
        id: "treeId",
        isLeaf: "leaf",
      },
      treeData: [],
      loading: false,
      inter: null,
    };
  },
  watch: {
    peopleData: {
      handler(lists) {
        // if (this.inter) {
        //   clearTimeout(this.inter);
        // }
        // this.inter = setTimeout(
        //   () => this.updateCheckedByMeetingList(lists),
        //   100
        // );

        console.log(lists, "======");
        console.log(this.peopleData);
        console.log("checkArr==========", this.checkArr);
        // if (lists.length < 1) {
        //   this.$refs.tree.setCheckedKeys([]);
        // }

        console.log(
          "getCheckedKeys==========",
          this.$refs.tree.getCheckedKeys()
        );
        console.log(
          "getCheckedKeys==True========",
          this.$refs.tree.getCheckedKeys(true)
        );
        // this.$nextTick(() => this.updateCheckedByMeetingList(lists))
      },
      immediate: false,
    },
  },
  computed: {},
  mounted() {
    this.initData();
  },
  methods: {
    //关
    closeFn() {
      this.$emit("closeFn");
    },
    dataChangeCheck(data) {
      console.log(data, "77777777");
            this.$refs.tree.setCheckedKeys([]);
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(data);
        console.log(this.$refs.tree.getCheckedKeys(),'被选中的----------------')
      }); // 设置勾选
    },
    // 改变勾选
    updateCheckedByMeetingList(lists) {
      console.log("lists====", lists);
      lists = lists === undefined ? this.peopleData : lists;
      if (lists && lists.length > 0) {
        lists = duplicateById(lists, "id"); //去重
      }
      if (lists.length != this.peopleData.length) {
        this.peopleData = lists;
        return false;
      }
      let checkedKey = [];
      console.log(lists, "lists");
      lists.forEach((item) => {
        let checkData = findTreeDataByUserId(this.treeData, item.id);
        checkedKey = checkedKey.concat(
          checkData.map((__item) => __item.treeId)
        );
      });

      console.log("update:peopleData", lists.length, checkedKey.length);
      this.$nextTick(() => this.$refs?.tree?.setCheckedKeys(checkedKey)); // 设置勾选
    },
    // 初始化
    initData() {
      this.loading = true;
      let params = new URLSearchParams();
      let orgId = sessionStorage.getItem("orgId");
      params.append("id", orgId);
      getTree(params).then((res) => {
        // let resp = digui(res.object.org || []);
        // this.treeData = res.object.org;
        this.deptTreeData = res.object.org.map((item) => {
          item.label = item.name;
          item.treeId = item.id;
          return item;
        });
        console.log("this.deptTreeData", this.deptTreeData);
        this.loading = false;
        console.log(":this.checkArr)========", this.checkArr);
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(this.checkArr);
        });
      });
    },
    // 判断有无子节
    hasChildrenLoaded(data) {
      if (data.children) {
        return true;
      }
      return fa;
    },

    getIncludeNodes(arr) {
      let res = [];
      arr.forEach((item) => {
        if (
          item.label &&
          item.label.toLowerCase().includes(this.searchWord.toLowerCase())
        ) {
          res.push({
            ...item,
          });
        } else {
          if (this.getIncludeNodes(item?.children ?? []).length) {
            res.push({
              ...item,
              children: this.getIncludeNodes(item?.children ?? []),
            });
          }
        }
      });
      return res;
    },
    getChildrenUsers(arr, isAdd) {
      let res = [];
      console.log(arr);
      arr.forEach((item) => {
        if (item.children !== undefined) {
          if (item?.children?.length) {
            res = res.concat(this.getChildrenUsers(item.children), isAdd);
          }
        } else {
          res.push({
            item,
          });
        }
      });
      console.log(res, "res================");
      return res;
    },
    handleCheckChange(data, obj) {
      let checked = obj.checkedNodes.some(
        (check) => check.treeId === data.treeId
      );
      console.log(data);
      console.log(obj);
      console.log("checked===", checked);
      console.log(this.peopleData);
      if (checked) {
        if (this.checkHasChildFn(data)) {
          // let loader = new treeLoader({
          //   treeData: data,
          //   treeProps: this.defaultProps,
          //   checkHasChildFn: this.checkHasChildFn.bind(this),
          //   loaderSuccessCallback: () => {
          //     console.log("loaderSuccessCallback");
          //     this.$nextTick(() => {
          //       if (data.sffy === false) {
          //         let children = [...data.children];
          //         delete data.children;
          //         this.$set(data, "children", children);
          //       }
          //       this.$set(data, "isClick", true);
          //       this.resolveCheckedSuccess(data);
          //     });
          //   },
          // });
          let params = new URLSearchParams();
          params.append("id", data.id);
          getAllUser(params).then((res) => {
            console.log(res, "下面的===");
            let tempArr = res.object;
            this.changePeopleData(tempArr, true);
          });
          console.log("是有子解构的的", data);
          this.$emit("changeCheck", { id: data.id, flag: true });
          // this.resolveCheckedSuccess(data);
          // loader.run();
        } else {
          this.resolveCheckedSuccess(data);
        }
      } else {
        this.resolveChecked(data, checked);
      }

      return false;
    },
    checkHasChildFn(data) {
      console.log("判断", data);
      return data.username ? false : true;
    },
    // 改变人员
    changePeopleData(arr, isAdd) {
      let temp = this.peopleData;
      console.log(arr, "=========arr");
      console.log(...arr, "=========arr");
      arr.map((item) => {
        item.label =
          item.username +
          "(" +
          item.mobile.replace(/^(\d{3})\d{4}(\d+)/, "$1****$2") +
          ")";
        if (isAdd) {
          temp.push(item);
        } else {
          temp = temp.filter((ite, index) => {
            if (ite.id != item.id) return ite;
          });
        }
      });
      const arrs = temp.filter((element, index, self) => {
        return self.findIndex((x) => x.id === element.id) === index;
      });
      console.log(arrs, "arrrrrrrrrrrrrrrrrrr");
      this.$emit("changeData", arrs);
    },
    resolveCheckedSuccess(data) {
      console.log("resolveCheckedSuccess---", data);
      let childrenUsers = [data];
      if (data.children !== undefined) {
        // 机构或者部门
        console.log("机构的");
        childrenUsers = this.getChildrenUsers(data.children, true);
      }

      this.$nextTick(() => {
        console.log("resolveCheckedSuccess---add-length", childrenUsers.length);
        console.log(childrenUsers);
        let temp = this.peopleData;
        temp.push(data);
        this.$emit("changeData", temp);
        console.log(this.peopleData);
        this.$emit("update:tree-data", this.$refs.tree.data);
      });
    },
    resolveChecked(data, hasCheck) {
      console.log("resolveChecked---", data);
      // console.log("this.peopleData=============", this.peopleData);
      if (data.username == undefined) {
        // 机构或者部门
        this.$emit("changeCheck", { id: data.id, flag: false });
        let childrenUsers = [];
        if (hasCheck) {
          childrenUsers = this.getChildrenUsers(data.children, true);
          console.log(childrenUsers, "childrenUsers========");
          childrenUsers.forEach((child) => {
            this.peopleData.push({
              ...child,
              colseable: true,
            });
          });
        } else {
          // 取消勾选
          console.log("取消机构的");
          childrenUsers = [data];
          let params = new URLSearchParams();
          params.append("id", data.id);
          getAllUser(params).then((res) => {
            let tempArr = res.object;
            this.changePeopleData(tempArr, false);
            console.log("this.peopleData=============", this.peopleData);
          });
          console.log("this.peopleData=============", this.peopleData);
          console.log(childrenUsers, "childrenUsers========");
        }
      } else {
        // 人员
        let inx = this.peopleData.findIndex((item) => item.id === data.id);
        let temp = this.peopleData;
        console.log(inx, "inx----------");
        if (inx > -1) {
          temp.splice(inx, 1);
          this.$emit("changeData", temp);
        } else {
          temp.push(data);
          this.$emit("changeData", temp);
        }
      }
      this.$nextTick(() => {
        this.$emit("update:tree-data", this.$refs.tree.data);
      });
    },
    handleNodeClick(data, node) {
      if (!node.expanded || data?.isClick || !data?.nodeType) {
        this.$set(data, "isClick", true);
        return;
      }
      if (data?.nodeType === "user") {
        let inx = -1;
        if (this.isDisabled) {
          inx = this.peopleData.findIndex(
            (meet) => meet.userId === data.userId && meet.colseable
          );
        } else {
          inx = this.peopleData.findIndex(
            (meet) => meet.userId === data.userId
          );
        }
        if (inx > -1) {
          this.peopleData.splice(inx, 1);
        } else if (
          this.isDisabled &&
          this.peopleData.some((meet) => meet.userId === data.userId)
        ) {
          return;
        } else {
          this.peopleData.push({
            ...data,
            colseable: true,
          });
        }
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(
            this.peopleData.map((meet) => meet.id)
          ); // 设置勾选
        });
        return;
      }
      this.getChildLists(data, node);
    },
    // 展开
    handleNodeExpand(node, resolve) {
      console.log("handleNodeExpand:111", node);
      let data = node.data;
      let params = new URLSearchParams();
      if (data.id == undefined) {
        return;
      }
      params.append("id", data.id);
      getTree(params).then((res) => {
        let people = res.object.people;
        let org = res.object.org;
        if (org && org.length > 0) {
          data.children = res.object.org.map((item) => {
            item.label = item.name;
            item.treeId = item.id;
            item.leaf = false;
            console.log(item, "item============");
            return item;
          });
        }
        if (people && people.length > 0) {
          people = people.map((item) => {
            item.is_expand = false;
            item.label =
              item.username +
              "(" +
              item.mobile.replace(/^(\d{3})\d{4}(\d+)/, "$1****$2") +
              ")";
            item.treeId = item.id;
            item.leaf = true;
            return item;
          });
          data.children = [];
          data.children.unshift(...people);
        }
        if (this.checkArr.indexOf(data.id) > -1) {
          data.children.map((item) => {
            console.log(item, "==========!!!!");
            if (item.username) {
              let indexF = this.peopleData.findIndex((it) => {
                return it.id == item.id;
              });
              if (indexF > -1) {
                this.$emit("changeCheck", { id: item.id, flag: true });
              }
            } else {
              this.$emit("changeCheck", { id: item.id, flag: true });
            }
          });
        }
        resolve([]);
        this.$nextTick(() => {
          this.$set(data, "children", data.children);
          this.$set(data, "is_expand", true);
          this.$refs.tree.setCheckedKeys(this.checkArr);
          // this.updateCheckedByMeetingList();
        });
        console.log(this.deptTreeData);
      });
      return;
    },
  },
};
</script>

<style lang="scss" scoped>
.checkes-container {
  $boxHeight: 40vh;
  $titleHeight: 2.65rem;
  $fullCheckHeight: 2rem;
  $searchHight: 2.5rem;
  width: 100%;
  height: $boxHeight;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  box-shadow: 0 0 3px 0 #1492ff;
  .close {
    position: absolute;
    right: 10px;
    z-index: 2;
    top: 0px;
    color: #1492ff;
    cursor: pointer;
  }
  .search-container {
    display: inline-block;
    width: 100%;
    // height: $searchHight;
    padding: 7px 15px 2px 15px;
    ::v-deep {
      .el-input__inner {
        border-radius: 40px;
      }
    }
  }
  .full-check-container {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .users-container {
      flex: 1;
      overflow: hidden;
      overflow-y: auto;
    }
    .full-check {
      width: 100%;
      height: $fullCheckHeight;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-family: PingFang SC Medium, PingFang SC Medium-Medium;
      font-weight: 500;
      color: #333333;
      .button {
        user-select: none;
        padding: 5px 10px;
        cursor: pointer;
        &:hover {
          opacity: 0.8;
          &:active {
            opacity: 0.65;
          }
        }
      }
    }
  }
  .noneData {
    height: calc(
      #{$boxHeight} - #{$titleHeight} - #{$fullCheckHeight} - #{$searchHight}
    );
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-size: 0.8rem;
    color: #999;
    i {
      font-size: 5rem;
    }
  }
  .users-container {
    width: 100%;
    padding: 5px 0;
    .user-item {
      background-color: #ffffff;
      // text-align: center;
      user-select: none;
      display: flex;
      align-items: center;
      // justify-content: center;
      padding: 8px 0;
      transition: all 0.3s;
      &:hover {
        background-color: #f0f0f0;
        &:active {
          background-color: #d2d2d2;
          opacity: 0.65;
        }
      }

      .checkbox {
        margin-left: 10px;
      }
      .avatar {
        margin-left: 12px;
        .avatar-empty {
          background-color: #0a6feb;
          font-size: 12px;
          font-family: PingFang SC Medium, PingFang SC Medium-Medium;
          font-weight: 500;
          color: #ffffff;
        }
      }
      .name {
        margin-left: 10px;
        font-size: 12px;
        color: #333333;
        font-family: PingFang SC Medium, PingFang SC Medium-Medium;
        font-weight: 500;
        max-width: 180px;
        p {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: pointer;
          padding: 5px 0 0;
        }
      }
    }
  }
}
.search-users-container {
  width: calc(100% - 15px);
  height: calc(100% - 50px);
  position: absolute;
  top: 50px;
  bottom: 0;
  background-color: #fff;
  z-index: 2000;
  margin-left: 15px;
  padding-right: 15px;
  padding-bottom: 5px;
  .container-box {
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    border: 1px solid #ebeef5;
    border-radius: 4px;
    height: 100%;
  }
  .full-check-container {
    height: 100%;
    padding: 0;
  }
  .btn-close {
    position: absolute;
    right: 21px;
    top: 6px;
    font-size: 14px;
  }
  .el-pagination.justify {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  .pagination-current {
    text-align: center;
  }
}
.el-tree-node__noclick {
  color: #999;
  opacity: 0.9;
}
</style>
