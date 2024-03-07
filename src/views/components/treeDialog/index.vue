<template>
  <div class="treeDialog" v-if="visible">
    <el-dialog
      :title="'选择'"
      :visible.sync="visible"
      :close-on-click-modal="false"
      width="60%"
      custom-class="treeD"
      :modal="modal"
    >
      <div>
        <span v-if="editObj"> 机构选择 {{ editObj.orgName }} </span>
        <selectTree ref="selectTree" @changeTree="changeTree" v-else />
        <el-form :inline="true">
          <div class="search-container">
            <div>
              <el-form-item>
                <div class="titleName">姓名</div>
                <el-input
                  placeholder="请输入姓名"
                  v-model="search.username"
                  style="width: 200px"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <div class="titleName">标签</div>
                <el-input
                  placeholder="请输入标签"
                  v-model="search.label"
                  style="width: 200px"
                ></el-input>
              </el-form-item>
            </div>
            <div>
              <div class="search-buttons">
                <el-form-item style="text-align: right; width: 100%">
                  <el-button @click="reset">重置</el-button>
                  <el-button type="primary" @click="queryData">查询</el-button>
                </el-form-item>
              </div>
            </div>
          </div>
        </el-form>
        <div class="peopleTable" v-show="tableData.length">
          <el-button
            style="margin-bottom: 20px"
            :type="!allFlag ? 'primary' : 'deflut'"
            @click="cancel"
            >{{ allFlag ? "取消机构人员全选" : "机构人员全选" }}</el-button
          >
          <custom-table
            ref="peopleTable"
            class="my-table people-table"
            :pagerCount="5"
            :isIndex="false"
            :isPagination="true"
            :isSelection="1"
            :defaultSelections="checkArr"
            :tableData="tableData"
            :tableCols="tableCols"
            :pagination="pagination"
            :selectAllFlag="allFlag"
            :edit="editFlag"
            @select="select"
            @selectAll="selectAll"
            @reloadTable="initTableData"
          />
        </div>
        <div
          style="padding: 10px 0; text-align: center"
          v-show="
            tableData.length &&
            (types == 3 || ((types == 1 || types == 2) && tempArr.length > 0))
          "
        >
          <el-button type="primary" @click="submitData">提交</el-button>
        </div>
        <div v-show="tableData.length < 1" class="noDataBox">
          <img :src="require(`@/assets/img/noneData.png`)" />
          <div>暂无数据</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CustomTable from "@/components/Table/CustomTable.vue";
import selectTree from "../selectTree/index.vue";
import { queryPageSelective, queryAllSelective } from "@/api/publishTopics";

export default {
  components: { CustomTable, selectTree },
  props: {
    editObj: { type: Object, default: () => null },
    modal: { type: Boolean, default: true },
  },
  computed: {},
  data() {
    return {
      types: 3,
      visible: false,
      editFlag: false,
      search: {
        username: "",
        label: "",
        id: "",
      },
      tempId: "",
      orgName: "",
      pagination: {
        pageSize: 5,
        pageNum: 1,
        total: 123,
        layout: "total, sizes, prev, pager, next",
      },
      tableData: [],
      tableCols: [
        {
          label: "姓名",
          prop: "username",
          headerAlign: "center",
          align: "center",
        },
        {
          label: "所属机构",
          prop: "buildName",
          headerAlign: "center",
          align: "center",
        },
      ],
      allFlag: true,
      checkArr: [],
      tempArr: [],
      allPeople: [],
    };
  },
  watch: {
    visible(val) {
      if (!val) {
        this.allFlag = true;
        this.types = 3;
        this.tempArr = [];
        this.tableData = [];
        this.reset();
        this.editFlag = false;
        console.log(this.allFlag, "allFlag");
      } else {
        if (this.editObj == null) {
          return;
        } else {
          // 编辑的情况下
          this.allFlag = this.editObj.allFlag;
          this.types = 1;
          this.tempArr = this.editObj.peopleArr;
          this.editFlag = true;
          this.search.id = this.editObj.orgId;
          this.queryData();
        }
      }
    },
    allFlag(val) {
      console.log(val, "allFlag");
    },
  },
  methods: {
    // 重置
    reset() {
      this.search.username = "";
      this.search.label = "";
    },
    // 查询
    queryData() {
      this.pagination.pageNum = 1;
      this.initTableData();
      let params = {
        orgId: this.search.id,
      };
      queryAllSelective(params).then((res) => {
        this.allPeople = res.object;
      });
    },
    // 初始化表格
    initTableData() {
      if (this.tempId != this.search.id) {
        this.tempId = this.search.id;
        this.tempArr = [];
        this.types = 3;
        this.allFlag = true;
      }
      let params = {
        pageIndex: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        orgId: this.search.id,
      };
      if (this.search.username != "") {
        params.username = this.search.username;
      }
      queryPageSelective(params).then((res) => {
        this.tableData = res.object.result;
        this.pagination.total = res.object.total;
        if (this.allFlag && this.types == 3) {
          setTimeout(() => {
            this.$refs.peopleTable.toggleAllSelection();
          });
        }
        console.log(this.types, "this.types");
        console.log(this.tempArr, "this.tempArr");
        if (this.types == 1) {
          console.log();
          this.$refs.peopleTable.clearSelection();
          this.$nextTick(() => {
            console.log("编辑的=====", this.tempArr);
            this.tableData.forEach((row) => {
              if (this.getArr(this.tempArr).indexOf(row.id) > -1) {
                this.$refs.peopleTable.$refs.cesTable.toggleRowSelection(row);
              }
            });
          });
        }
        if (this.types == 2) {
          this.$nextTick(() => {
            this.tableData.forEach((row) => {
              if (this.getArr(this.tempArr).indexOf(row.id) < 0) {
                this.$refs.peopleTable.$refs.cesTable.toggleRowSelection(row);
              }
            });
          });
        }
      });
    },
    // 单选
    select(vals, val) {
      let findIndex = this.tempArr.findIndex((item) => {
        return item.id == val.id;
      });
      if (this.types == 3) {
        // 类型是3
        this.tempArr.push(val);
        this.allFlag = false;
        this.types = 2;
      } else if (this.types == 2) {
        // 类型是2 排除的放tempArr
        if (findIndex > -1) {
          this.tempArr.splice(findIndex, 1);
          if (this.tempArr.length == 0) {
            this.types = 3;
            this.allFlag = true;
          }
        } else {
          this.tempArr.push(val);
        }
      } else if (this.types == 1) {
        // 类型是1 添加的放tempArr
        if (findIndex > -1) {
          this.tempArr.splice(findIndex, 1);
          if (this.tempArr.length < this.allPeople.length) this.allFlag = false;
        } else {
          this.tempArr.push(val);
          if (this.tempArr.length == this.allPeople.length) this.allFlag = true;
        }
      }
    },
    // 全选
    cancel() {
      this.allFlag = !this.allFlag;
      if (this.allFlag) {
        this.types = 3;
        this.tempArr = [];
        this.$refs.peopleTable.clearSelection();
        this.$refs.peopleTable.toggleAllSelection();
      } else {
        this.$refs.peopleTable.clearSelection();
        this.tempArr = [];
        this.types = 1;
      }
    },
    // 获取id数组
    getArr(initArr) {
      let arr = initArr.map((item) => {
        return item.id;
      });
      return arr;
    },
    // 全选
    selectAll(vals) {
      console.log(this.types, "types===");
      if (vals.length > 0 && this.types == 3) {
        if (vals.length == this.tableData.length) {
          this.tempArr = [];
          this.allFlag = true;
        }
      } else if (this.types == 2) {
        if (vals.length == 0) {
          this.allFlag = false;
          this.tempArr = this.tempArr.concat(this.tableData);
        } else {
          if (this.search.username != "") {
            this.tempArr = this.tempArr.concat(vals);
          }
          this.tempArr = this.tempArr.filter((it) => {
            if (this.getArr(vals).indexOf(it.id) < 0) {
              return it;
            }
          });
          if (this.tempArr.length == 0) {
            this.allFlag = true;
            this.types = 3;
          }
        }
      } else if (this.types == 3) {
        let tem = [];
        this.tempArr = this.tableData.map((it) => {
          tem.push(it);
        });
        this.tempArr = tem;
        this.types = 2;
        this.allFlag = false;
        return;
      } else if (this.types == 1) {
        if (vals.length < 1) {
          let tableIdArr = this.getArr(this.tableData);
          console.log(tableIdArr, "tableIdArr");
          this.tempArr = this.allPeople.filter((item) => {
            if (tableIdArr.indexOf(item.id) < 0) {
              return item;
            }
          });
        }
        this.tempArr = this.tempArr.concat(vals);
        let obj = {};
        this.tempArr = this.tempArr.reduce((cur, next) => {
          obj[next.id] ? "" : (obj[next.id] = true && cur.push(next));
          return cur;
        }, []);
        if (this.tempArr.length == this.allPeople.length) {
          this.allFlag = true;
        } else {
          this.allFlag = false;
        }
      }
    },
    // 改变树选择
    changeTree(value) {
      this.search.id = value.id[0];
      if (this.search.id == "") {
        this.tempId = value.id[0];
      }
      this.orgName = value.name;
    },
    // 提交
    submitData() {
      let successObj = {};
      successObj.orgName = this.orgName;
      successObj.orgNameArry = this.orgName.split(">");
      successObj.orgId = this.search.id;
      successObj.allFlag = this.allFlag;
      if (this.types == 1) {
        successObj.peopleArr = this.tempArr;
      } else if (this.types == 2) {
        successObj.peopleArr = this.allPeople.filter((item) => {
          if (this.getArr(this.tempArr).indexOf(item.id) < 0) {
            return item;
          }
        });
      } else if (this.types == 3) {
        successObj.peopleArr = this.allPeople;
      }
      // 判断是编辑还是添加
      if (this.editObj == null) {
        this.$emit("changeUser", successObj);
      } else {
        this.$emit("edit", { value: successObj, index: this.editObj.index });
      }
      this.visible = false;
      console.log(successObj, this.types, "types");
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.search-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0 0 0;
  .titleName {
    text-align: center;
    display: inline-block;
    width: 60px;
  }
}
.noDataBox {
  padding: 20px 0;
  text-align: center;
  img {
    zoom: 0.5;
  }
}
.el-form {
  width: 100% !important;
}
.peopleTable {
  padding-bottom: 15px;
}
</style>
