<template>
  <el-dialog
    title="选择对象"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :show-close="false"
    :custom-class="side ? 'side-join' : 'join-objects'"
    :width="side ? '50%' : '70%'"
    :modal="!side"
    v-if="visible"
  >
    <el-row class="join-objects__container">
      <el-col class="join-objects__left" :span="10">
        <div class="join-objects__search-options">
          <el-select
            v-show="tagOptions.length>0"
            v-model="querys.tagList"
            multiple
            collapse-tags
            clearable
            placeholder="请选择标签"
          >
            <el-option
              v-for="tag in tagOptions"
              :key="tag.id"
              :label="tag.tagName"
              :value="tag.thirdTagId"
            >
            </el-option>
          </el-select>
          <div class="searName">
            <div>
              <el-input
                placeholder="请输入姓名全称"
                clearable
                v-model="querys.username"
              >
              </el-input>
            </div>
            <div style="margin-left: 10px">
              <el-button
                style="width: 100%; color: #3590ff; border-color: #3590ff"
                @click="handleSearch"
                >查询</el-button
              >
            </div>
          </div>
        </div>
        <div class="join-objects__list">
          <!-- 查询结果 -->
          <div class="search-list" v-show="isSearchMode">
            <div class="search-list__header">
              <span class="search-list__title">查询结果：</span>
              <span class="search-list__back" @click="isSearchMode = false"
                >返回</span
              >
            </div>
            <virtual-scroll-list
              style="height: 300px;  overflow-y: auto"
              :data-key="'id'"
              :data-sources="searchListData"
              :data-component="searchItemComp"
              :estimate-size="50"
              :bottom-threshold="0"
              :extra-props="{
                checkedIds,
                searchItemChange,
              }"
              @tobottom="loadMore"
            >
              <template #footer>
                <div class="search-list__bottom--finished" v-show="isFinished">
                  没有更多
                </div>
                <div
                  class="search-list__bottom--loading"
                  v-show="!isFinished"
                  v-loading="true"
                />
              </template>
            </virtual-scroll-list>
          </div>
          <!-- 组织结构树 -->
          <div class="tree-list" v-show="!isSearchMode">
            <div class="tree-path">
              <template v-for="(item, index) in pathOrgs">
                <i
                  class="el-icon-location-information"
                  style="color: #3692ff; margin-right: 5px"
                  v-show="index == 0"
                ></i>
                <span
                  class="tree-path--orgname"
                  :key="item.id"
                  @click="navToOrg(item, index)"
                  >{{ item.showName }}</span
                >
                <i
                  v-if="showSeperate(index)"
                  class="el-icon-arrow-right tree-path--seperate"
                ></i>
              </template>
            </div>
            <div class="data-list__item all" key="all">
              <el-checkbox shape="square" @change="toggleAll" v-model="isAll"
                >全选</el-checkbox
              >
            </div>
            <virtual-scroll-list
              style="height: 300px;  overflow-y: auto"
              :data-key="'id'"
              :data-sources="treeListData"
              :data-component="treeItemComp"
              :estimate-size="50"
              :bottom-threshold="0"
              :extra-props="{
                checkedIds,
                toNext,
                treeItemChange,
              }"
            />
          </div>
        </div>
      </el-col>
      <el-col class="join-objects__right" :span="14">
        <h3 class="">已选择{{ counts }}人</h3>
        <div class="join-objects__checked" style="height: 400px">
          <el-tag
            v-for="object in checkedObjects"
            :key="object.id"
            @close="removeObject(object)"
            closable
          >
            <i
              :class="object.isOrg ? 'el-icon-office-building' : 'el-icon-user'"
            ></i>
            {{ object.showName }}
          </el-tag>
        </div>
        <div class="join-objects__btns">
          <el-button @click="handleCancel">取消</el-button>
          <el-button @click="handleOk" type="primary">确认</el-button>
        </div>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import {
  queryTags,
  orgnizationTree,
  queryPeoples,
  countTreeSelect,
} from "@/api/objects.js";
import VirtualScrollList from "vue-virtual-scroll-list";
import TreeListItem from "./TreeListItem.vue";
import SearchListItem from "./SearchListItem.vue";

export default {
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
    side: {
      type: Boolean,
      default: false,
    },
    tagIdList: {
      type: Array,
    },
    checkedObjectList: {
      type: Array,
    },
  },
  components: {
    VirtualScrollList,
  },
  data() {
    return {
      isSearchMode: false,
      querys: {
        username: null,
        tagList: [],
      },
      pathOrgs: [this.$store.getters.orgInfo],
      tagOptions: [],
      tagObjects: {},
      isAll: false,
      treeListData: [],
      treeListObjects: {},
      treeItemComp: TreeListItem,
      searchListData: [],
      searchItemComp: SearchListItem,
      searchPageIndex: 1,
      searchPageSize: 20,
      searchTotal: 0,
      isSearching: false,
      isFinished: false,
      checkedIds: {}, // eg: { id: false / true }
      checkedObjects: [],
      counts: 0,
      tempStorage: [],
    };
  },
  watch: {
    tagIdList: {
      handler(v) {
        this.querys.tagList = [...(v || [])];
      },
      immediate: true,
    },
    checkedObjectList: {
      handler(v) {
        if (!Array.isArray(v)) return;
        this.checkedIds = v.reduce((res, object) => {
          res[object.id] = true;
          return res;
        }, {});
        this.checkedObjects = [...v];
        this.getCounts();
      },
      immediate: true,
    },
    checkedObjects: {
      handler() {
        this.getCounts();
      },
      immediate: true,
    },
  },
  created() {
    this.loadTags();
  },
  mounted() {
    const id = this.$store.getters.orgInfo.id;
    this.loadOrgTree(id);
  },
  methods: {
    getCounts() {
      if (this.$store.getters.topicType == "") {
        return;
      }
      if (this.checkedObjects.length < 1) {
        this.counts = 0;
      } else {
        let orgList = [];
        let personList = [];
        this.checkedObjects.map((item) => {
          if (item.isOrg) {
            orgList.push(item.id);
          }
          if (item.isPeople) {
            personList.push(item.id);
          }
        });
        let obj = {
          orgList: orgList,
          personList: personList,
          topicType: this.$store.getters.topicType,
        };
        countTreeSelect(obj).then((res) => {
          this.counts = res;
        });
      }
    },
    async loadTags() {
      this.tagOptions = (await queryTags({topicType:sessionStorage.getItem('topicType')})) || [];
      this.tagObjects = this.tagOptions.reduce((res, tag) => {
        res[tag.id] = tag;
        return res;
      }, {});
    },

    // 加载数据
    async loadOrgTree(id) {
      if (this.$store.getters.topicType == "") {
        return;
      }
      const listData = await orgnizationTree({
        id: id,
        topicType: this.$store.getters.topicType,
      });
      const hasData = Array.isArray(listData) && listData.length > 0;
      if (hasData) {
        if (this.getIndex(id) < 0) {
          this.tempStorage.push({ id: id, treeListData: listData });
          console.log(this.tempStorage, "-------");
        }
        this.treeListData = listData;
        this.treeListObjects = listData.reduce((res, object) => {
          res[object.id] = object;
          return res;
        }, {});
      }
      this.refreshAllCheckStatus(listData);
      return hasData;
    },

    // 刷新全选的状态
    refreshAllCheckStatus(listData) {
      if (Array.isArray(listData) && listData.length > 0) {
        this.isAll = !listData.find((item) => !this.checkedIds[item.id]);
      }
    },

    showSeperate(index) {
      if (!Array.isArray(this.pathOrgs)) return false;
      return this.pathOrgs.length > 0 && this.pathOrgs.length - 1 > index;
    },

    // 去选 / 取消全选
    toggleAll(isAll) {
      const pushArray = [];
      this.treeListData.forEach((item) => {
        const { id } = item;
        const findIndex = this.checkedObjects.findIndex(
          (object) => object.id === id
        );
        if (isAll) {
          findIndex === -1 && pushArray.push(item);
        } else {
          this.checkedObjects.splice(findIndex, 1);
        }
        this.checkedIds[id] = isAll;
      });
      if (isAll) {
        this.checkedObjects.push(...pushArray);
      }
    },

    // 下一级
    async toNext(item) {
       this.$set(item, "loading", true);
      const { id } = item || {};
      const hasData = await this.loadOrgTree(id);
              this.$set(item, "loading", false);
      if (hasData) {
        this.pathOrgs.push(item);
      } else {
        this.$set(item, "isNextEmpty", true);
      }
    },

    // 跳转至某个组织机构
    navToOrg(item, index) {
      this.pathOrgs.splice(index + 1);
      let tempIndex = this.getIndex(item.id);
      if (tempIndex < 0) {
        this.loadOrgTree(item.id);
      } else {
        this.treeListData = this.tempStorage[tempIndex].treeListData;
      }
    },
    getIndex(id) {
      let index = this.tempStorage.findIndex((item) => {
        if (item.id == id) return item;
      });
      return index;
    },

    treeItemChange(isChecked, item) {
      const { id } = item;
      const findIndex = this.checkedObjects.findIndex(
        (object) => object.id === id
      );
      if (isChecked) {
        this.isAll = !this.treeListData.find(
          (object) => !this.checkedIds[object.id]
        );
        if (findIndex === -1) this.checkedObjects.push(item);
      } else {
        this.isAll = false;
        if (findIndex !== -1) this.checkedObjects.splice(findIndex, 1);
      }
    },

    searchItemChange(isChecked, item) {
      const { id } = item;
      const findIndex = this.checkedObjects.findIndex(
        (object) => object.id === id
      );
      if (isChecked) {
        if (findIndex === -1) this.checkedObjects.push(item);
        this.isAll = !this.treeListData.find(
          (object) => !this.checkedIds[object.id]
        );
      } else {
        if (findIndex !== -1) {
          this.isAll = false;
          this.checkedObjects.splice(findIndex, 1);
        }
      }
    },

    removeObject({ id }) {
      const findIndex = this.checkedObjects.findIndex(
        (object) => object.id === id
      );
      this.checkedIds[id] = false;
      this.isAll = false;
      this.checkedObjects.splice(findIndex, 1);
    },

    loadMore() {
      this.$nextTick(async () => {
        if (this.isFinished || this.isSearching) return;
        try {
          this.isSearching = true;
          let querys = {
            pageIndex: this.searchPageIndex,
            pageSize: this.searchPageSize,
            orgId: this.pathOrgs[this.pathOrgs.length - 1]?.id,
            topicType: this.$store.getters.topicType,
            ...this.querys,
          };
          if (this.$store.getters.topicType == "") {
            return;
          }
          let { result, total } = await queryPeoples(querys);
          result = result || [];
          this.searchPageIndex++;
          this.total = total;
          this.isFinished = result.length < this.searchPageSize;
          this.searchListData.push(...result);
        } catch (err) {
          throw new Error(err);
        } finally {
          this.isSearching = false;
        }
      });
    },

    search() {
      this.searchPageIndex = 1;
      this.searchListData = [];
      this.isFinished = false;
      this.loadMore();
    },

    handleSearch() {
      this.search();
      this.isSearchMode = true;
    },

    handleCancel() {
      this.isSearchMode = false;
      this.$emit("update:visible", false);
    },

    handleOk() {
      const { personList, orgList, objectNames } = (
        this.checkedObjects || []
      ).reduce(
        (res, item) => {
          const { isOrg, isPeople, id, showName } = item;
          res.objectNames.push(showName);
          if (isOrg) res.orgList.push(id);
          else res.personList.push(id);
          return res;
        },
        {
          personList: [],
          orgList: [],
          objectNames: [],
        }
      );
      if (this.checkedObjects.length < 1) {
        this.$message({ message: "请选择后再确认", type: "warning" });
        return;
      }
      this.$emit("editChange", {
        objectsNameString: objectNames.join("、"),
        checkedObjects: [...this.checkedObjects],
        tagList: [...this.querys.tagList],
        personList,
        orgList,
      });
      this.$emit("update:visible", false);
    },
  },
};
</script>

<style lang="scss" scoped>
.tree-path {
  font-size: 14px;
  line-height: 2.5;
  margin-top: 13px;
  &--orgname {
    cursor: pointer;
    &:last-child {
      color: #3692ff;
    }
  }
  &--seperate {
    margin: 3px;
  }
}
::v-deep {
  .data-list__item {
    display: flex;
    align-items: center;
    position: relative;
    &--next {
      position: absolute;
      right: 0;
      padding-left: 10px;
      // width: 80px;
      top: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      &--disabled {
        color: #d0d0d0;
        pointer-events: none;
      }
    }
    .el-icon-arrow-right {
      &::before {
        content: "\4e0b\7ea7";
        color: #3590ff;
      }
      &::after {
        content: "\e6e0";
      }
    }
    .data-list__item--next--disabled {
      &::before {
        content: "";
      }
    }
  }
  .all{
    border-bottom: 1px solid rgb(235, 237, 240);
    .el-checkbox{
      width: 18px;
      border: none;
    }
  }
  .el-checkbox {
    width: 100%;
    padding: 10px 80px 10px 0;
    position: relative;
    border-bottom: 1px solid #ebedf0;
    &::after {
      position: absolute;
      box-sizing: border-box;
      content: " ";
      pointer-events: none;
      right: 24px;
      bottom: 0;
      left: 0;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }
  }
}
.search-list {
  &__header {
    display: flex;
    // align-items: center;
    justify-content: space-between;
    margin: 14px 20px 14px 0;
    font-size: 14px;
  }
  &__title {
    font-size: 14px;
  }
  &__back {
    color: #3590ff;
    font-size: 14px;
    cursor: pointer;
  }
  &__bottom {
    &--finished {
      font-size: 14px;
      color: #b3b5b9;
      text-align: center;
      margin: 20px;
    }
    &--loading {
      text-align: center;
      margin-top: 50px;
    }
  }
}
.join-objects,
.side-join {
  &__search-options {
    display: flex;
    flex-direction: column;
    align-items: center;
    & > div {
      margin-bottom: 10px;
    }
    ::v-deep {
      .el-tag {
        margin-bottom: 2.5px;
      }
    }
    .searName {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
  &__container {
    position: relative;
    padding-bottom: 20px;
  }
  &__left {
    padding-right: 10px;
    position: relative;
    &::after {
      content: "";
      display: block;
      position: absolute;
      right: 0;
      top: 0;
      width: 1px;
      height: 100%;
      background-color: #f5f6f7;
    }
  }
  &__right {
    padding-left: 10px;
    position: relative;
  }
  &__checked {
    overflow-y: scroll;
    ::v-deep {
      .el-tag {
        margin-right: 5px;
        margin-bottom: 5px;
      }
    }
  }
  &__btns {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    border-top: 1px solid #f5f6f7;
    height: 68px;
  }
}
.close {
  position: absolute;
  left: 50%;
  bottom: 20px;
  transform: translate(-50%);
}
</style>
<style lang="scss">
.join-objects {
  .el-dialog__header {
    border-top-left-radius: 4px !important;
    border-top-right-radius: 4px !important;
  }
  border-radius: 4px;
}

.el-dialog__header {
  border-top-left-radius: 4px !important;
  border-top-right-radius: 4px !important;
}

.el-dialog.side-join {
  margin-left: 45vw;
}
.el-drawer__body {
  .formMain {
    .el-dialog__wrapper {
      z-index: 11006 !important;
    }
  }
}
</style>
