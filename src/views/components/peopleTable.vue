<template>
  <div :style="tableType == 1 && !noPage&& widthSet ? 'width: 40vw' : ''">
    <div class="numTip" v-if="tableType == 1">
      参会人总共{{ tableData.length }}人，明细如下
    </div>
    <div class="numTip" v-if="tableType == 2">
      邀请参会人数共计xxx,已完成xxx，未确认xxx
    </div>
    <div class="numTip" v-if="tableType == 4 && voteObj">
     线上参与投票共计{{voteObj.total}}人，已完成{{voteObj.hasVote}}人，未完成{{Number(voteObj.total)-Number(voteObj.hasVote)}}人，如果存在线下投票情况，
      请补充线下投票数据
    </div>
    <custom-table
      class="my-table topicsList-table"
      :isIndex="tableType !== 3 && tableType !== 4 ? true : false"
      :isPagination="true"
      :isHandle="true"
      :tableData="
        noPage
          ? tableData
          : tableData.slice(
              (pagination.pageNum - 1) * pagination.pageSize,
              pagination.pageNum * pagination.pageSize
            )
      "
      :tableCols="
        tableType == 1
          ? tableCols
          : tableType == 2
          ? meetingTableCols
          : tableType == 3
          ? voteTableCols
          : tableType == 4
          ? voteCollectTableCols
          : []
      "
      :pagination="noPage ? {} : pagination"
      @operateRow="operateRow"
    />
  </div>
</template>

<script>
import CustomTable from "../../components/Table/CustomTable";
export default {
  components: { CustomTable },
  model: {
    prop: "tableData",
    event: "change",
  },
  props: {
    see: {
      type: Boolean,
      default: true,
    },
    widthSet: {
      type: Boolean,
      default: true,
    },
    noPage: {
      type: Boolean,
      default: false,
    },
    tableType: {
      type: Number,
      default: 1,
    },
    tableData: { type: Array, default: () => [] },
    voteObj: { type: Object, default: () => null },
    tipStr: {
      type: String,
      default: "",
    },
  },
  name: "peooleTable",
  data() {
    return {
      tableCols: [
        {
          label: "姓名",
          prop: "label",
          headerAlign: "center",
          align: "center",
        },
        {
          label: "所属机构",
          prop: "buildName",
          headerAlign: "center",
          align: "center",
        },
        {
          label: "操作",
          type: "Text",
          headerAlign: "center",
          align: "center",
          getBtnList: (row) => {
            if (this.see) {
              return;
            }
            let btnList = [];
            btnList.push({
              type: "primary",
              func: "delPeopely",
              label: "删除",
            });
            return btnList;
          },
        },
      ],
      meetingTableCols: [
        {
          label: "姓名",
          prop: "label",
          headerAlign: "center",
          align: "center",
        },
        {
          label: "参会确认结果",
          prop: "meetingTargetOrg",
          headerAlign: "center",
          align: "center",
        },
        {
          label: "备注",
          type: "Text",
          headerAlign: "center",
          align: "center",
        },
      ],
      voteCollectTableCols: [
        {
          label: "投票项",
          prop: "optionDescribe",
          headerAlign: "center",
          align: "center",
        },
        {
          label: "线上票数",
          prop: "onlineVotes",
          headerAlign: "center",
          align: "center",
        },
        {
          label: "线下票数",
          type: "numberInput",
          prop: "offlineVotes",
          headerAlign: "center",
          align: "center",
          change: (row) => {
            console.log(row);
            row.totalVotes= parseInt(row.offlineVotes) +  parseInt(row.onlineVotes);
          },
        },
        {
          label: "总票数",
          headerAlign: "center",
          prop: "totalVotes",
          align: "center",
        },
      ],
      pagination: {
        pageSize: 10,
        pageNum: 1,
        total: 1,
        layout: "total, sizes, prev, pager, next",
      },
    };
  },
  watch: {
    tableData: {
      handler() {
        this.$set(this.pagination, "total", this.tableData.length);
        // this.$nextTick(() => this.updateCheckedByMeetingList(lists))
      },
      immediate: true,
    },
  },
  methods: {
    operateRow(func, row) {
      if (func == "delPeopely") {
        //删除数组中的和树中的
        this.handleDelec(row);
      }
    },
    handleDelec(item) {
      this.$emit("handleDelec", item);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  .commonTablePage .el-table thead tr th {
    background-color: #fff;
    border-bottom: 1px solid #e5e7ed;
  }
}
</style>
