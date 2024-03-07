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
          show-checkbox
          :props="defaultProps"
          v-bind="$attrs"
          v-loading="loading"
          @node-click="handleNodeClick"
          @check="handleCheckChange"
          @node-expand="handleNodeExpand"
        >
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

    <!-- <div class="search-users-container selector-container" v-if="searchContainerShow">
      <div class="container-box">
        <i class="iconfont btn-close icon-guanbi" @click="searchContainerShow = false"></i>
        <div class="noneData" v-if="this.userList.length === 0">
          <i class="iconfont icon-no-data"></i>
          <span>暂无数据</span>
        </div>
        <div class="full-check-container" v-else>
          <div class="full-check">
            <span @click="toggleFullSelect">
              <span class="button tblue" :style="{'pointer-events': isAllInclude ? 'none' : ''}">
                {{ isFullSelect ? '全不选' : '全选' }}
              </span>
            </span>
          </div>
          <div class="users-container">
            <template v-for="(user, index) of userList">
              <div
                class="user-item"
                :key="index"
                @click="toggleSelectUser(user)"
              >
                <cus-check-box
                  :checked="isMeetingChecked(user)"
                  class="checkbox"
                  :disabled="isHost(user) || invitedUserLists.some(invite => invite.userId === user.userId)"
                />
                <el-tooltip
                  popper-class="user-select"
                  class="name"
                  effect="dark"
                  :open-delay="300"
                >
                  <div slot="content">
                    <p>{{ user.realName + '(' + user.userName + ')' }}</p>
                    <p>{{ user.orgName ? `${user.orgName}` : '' }}{{ user.deptName ? `-${user.deptName}` : '' }}</p>
                  </div>
                  <div class="name">
                    <p>{{ user.realName + '(' + user.userName + ')' }}</p>
                    <p>{{ user.orgName ? `${user.orgName}` : '' }}{{ user.deptName ? `-${user.deptName}` : '' }}</p>
                  </div>
                </el-tooltip>
              </div>
            </template>
          </div>
          <div class="selector__pagination">
            <el-pagination
              :layout="(userListTotal > userListPageSize) ? 'total,prev,slot,next' : 'total'"
              :total="userListTotal"
              :current-page.sync="userListPageNum"
              @current-change="userListCurChange"
              :class="{'justify' : (userListTotal <= userListPageSize)}"
            >
              <span class="pagination-current">
                {{ userListPageNum }}
              </span>
            </el-pagination>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import { load, mergeShallowTableData } from "@/utils/list";
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
    meetingId: {
      type: String,
      default: "",
    },
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
      userList: [],
      hostList: [],
      userListTotal: 0,
      userListPageNum: 1,
      userListPageSize: 100,
      searchContainerShow: false,
      inter: null,
    };
  },
  watch: {
    peopleData: {
      handler(lists) {
        if (this.inter) {
          clearTimeout(this.inter);
        }
        this.inter = setTimeout(
          () => this.updateCheckedByMeetingList(lists),
          100
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
        this.loading = false;
        // this.$nextTick(() => {
        //   this.treeData.map((tree, index) => {
        //     if (tree.children.filter((child) => child.userId).length) {
        //       this.$refs.tree.getNode(tree).expanded = true;
        //       tree.isClick = true;
        //     }

        //     if (tree.nodeType == "org") {
        //       //org 只加载到二级目录
        //       // this.getChildLists(tree, {});
        //       this.$refs.tree.getNode(tree).expanded = false;
        //       tree.isClick = false;
        //     } else {
        //       setTimeout(() => this.loaderChildren(tree), 10);
        //     }
        //   });
        // });
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
      arr.forEach((item) => {
        if (item.children !== undefined) {
          if (item?.children?.length) {
            res = res.concat(this.getChildrenUsers(item.children), isAdd);
          }
        } else {
          // if (isAdd || this.isDisabled && item.userType !== '1') {
          //   res.push({
          //     ...item
          //   })
          // }
          res.push({
            ...item,
          });
        }
      });
      return res.filter((r) => typeof r === "object");
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
          });
          console.log("是有子解构的的", data);

          // loader.run();
        } else {
          this.resolveCheckedSuccess(data);
        }
      } else {
        this.resolveChecked(data, checked);
      }

      return false;
    },
    // treeLoaderFn(data) {
    //   return new Promise((resolve) => {
    //     this.__getChildLists(data, {}).then((res) =>
    //       resolve(digui(res.object))
    //     );
    //   });
    // },
    checkHasChildFn(data) {
      console.log("判断", data);
      return data.username ? false : true;
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
        let temp = mergeShallowTableData(
          childrenUsers,
          this.peopleData,
          "userId"
        );
        let isOverLimit;
        if (isOverLimit) {
          //取消勾选
          if (data.children !== undefined && data.children.length > 0) {
            data.children.forEach((item, i) => {
              let exist = this.peopleData.some((u) => u.userId === item.userId);
              if (!exist) {
                this.$refs.tree.setChecked(item, false, true);
              }
            });
          } else if (data.nodeType === "user") {
            this.$refs.tree.setChecked(data, false, true);
          }
        } else {
          this.peopleData = mergeTableData(
            childrenUsers,
            this.peopleData,
            "userId"
          );
          this.$emit("update:tree-data", this.$refs.tree.data);
        }
      });
    },
    resolveChecked(data, hasCheck) {
      console.log("resolveChecked---", data);
      console.log("this.peopleData=============", this.peopleData);
      if (data.username!=undefined) {
        // 机构或者部门
        console.log("取消机构的");
        let childrenUsers = [];
        if (hasCheck) {
          childrenUsers = this.getChildrenUsers(data.children, true);
          childrenUsers.forEach((child) => {
            this.peopleData.push({
              ...child,
              colseable: true,
            });
          });
        } else {
          // 取消勾选
          childrenUsers = this.getChildrenUsers(data.children, false);
          console.log("this.peopleData=============", this.peopleData);
          childrenUsers.forEach((child) => {
            let inx = this.peopleData.findIndex(
              (meet) => meet.userId === child.userId
            );
            if (inx > -1) {
              this.peopleData.splice(inx, 1);
            }
          });
        }
      } else {
        // 人员
        let inx = this.peopleData.findIndex(
          (meet) => meet.userId === data.userId
        );
        if (inx > -1) {
          this.peopleData.splice(inx, 1);
        } else {
          this.peopleData.push({
            ...data,
            colseable: true,
          });
        }
      }
      this.$nextTick(() => {
        this.$emit("update:tree-data", this.$refs.tree.data);
      });
    },
    handleNodeClick(data, node) {
      if (
        (data?.nodeType !== "user" && !node.expanded) ||
        data?.isClick ||
        !data?.nodeType
      ) {
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
            this.peopleData.map((meet) => meet.userId)
          ); // 设置勾选
        });
        return;
      }
      this.getChildLists(data, node);
    },
    // 展开
    handleNodeExpand(data, node) {
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
        console.log("最后的", data.children);
        resolve([]);
        this.$nextTick(() => {
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

            console.log("people========", people);
            console.log("data====", data);
            data.children.unshift(...people);
          }
          this.$set(data, "children", data.children);
          this.$set(data, "is_expand", true);
          this.updateCheckedByMeetingList();
        });
        console.log(this.deptTreeData);
        // if (!data.is_expand) {
        //   let children = data.children;
        //   console.log("children=====", children);
        //   // console.log("children=====",data)
        //   // this.$delete(data, "children");
        //   this.$nextTick(() => {
        //     // this.$set(data, "children", children);
        //     this.$set(data, "is_expand", true);
        //     this.updateCheckedByMeetingList();
        //   });
        // }
      });
      return;
    },
    getChildListUrl(data) {
      let url;
      switch (data.nodeType) {
        case "org":
          url = data.sffy
            ? `/dept/tree?orgId=${data.orgId}&status=1`
            : `/user/manage/getList?orgId=${data.orgId}`;
          break;
        case "dept":
          url = `/user/manage/getList?deptId=${data.id}`;
          break;
        case "group":
          url = `/customGroup/user/list?groupId=${data.orgId}`;
          break;
      }
      return url;
    },
    __getChildLists(data, node) {
      let url = this.getChildListUrl(data);
      return load(
        "get",
        url,
        {},
        {
          success: (res) => {
            let resp = digui(res.object);
            data.children = !data?.children?.length
              ? []
              : data.children.filter((child) => child.userId);
            let children = mergeTableData(resp, data.children, "userId");
            delete data.children;
            this.$set(data, "children", children);
          },
        }
      );
    },
    getChildLists(data, node) {
      node.loading = true;
      this.$set(data, "isClick", true);

      let url = this.getChildListUrl(data);

      return load(
        "get",
        url,
        {},
        {
          success: (res) => {
            this.doSuccess(data, node, res);
          },
        }
      ).finally(() => {
        this.$set(node, "loading", false);
      });
    },
    doSuccess(data, node, res) {
      let resp = digui(res.object);
      let children = !data?.children?.length
        ? []
        : data.children.filter((child) => child.userId);
      children = mergeTableData(resp, children, "userId");
      delete data.children;
      this.$set(data, "children", children);
      this.$set(node, "expanded", true);
      this.$nextTick(() => {
        this.$emit("update:tree-data", this.$refs.tree.data);
        this.updateCheckedByMeetingList();
      });
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
