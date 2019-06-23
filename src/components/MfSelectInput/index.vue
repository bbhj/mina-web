<template>
  <div class="nv-select-input">
    <template v-if="curVal && curVal.length > 0">
      <el-table
        :data="curVal"
        style="width: 100%"
      >
        <el-table-column
          :prop="select.field"
          :label="select.title"
          width="180px"
        >
          <template slot-scope="scope">
            <el-select
              v-if="true || getEditable(scope.$index)"
              v-model="scope.row[select.field]"
              class="filter-item"
              placeholder="Please select"
            >
              <el-option
                v-for="option in options"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
            <span v-else>{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :prop="input.filed"
          :label="input.title"
        >
          <template slot-scope="scope">
            <el-input v-if="true || getEditable(scope.$index)" v-model="scope.row[input.field]" placeholder="Please input" />
            <span v-else>{{ scope.row[input.field] }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="160px"
        >
          <template slot="header" slot-scope="scope">
            操作
            <el-button type="text" @click="handleAdd(scope.row)">添加</el-button>
          </template>
          <template slot-scope="scope">
            <el-button v-if="false && !getEditable(scope.$index)" type="text" @click="handleEditable(scope.$index)">编辑</el-button>
            <el-button type="text" @click="handleRemove(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template v-if="false">
        <div v-for="(item, key) in curVal" :key="key">
          <el-input v-model="item[input.field]" placeholder="Please input" />
          <template slot="prepend">
            <el-select v-model="item[select.field]" class="filter-item" placeholder="Please select">
              <el-option
                v-for="option in options"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </template>
          <template slot="append">
            <el-button icon="el-icon-delete" circle @click="handleRemove(item)" />
            <el-button v-if="key === 0" icon="el-icon-plus" circle @click="handleAdd" />
          </template>
        </div>
      </template>
    </template>
    <template v-else>
      <el-button type="text" @click="handleAdd">添加</el-button>
    </template>
  </div>
</template>

<script>
export default {
  name: 'MfSelectInput',
  props: {
    select: { // {field: '', title: ''}
      type: Object,
      required: true
    },
    input: { // {{field: '', title: ''}
      type: Object,
      required: true
    },
    options: {
      type: Array,
      required: true
    },
    value: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      toggleEditStack: {},
      curVal: []
    }
  },
  computed: {
    optionsCal: function() {
      return this.options.filter(item => {
        return this.selectedOptionIds.indexOf(item.value) === -1
      })
    },
    selectedOptionIds: function() {
      return this.curVal.map(item => item[this.select.field])
    },
    unselectedOptions: function() {
      return this.options.filter(item => {
        return this.selectedOptionIds.indexOf(item.value) === -1
      })
    }
  },
  watch: {
    value: {
      handler: function(val, oldVal) {
        this.reloadCurValue()
      },
      deep: true
    }
  },
  created() {
    this.reloadCurValue()
  },
  methods: {
    getEditable(idx) {
      return this.toggleEditStack[idx]
    },
    handleEditable(idx) {
      this.$set(this.toggleEditStack, idx, true)
    },
    handleRemove(item) {
      var index = this.curVal.indexOf(item)
      if (index !== -1) {
        this.curVal.splice(index, 1)
      }
    },
    handleAdd() {
      if (this.unselectedOptions.length > 0) {
        const tmp = {}
        this.$set(tmp, this.select.field, this.unselectedOptions[0].value)
        this.$set(tmp, this.input.field, undefined)
        this.curVal.push(tmp)
      } else {
        this.$message.warning('可用选项已选完')
      }
    },
    reloadCurValue() {
      this.toggleEditStack = []
      this.curVal = this.value
    }
  }
}
</script>

<style lang="scss" scoped>
// .el-select {
//   width: 160px;
// }
</style>
