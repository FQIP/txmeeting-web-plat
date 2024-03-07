<!--表格组件 -->
<template>
  <section class="commonTablePage">
    <!-- 数据表格 -->
    <!-- isSelection：1 多选；2：单选 -->
    <section class="ces-table" v-cloak>
      <el-table
        :data="tableDataReal"
        :size="size"
        :border="isBorder"
        :stripe="isStripe"
        :height="(heightUpdated ? height : undefined) || undefined"
        :style="{ height: height || '100%' }"
        :highlight-current-row="isSelection && isSelection == 2 ? true : false"
        @select="select"
        @select-all="selectAll"
        @current-change="changeSingleSelect"
         @sort-change='sortChange'
        v-loading="loading"
        :defaultSelections="defaultSelections"
        empty-text="暂无数据"
        ref="cesTable"
        :span-method="spanMethod || undefined"
      >
        <template slot="empty" v-if="!loading">
          <img :src="noneDataImg" class="emptyImg" style="height: 80%" />
          <div>暂无数据</div>
        </template>
        <el-table-column
          v-if="isSelection && isSelection == 1"
          type="selection"
          width="100"
          align="center"
          :selectable="
            options && options.selectable
              ? options.selectable
              : () => {
                  return true;
                }
          "
        ></el-table-column>
        <el-table-column
          v-if="isSelection && isSelection == 2"
          align="center"
          width="80"
          :class-name="singleClass"
          :cell-class-name="singleClass"
        >
          <template slot-scope="scope">
            <el-radio
              :key="scope.row.tableTotalIndex"
              :label="scope.row.tableTotalIndex"
              v-model="tableSingleSelectIndex"
            ></el-radio>
          </template>
        </el-table-column>
        <el-table-column
          v-if="isIndex"
          border
          :index="indexMethod"
          type="index"
          :label="indexLabel"
          align="center"
          width="50"
        ></el-table-column>
        <!-- 数据栏 -->
        <el-table-column
          v-for="item in tableCols"
          :key="item.id"
          :resizable="isResizable"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :min-width="item.minWidth"
          :fixed="item.fixed"
          :align="item.align"
          :class-name="item.class"
          :cell-class-name="item.class"
          :header-align="item.headerAlign || 'left'"
          :sortable='item.sort?"custom":false'
          :render-header="
            item.require
              ? item.renderHeader
                ? item.renderHeader
                : renderHeader
              : null
          "
          v-if="!item.isShow || item.isShow()"
        >
          <template slot-scope="scope">
            <!-- html -->
            <span v-if="item.type === 'Html'">
              <el-tooltip
                v-if="item.tooltip && scope.row[item.htmlProp || item.prop]"
                :effect="'dark'"
                :popper-class="''"
                :open-delay="200"
                placement="bottom"
                :content="item.label || ''"
              >
                <div slot="content">
                  {{ scope.row[item.htmlProp || item.prop] }}
                </div>
                <span
                  v-html="handleHtml(item, scope.row)"
                  @click="item.click && item.click(scope.row)"
                >
                </span>
              </el-tooltip>
              <span
                v-else
                v-html="handleHtml(item, scope.row)"
                @click="item.click && item.click(scope.row)"
              >
              </span>
            </span>
            <!-- 文字 -->
            <span v-if="item.type === 'Text' && item.btnList">
              <template
                v-if="!btn.isShow || (btn.isShow && btn.isShow(scope.row))"
                v-for="(btn, linkindex) in item.btnList"
              >
                <el-tooltip
                  v-if="btn.tooltip && btn.tooltip.isShow(scope.row)"
                  class="item"
                  :effect="btn.tooltip.effect || 'dark'"
                  :popper-class="btn.tooltip.popperClass || ''"
                  :open-delay="200"
                  placement="bottom"
                  :content="btn.label || ''"
                >
                  <div slot="content">{{ btn.tooltip.content(scope.row) }}</div>
                  <span
                    class="oporateBtn oporateText"
                    @click="handle(btn.func, scope.row)"
                    :disabled="btn.isDisabled && btn.isDisabled(scope.row)"
                    >{{ btn.label }}</span
                  >
                </el-tooltip>
                <el-tooltip
                  v-else-if="btn.tooltipx && btn.tooltipx.isShow(scope.row)"
                  :content="btn.label || ''"
                  placement="bottom"
                  effect="light"
                >
                  <div slot="content">
                    {{ btn.tooltipx.content(scope.row) }}
                  </div>
                  <span
                    class="oporateBtn oporateText"
                    @click="handle(btn.func, scope.row)"
                    :disabledx="btn.isDisabledx && btn.isDisabledx(scope.row)"
                    @mouseenter="mouseenter(btn.func2, scope.row)"
                    >{{ btn.label }}</span
                  >
                </el-tooltip>
                <div
                  v-else-if="btn.type === 'More'"
                  class="oporateBtn oporateText oporateMoreBtn"
                  :disabled="btn.isDisabled && btn.isDisabled(scope.row)"
                >
                  <el-tooltip
                    placement="bottom"
                    effect="light"
                    popper-class="custom-light"
                  >
                    <div slot="content">
                      <ul class="operationMoreContainer">
                        <li
                          v-for="(__btn, __linkindex) in btn.btnList"
                          @click="handle(__btn.func, scope.row)"
                          :disabled="
                            __btn.isDisabled && __btn.isDisabled(scope.row)
                          "
                          v-if="
                            !__btn.isShow ||
                            (__btn.isShow && __btn.isShow(scope.row))
                          "
                        >
                          {{ __btn.label }}
                        </li>
                      </ul>
                    </div>
                    <span>{{ btn.label }}</span>
                  </el-tooltip>
                </div>
                <span
                  class="oporateBtn oporateText"
                  @click="handle(btn.func, scope.row)"
                  :disabled="btn.isDisabled && btn.isDisabled(scope.row)"
                  v-else
                  >{{ btn.label }}</span
                >
              </template>
            </span>
            <span v-if="item.type === 'Text' && item.getBtnList">
              <template v-for="(btn, linkindex) in item.getBtnList(scope.row)">
                <el-tooltip
                  v-if="btn.tooltip && btn.tooltip.isShow(scope.row)"
                  class="item"
                  :effect="btn.tooltip.effect || 'dark'"
                  :popper-class="btn.tooltip.popperClass || ''"
                  :open-delay="200"
                  placement="bottom"
                  :content="btn.label || ''"
                >
                  <div slot="content">{{ btn.tooltip.content(scope.row) }}</div>
                  <span
                    class="oporateBtn oporateText"
                    @click="handle(btn.func, scope.row)"
                    :disabled="btn.isDisabled && btn.isDisabled(scope.row)"
                    >{{ btn.label }}</span
                  >
                </el-tooltip>
                <el-tooltip
                  v-else-if="btn.tooltipx && btn.tooltipx.isShow(scope.row)"
                  :content="btn.label || ''"
                  placement="bottom"
                  effect="light"
                >
                  <div slot="content">
                    {{ btn.tooltipx.content(scope.row) }}
                  </div>
                  <span
                    class="oporateBtn oporateText"
                    @click="handle(btn.func, scope.row)"
                    :disabledx="btn.isDisabledx && btn.isDisabledx(scope.row)"
                    @mouseenter="mouseenter(btn.func2, scope.row)"
                    >{{ btn.label }}</span
                  >
                </el-tooltip>
                <div
                  v-else-if="btn.type === 'More'"
                  class="oporateBtn oporateText oporateMoreBtn"
                  :disabled="btn.isDisabled && btn.isDisabled(scope.row)"
                >
                  <el-tooltip
                    placement="bottom"
                    effect="light"
                    popper-class="custom-light"
                  >
                    <div slot="content">
                      <ul class="operationMoreContainer">
                        <li
                          v-for="(__btn, __linkindex) in btn.btnList"
                          @click="handle(__btn.func, scope.row)"
                          :disabled="
                            __btn.isDisabled && __btn.isDisabled(scope.row)
                          "
                          v-if="
                            !__btn.isShow ||
                            (__btn.isShow && __btn.isShow(scope.row))
                          "
                        >
                          {{ __btn.label }}
                        </li>
                      </ul>
                    </div>
                    <span>{{ btn.label }}</span>
                  </el-tooltip>
                </div>
                <span
                  class="oporateBtn oporateText"
                  @click="handle(btn.func, scope.row)"
                  :disabled="btn.isDisabled && btn.isDisabled(scope.row)"
                  v-else
                  >{{ btn.label }}</span
                >
              </template>
            </span>
            <!-- 按钮 -->
            <span v-if="item.type === 'Button'" :class="item.class">
              <el-button
                v-for="(btn, btnindex) in item.btnList"
                :key="btnindex"
                v-if="!btn.isShow || (btn.isShow && btn.isShow(scope.row))"
                :disabled="btn.isDisabled && btn.isDisabled(scope.row)"
                :type="btn.type"
                :size="btn.size || size"
                :icon="btn.icon"
                @click="handle(btn.func, scope.row)"
                >{{ btn.label }}</el-button
              >
            </span>
            <!-- 图标  -->
            <span v-if="item.type === 'Icon'">
              <span v-for="(btn, btnindex) in item.btnList">
                <el-tooltip
                  class="item"
                  effect="dark"
                  v-if="!btn.isShow || (btn.isShow && btn.isShow(scope.row))"
                  :open-delay="200"
                  placement="bottom"
                  :content="btn.label || ''"
                >
                  <i
                    :key="btnindex"
                    v-if="!btn.isShow || (btn.isShow && btn.isShow(scope.row))"
                    :class="btn.icon"
                    :disabled="btn.isDisabled && btn.isDisabled(scope.row)"
                    @click="handle(btn.func, scope.row)"
                  />
                </el-tooltip>
              </span>
            </span>

            <!-- 输入框 -->
            <el-input
              v-if="item.type === 'Input'"
              :disabled="item.isDisabled(scope.row)"
              v-model="scope.row[item.prop]"
              :maxlength="item.maxLength?item.maxLength:10000000"
              :size="size"
              @focus="item.focus && item.focus(scope.row)"
              @change="item.change(scope.row)"
            ></el-input>
            <!-- 数字输入框 -->
            <el-input-number
              v-if="item.type === 'numberInput'"
              v-model="scope.row[item.prop]"
              :size="size"
              :step-strictly="true"
              :step="1"
              @focus="item.focus && item.focus(scope.row)"
              @change="item.change(scope.row)"
              :min="0"
              :max="9999999"
              maxlength="7"
              controls-position="right"
            ></el-input-number>
            <!-- 下拉框 -->
            <el-select
              v-if="item.type === 'Select'"
              v-model="scope.row[item.prop]"
              :props="item.props"
              @change="item.change && item.change(scope.row)"
            >
              <el-option
                v-for="(op, opindex) in item.options"
                :label="op.label"
                :value="op.value"
                :key="op.label"
                v-show="op.value!=3&&item.special"
              ></el-option>
            </el-select>
            <!-- 单选 -->
            <el-radio-group
              v-if="item.type === 'Radio'"
              v-model="scope.row[item.prop]"
              :disabled="btn.isDisabled && btn.isDisabled(scope.row)"
              @change="item.change && item.change(scope.row)"
            >
              <el-radio
                v-for="(ra, raindex) in item.radios"
                :key="raindex"
                :label="ra.value"
                >{{ ra.label }}</el-radio
              >
            </el-radio-group>
            <!-- 复选框 -->
            <el-checkbox-group
              v-if="item.type === 'Checkbox'"
              v-model="scope.row[item.prop]"
              :disabled="btn.isDisabled && btn.isDisabled(scope.row)"
              @change="item.change && item.change(scope.row)"
            >
              <el-checkbox
                v-for="(ra, raindex) in item.checkboxs"
                :key="raindex"
                :label="ra.value"
                >{{ ra.label }}</el-checkbox
              >
            </el-checkbox-group>
            <!-- 评价 -->
            <el-rate
              v-if="item.type === 'Rate'"
              v-model="scope.row[item.prop]"
              :disabled="btn.isDisabled && btn.isDisabled(scope.row)"
              @change="item.change && item.change(scope.row)"
            ></el-rate>
            <!-- 开关 -->
            <el-switch
              v-if="item.type === 'Switch'"
              v-model="scope.row[item.prop]"
              :disabled="btn.isDisabled && btn.isDisabled(scope.row)"
              @change="item.change && item.change(scope.row)"
            ></el-switch>
            <el-switch
              v-if="item.type === 'Switchx'"
              v-model="scope.row[item.prop]"
              :disabled="item.isDisabled && item.isDisabled(scope.row)"
              :active-value="item.activeValue ? item.activeValue : '1'"
              :inactive-value="item.inactiveValue ? item.inactiveValue : '0'"
              :active-text="item.activeText ? item.activeText : '启用'"
              :inactive-text="item.inactiveText ? item.inactiveText : '禁用'"
              @change="item.change && item.change(scope.row)"
            ></el-switch>
            <!-- 图像 -->
            <img
              v-if="item.type === 'Image'"
              :src="scope.row[item.prop]"
              @click="item.handle && item.handle(scope.row)"
            />
            <!-- 上传图片 -->
            <el-upload
              v-if="item.type === 'ImageUpload'"
              :class="[
                'table-img-uploader',
                {
                  'table-img-uploader__disable':
                    item.isDisabled && item.isDisabled(scope.row),
                },
              ]"
              action="https://jsonplaceholder.typicode.com/posts/"
              list-type="picture-card"
              :show-file-list="false"
              :disabled="item.isDisabled && item.isDisabled(scope.row)"
              :on-success="
                (result, file) => {
                  item.handleAvatarSuccess(result, file, scope.row);
                }
              "
              :before-upload="
                (file) => {
                  item.beforeAvatarUpload(file, scope.row);
                }
              "
            >
              <el-image
                v-if="scope.row[item.prop]"
                :src="scope.row[item.prop]"
                class="avatar"
                fit="cover"
              ></el-image>
              <i v-else class="emptyAvatar">
                <i class="iconfont">&#xe6f4;</i>
              </i>
            </el-upload>
            <!-- 自定义 -->
            <span
              v-if="item.type === 'Custom'"
              :params="scope.row"
              :is="item.domType"
              @handleClick="item.handle && item.handle(scope.row, arguments[0])"
              @forceUpdateHeight="forceUpdateHeight"
            ></span>
            <!-- 滑块 -->
            <el-slider
              v-if="item.type === 'Slider'"
              v-model="scope.row[item.prop]"
              :disabled="btn.isDisabled && btn.isDisabled(scope.row)"
              @change="item.change && item.change(scope.row)"
            ></el-slider>
            <!-- 默认 -->
            <el-tooltip
              class="item limit-line-1"
              v-if="!item.popover"
              :open-delay="300"
              :style="item.itemStyle && item.itemStyle(scope.row)"
              :class="item.itemClass && item.itemClass(scope.row)"
              effect="dark"
              placement="bottom"
              :disabled="
                scope.row[item.prop + 'EmptyFlag'] || item.tooltipDiabled
              "
            >
              <div slot="content">{{ scope.row[item.prop] }}</div>
              <span
                v-if="!item.type"
                @click="item.click && item.click(scope.row)"
                @mouseenter="item.mouseenter && item.mouseenter(scope.row)"
                @mouseleave="item.mouseleave && item.mouseleave(scope.row)"
                >{{
                  scope.row[item.prop + "EmptyFlag"]
                    ? emptyText
                    : scope.row[item.prop]
                }}</span
              >
            </el-tooltip>
            <el-popover
              v-if="item.popover"
              :placement="item.popover.placement || 'top-start'"
              :title="item.popover.title"
              :width="item.popover.width || 200"
              :trigger="item.popover.trigger || 'hover'"
            >
              <span v-html="item.popover.content(scope.row)"></span>
              <span
                slot="reference"
                v-if="!item.type"
                @click="item.click && item.click(scope.row)"
                @mouseenter="item.mouseenter && item.mouseenter(scope.row)"
                @mouseleave="item.mouseleave && item.mouseleave(scope.row)"
                >{{
                  scope.row[item.prop + "EmptyFlag"]
                    ? emptyText
                    : scope.row[item.prop]
                }}</span
              >
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <!--      <el-row v-if = '!dataLoading && ((isPagination && !pagination.total) || tableDataReal.length==0)' :style="{ 'height': height|| '100%', 'text-align': 'center' }" v-cloak>-->
      <!--        <img  :src="noneDataImg" class="" style="height: 80%;">-->
      <!--        <p>暂无数据</p>-->
      <!--      </el-row>-->
    </section>
    <!-- 分页 -->
    <section
      class="commonPagination"
      v-if="isPagination && tableDataReal.length > 0"
    >
      <el-pagination
        background
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :layout="
          pagination.layout
            ? pagination.layout
            : 'total, sizes, prev, pager, next, jumper'
        "
        :page-size="pagination.pageSize"
        :page-sizes="[5, 10, 20, 50, 100]"
        :pager-count="pagerCount"
        :current-page="pagination.pageNum"
        :total="pagination.total"
        v-show="pagination.total > 0"
      ></el-pagination>
    </section>
  </section>
</template>

<script>
export default {
  props: {
    isStatistic: { type: Boolean, default: false },
    // 表格型号：mini,medium,small
    size: { type: String, default: "small" },
    height: { type: [String, Number], default: "" },
    pagerCount: { type: Number, default: 7 },
    isBorder: { type: Boolean, default: true },
    loading: { type: Boolean, default: false },
    isStripe: { type: Boolean, default: true },
    isResizable: { type: Boolean, default: false },
    // 表格操作
    isHandle: { type: Boolean, default: false },
    // 表格数据
    tableData: { type: Array, default: () => [] },
    // 表格列配置
    tableCols: { type: Array, default: () => [] },
    // 是否显示表格复选框
    isSelection: {},
    defaultSelections: { type: [Array, Object], default: () => null },
    // 是否显示表格索引
    isIndex: { type: Boolean, default: false },
    indexLabel: { type: String, default: "序号" },
    // 是否显示分页
    isPagination: { type: Boolean, default: true },
    options: { type: [Array, Object], default: () => null },
    //是否合并行
    spanMethod: { type: Function, default: () => {} },
    // 分页数据
    pagination: {
      type: Object,
      default: () => ({ pageSize: 10, pageNum: 1, total: 0 }),
    },
    selectAllFlag: { type: Boolean, default: true },
    editFlag: { type: Boolean, default: false },
  },
  computed: {
    tableDataReal: function () {
      this.dataLoading = false;
      let tableDataReal = [];
      if (!this.tableData) {
        return [];
      }

      for (let i = 0; i < this.tableData.length; i++) {
        let row = this.tableData[i];
        row["tableIndex"] = i + 1;
        row["tableTotalIndex"] =
          (this.pagination.pageNum - 1) * this.pagination.pageSize +
          row["tableIndex"];
        for (let j = 0; j < this.tableCols.length; j++) {
          let item = this.tableCols[j];
          if (!item.type) {
            row[item.prop] =
              (item.formatter && item.formatter(row)) || row[item.prop];
            row[item.prop + "EmptyFlag"] =
              row[item.prop] !== 0 && (!row[item.prop] || row[item.prop] == "")
                ? true
                : false;
          }
        }
        tableDataReal.push(row);
      }

      return tableDataReal;
    },
  },
  data() {
    return {
      heightUpdated: true,
      emptyText: "--",
      noneDataImg: require("@/assets/img/noneData.png"),
      dataLoading: true,
      tableSingleSelectIndex: "",
      singleClass: "is-center single-select-radio",
      singleSelectRow: null,
    };
  },
  watch: {
    defaultSelections: {
      handler: function (val) {
        this.$nextTick(function () {
          if (!this.$refs.cesTable) {
            return false;
          }
          if (Array.isArray(val)) {
            val.forEach((row) => {
              this.$refs.cesTable.toggleRowSelection(row);
            });
          } else {
            if (this.isSelection == 1) {
              this.$refs.cesTable.toggleRowSelection(val);
            } else if (this.isSelection == 2) {
              this.$refs.cesTable.setCurrentRow(val);
            }
          }
        });
      },
      immediate: true,
    },
  },
  mounted() {
    if (this.selectAllFlag && !this.editFlag && this.tableData.length) {
      this.toggleAllSelection();
    }
  },
  methods: {
    indexMethod(index) {
      if (this.isStatistic) {
        return index / 4 + 1;
      } else {
        return index + 1;
      }
    },
    mouseenter(func, row) {
      this.$emit("mouseenter", func, row);
    },
    // 表格单选
    changeSingleSelect(row) {
      this.singleSelectRow = row;
      this.tableSingleSelectIndex = row ? row.tableTotalIndex : "";
    },
    // 表格排序
    sortChange(row) {
      this.$emit("sortChange",row)
    },
    // 表格勾选
    select(rows, row) {
      this.$emit("select", rows, row);
    },
    // 全选
    selectAll(rows) {
      console.log(this.$refs.cesTable.selection);
      this.$emit("selectAll", rows);
    },
    getAllSelection() {
      var list = this.$refs.cesTable.selection;
      return list;
    },
    //
    handleCurrentChange(val) {
      this.tableSingleSelectIndex = "";
      this.pagination.pageNum = val;
      this.$emit("reloadTable", val);
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.$emit("reloadTable", val);
    },
    //操作每行按钮
    handle(func, row) {
      this.$emit("operateRow", func, row);
    },
    handleHtml(colsItem, row) {
      let html = colsItem.html(row);
      let attr = [];
      if (colsItem.class) {
        attr.push('class="' + colsItem.class + '"');
      }

      if (colsItem.title) {
        attr.push('title="' + html + '"');
      }

      if (attr.length > 0 && html) {
        html = "<span " + attr.join(" ") + ">" + html + "</span>";
      }

      return html ? html : this.emptyText;
    },
    // tableRowClassName({rowIndex}) {
    //     if (rowIndex % 2 === 0) {
    //         return "stripe-row";
    //     }
    //     return "";
    // }
    getRowColData(colsItem, row) {
      return (
        (colsItem.formatter && colsItem.formatter(row)) || row[colsItem.prop]
      );
    },
    renderHeader(h, obj) {
      return h("span", { class: "common-table-require" }, obj.column.label);
    },
    forceUpdateHeight() {
      this.heightUpdated = false;
      let nowScrollTop = this.$refs.cesTable.$refs.bodyWrapper.scrollTop;
      this.$nextTick(() => {
        this.heightUpdated = true;
        this.$nextTick(() => {
          //滚动到之前位置
          this.$refs.cesTable.$refs.bodyWrapper.scrollTop = nowScrollTop;
        });
      });
    },
    toggleRowSelection(row) {
      this.$refs.cesTable.toggleRowSelection(row, true);
    },
    toggleAllSelection(val = true) {
      this.$refs.cesTable.toggleAllSelection(val);
    },
    clearSelection() {
      this.$refs.cesTable.clearSelection();
    },
  },
};
</script>
<style lang="scss" scoped>
$mainBlue: #0a6feb;
.operationMoreContainer {
  font-size: 14px;
  li {
    padding: 5px 15px;
    cursor: pointer;
    border-bottom: 1px solid #eee;
    background-color: #fff;
    font-size: 13px;
    line-height: 1.66em;
    color: #666;
    float: none;
    text-align: center;
    &:hover {
      color: $mainBlue;
    }
  }
}
.commonTablePage {
  ::v-deep .el-table__empty-text {
    padding: 4rem 0;
  }
  .oporateBtn {
    padding: 0 3px;
    color: #1492ff;
    user-select: none;
    cursor: pointer;
    // &:not(:last-child) {
    //   border-right: 1px solid rgba(233, 233, 233, 1);
    // }
    &.oporateText {
      padding: 0 10px;

      &[disabled] {
        color: #e6e6e6;
        cursor: unset;
        pointer-events: none;
      }
      &[disabledx] {
        color: #e6e6e6;
        cursor: unset;
      }
    }
  }

  .oporateMoreBtn {
    display: inline-block;
    position: relative;
  }

  ::v-deep .single-select-radio {
    .cell {
      line-height: unset !important;
      text-align: center;
      .el-radio {
        width: 14px;
        height: 14px;
        .el-radio__label {
          display: none;
        }
        input {
          height: unset;
        }
      }
    }
  }
  ::v-deep .el-table__header {
    .single-select-radio {
      .cell {
        &:before {
          content: "选择";
          font-size: 0.9em;
        }
      }
    }
  }

  .commonPagination {
    margin-top: 20px;
    text-align: right;
  }
  i {
    margin: 0 2px;
  }

  .limit-line-1 {
    white-space: nowrap;
  }

  [class*=" el-icon-"],
  [class^="el-icon-"],
  .iconfont:before {
    color: $mainBlue;
    background: #ecf5ff;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    line-height: 2rem;
    text-align: center;
    font-size: 1.2rem;
    display: inline-block;
    cursor: pointer;
  }

  [class*=" el-icon-"][disabled],
  [class^="el-icon-"][disabled],
  .iconfont[disabled]:before {
    color: #888484;
    background: #f4f4f4;
    cursor: unset;
  }

  [class*=" el-icon-"]:hover,
  [class^="el-icon-"]:hover,
  .iconfont:hover:before {
    box-shadow: 1px 1px 3px #4a6dcf;
  }

  [class*=" el-icon-"][disabled]:hover,
  [class^="el-icon-"][disabled]:hover,
  .iconfont[disabled]:hover:before {
    box-shadow: none;
    border: 1px solid #d2c7c7;
  }

  .el-select {
    height: 32px;
  }
  .nowrap {
    white-space: nowrap;
  }
  .emptyImg {
    max-height: 35vh;
  }
}
// ::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active {
//   background: $mainBlue;
//   border-color: $mainBlue;
// }
.el-upload .el-image {
  display: unset;
}
</style>
