<template>
  <div class="cus-checkbox" @click="toggleChecked">
    <div
      :class="[
        'checkbox',
        shape,
        size,
        {
          checked: checked,
          indeterminate,
          disabled,
        },
      ]"
    >
      <i class="el-icon-minus icon" v-if="indeterminate"></i>
      <i class="el-icon-check icon" v-else></i>
    </div>
    <template v-if="replaceLabelToSlot">
      <slot name="label" :label="label ? label : ''" />
    </template>
    <template v-else>
      <div class="label" v-if="label">
        {{ label }}
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "CusCheckBox",
  model: {
    prop: "checked",
    event: "change",
  },
  props: {
    label: String,
    checked: Boolean,
    indeterminate: Boolean,
    disabled: {
      type: Boolean,
      default: false,
    },
    /**
     * @type {PropValidator<'circle'|'round'>}
     */
    shape: {
      type: String, //circle / round
      default: "circle",
    },
    size: {
      type: String, //large / medium / small / mini
      default: "medium",
    },
  },
  data() {
    return {
      // curChecked: false,
    };
  },
  methods: {
    toggleChecked() {
      if (!this.disabled) {
        this.curChecked = !this.curChecked;
        this.$emit("change", this.curChecked);
      }
    },
  },
  computed: {
    replaceLabelToSlot() {
      const labelSlot = this.$slots["label"];
      if (labelSlot) {
        return true;
      } else {
        return false;
      }
    },
  },
  watch: {
    // checked(newVal) {
    //   this.curChecked = newVal;
    // },
  },
};
</script>

<style lang="scss" scoped>
.cus-checkbox {
  display: inline-flex;
  align-items: center;
  .checkbox {
    $lrgSize: 22px;
    $midSize: 18px;
    $smlSize: 16px;
    $minSize: 14px;
    box-sizing: border-box;
    border-width: 1px;
    border-style: solid;
    border-color: #cfcfd1;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
    background-color: #fff;
    width: 18px;
    height: 18px;

    &.large {
      width: $lrgSize;
      height: $lrgSize;
      & + .label {
        font-size: $lrgSize;
      }
    }
    &.medium {
      width: $midSize;
      height: $midSize;
      & + .label {
        font-size: $midSize;
      }
    }
    &.small {
      width: $smlSize;
      height: $smlSize;
      & + .label {
        font-size: $smlSize;
      }
    }
    &.mini {
      width: $minSize;
      height: $minSize;
      & + .label {
        font-size: $minSize;
      }
    }
    &.circle {
      border-radius: 200px;
    }
    &.round {
      border-radius: 4px;
    }
    &.disabled {
      cursor: not-allowed;
      background-color: #d5d5d5;
      & + .label {
        color: #bfbfc1;
        cursor: not-allowed;
      }
    }
    &:hover:not(.disabled) {
      background-color: #d6d7d9;
      &:active {
        background-color: #ebebeb;
      }
      .icon {
        opacity: 1;
      }
    }
    &.checked:not(.disabled),
    &.indeterminate {
      $mainBlue: #0a6feb;
      background-color: $mainBlue;
      border-color: $mainBlue;
      &:hover {
        background-color: #486ef5;
        &:active {
          background-color: #5a7cf5;
        }
      }
      .icon {
        opacity: 1;
      }
    }
    .icon {
      opacity: 1;
      font-size: 12px;
      color: #fff;
      font-weight: bold;
      transition: all 0.3s;
    }
  }
  .label {
    display: inline-block;
    margin-left: 8px;
    color: #333333;
    font-size: 14px;
    font-weight: 500;
    user-select: none;
  }
}
</style>
