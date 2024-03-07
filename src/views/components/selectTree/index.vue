<template>
  <div class="tree">
    机构选择
    <el-cascader
      ref="tree"
      v-model="value"
      :options="treeData"
      :props="props"
      :separator="'>'"
      @change="change"
    ></el-cascader>
  </div>
</template>

<script>
import { getTree } from "@/api/publishTopics";
export default {
  data() {
    return {
      value: "",
      treeData: [],
      props: {
        lazy: true,
        expandTrigger: "hover",
        checkStrictly: true,
        lazyLoad(node, resolve) {
          let params = new URLSearchParams();
          params.append("id", node.value);
          getTree(params).then((res) => {
            let org = res.object.org;
            if (org && org.length > 0) {
              let data = res.object.org.map((item) => {
                item.label = item.name;
                item.value = item.id;
                return item;
              });
              resolve(data);
            } else {
              resolve();
            }
          });
        },
      },
    };
  },
  watch: {
    value(val) {
      console.log(val);
      console.log(this.treeData);
    },
  },
  methods: {
    initData() {
      let params = new URLSearchParams();
      let orgId = sessionStorage.getItem("orgId");
      params.append("id", orgId);
      getTree(params).then((res) => {
        this.treeData = res.object.org.map((item) => {
          item.label = item.name;
          item.value = item.id;
          return item;
        });
      });
    },
    change(val) {
      setTimeout(() => {
        let name = this.$refs.tree.inputValue;
        console.log(this.$refs.tree.inputValue);
        this.$emit("changeTree", { id: val.slice(-1), name: name });
      });
    },
  },
  mounted() {
    this.initData();
  },
};
</script>

<style></style>
