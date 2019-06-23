<template>
  <div class="input-block">
    <el-input
      v-if="inputVisible && !isShow && typeCal.indexOf('input') !== -1"
      v-model="inputValue"
      :placeholder="placeholderCal"
      size="small"
      class="input-new-tag"
      @keyup.enter.native="handleInputConfirm"
      @blur="handleInputConfirm"
    >
      <template slot="append">
        <label @click="handleInputConfirm">添加</label>
      </template>
    </el-input>
    <el-select
      v-if="inputVisible && !isShow && typeCal.indexOf('select') !== -1 && optionsCal.length > 0"
      v-model="selectValue"
      clearable
      placeholder="请选择"
      @change="handleSelectConfirm"
    >
      <el-option
        v-for="item in optionsCal"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        class="input-new-tag"
      />
    </el-select>
    <el-tag
      v-for="tag in curVal"
      :key="tag"
      :closable="!isShow"
      :disable-transitions="false"
      @close="handleClose(tag)"
    >
      {{ getTagText(tag) }}
    </el-tag>
  </div>
</template>

<script>
import { cloneDeep, uniq, trim, isString, isArray } from 'lodash'

export default {
  name: 'MfTag',
  props: {
    type: { // input, select
      type: [Array, String],
      default: _ => ['input']
    },
    options: {
      type: Array,
      default: _ => []
    },
    optionsFilter: {
      type: Function,
      default: list => list
    },
    optionsRepeat: {
      type: Boolean,
      default: false
    },
    value: {
      type: [Array, String],
      required: true
    },
    quantity: {
      type: Number,
      default: 20
    },
    lengthMin: {
      type: Number,
      default: -1
    },
    lengthMax: {
      type: Number,
      default: 10
    },
    isShow: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      curVal: [],
      inputValue: '',
      selectValue: undefined
    }
  },
  computed: {
    typeCal: function() {
      return isString(this.type) ? [this.type] : this.type
    },
    optionsCal: function() {
      let options = this.options
      if (!this.optionsRepeat) {
        options = this.options.filter(item => {
          return this.curVal.indexOf(item.value) === -1
        })
      }
      return this.optionsFilter(options)
    },
    placeholderCal: function() {
      return this.placeholder || `空格分隔，最多${this.quantity}个，每个标签不超过${this.lengthMax}个字符`
    },
    curValType: function() {
      return typeof this.value === 'string' ? 'string' : 'array'
    },
    inputVisible: function() {
      if (this.curVal.length >= this.quantity) {
        return false
      }
      return true
    }
  },
  watch: {
    value: function(val, oldVal) {
      this.loadValue()
    },
    curVal: function(val, oldVal) {
      const res = this.curValType === 'string'
        ? this.curVal.join(',')
        : this.curVal
      if (this.value !== res) {
        this.$emit('input', res)
      }
    }
  },
  created() {
    this.loadValue()
  },
  methods: {
    getTagText(tag) {
      let res = tag
      if (this.options.length > 0) {
        this.options.forEach(el => {
          if (el.value === tag) {
            res = el.label
          }
        })
      }
      return res
    },
    handleClose(tag) {
      this.curVal.splice(this.curVal.indexOf(tag), 1)
    },
    handleInputConfirm() {
      const inputValue = this.inputValue
        .split(' ')
        .map(item => {
          return trim(item)
        })
        .filter(item => {
          return item.length <= this.lengthMax && item.length > 0
        })
      if (inputValue.length > 0) {
        this.addValue(inputValue)
      }
      this.inputValue = ''
    },
    handleSelectConfirm(val) {
      if (val) {
        this.addValue(val)
      }
      this.selectValue = undefined
    },
    addValue(value) {
      console.log(value)
      const res = cloneDeep(this.curVal)
      if (isArray(value)) {
        res.push(...value)
      } else {
        res.push(value)
      }
      this.curVal = uniq(res).slice(0, this.quantity)
    },
    loadValue() {
      if (this.value) {
        if (this.curValType === 'string') {
          this.curVal = this.value.split(',')
        } else {
          this.curVal = this.value
        }
      } else {
        this.curVal = []
      }
    }
  }
}
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
