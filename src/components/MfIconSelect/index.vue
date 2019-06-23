<template>
  <div class="nv-icon-select">
    <svg-icon v-if="curVal && curVal.length > 0" :icon-class="curVal" style="font-size: 16px;" />
    <el-select ref="select" v-model="curVal" style="width: 300px" placeholder="请选择" @change="handleChange" @visible-change="handleVisibleChange">
      <el-option-group
        v-for="group in iconsMap"
        :key="group.label"
      >
        <el-option
          v-for="item in group.options"
          :key="item"
          :label="item"
          :value="item"
        >
          <span :title="item" class="icon-item">
            <svg-icon :icon-class="item" />
          </span>
        </el-option>
      </el-option-group>
    </el-select>
  </div>
</template>

<script>
import { chunk } from 'lodash'

import icons from './requireIcons'
import clipboard from '@/utils/clipboard'

export default {
  name: 'MfIconSelect',
  components: {},
  props: {
    value: {
      type: String,
      required: false,
      default: ''
    }
  },
  data() {
    return {
      iconsMap: chunk(icons, 3).map((item, idx) => {
        return {
          label: idx,
          options: item
        }
      }),
      curVal: this.value
    }
  },
  computed: {
  },
  watch: {
    value: {
      handler: function(val, oldVal) {
        if (val !== oldVal) {
          this.curVal = val
        }
      },
      immediate: true
    }
  },
  methods: {
    handleChange(value) {
      this.$emit('input', value)
    },
    handleVisibleChange(visible) {
      // if (visible) {
      //   const popper = this.$refs.select.$refs.popper
      // }
    },
    generateIconCode(symbol) {
      return `<svg-icon icon-class="${symbol}" />`
    },
    handleClipboard(text, event) {
      clipboard(text, event)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.nv-icon-select {
  overflow: hidden;
  .icons-wrapper {
    margin: 0 auto;
  }
  .icon-item {
    margin: 20px;
    height: 110px;
    text-align: center;
    width: 110px;
    float: left;
    font-size: 30px;
    color: #24292e;
    cursor: pointer;
  }
  span {
    display: block;
    font-size: 24px;
    margin-top: 10px;
  }
  .disabled{
    pointer-events: none;
  }
}
.el-select-group__wrap:not(:last-of-type) {
  padding-bottom: unset;
}
.el-select-group__title {
  display: none;
}
.el-select-dropdown__item {
  // margin: 10px;
  height: 50px;
  width: 70px;
  text-align: center;
  float: left;
  font-size: 30px;
  color: #24292e;
  cursor: pointer;
}
</style>
