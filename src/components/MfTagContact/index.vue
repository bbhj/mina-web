<template>
  <div class="nvTag">
    <el-form-item :label="tag.label" prop="option_ids">
      <div v-for="(item, key) in curVal" :key="key">
        <el-input v-model="item.value" placeholder="Please input">
          <template slot="prepend">
            <el-select v-model="item.option_id" class="filter-item" placeholder="Please select">
              <el-option
                v-for="option in optionsCal"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </template>
          <template slot="append">
            <el-button size="mini" icon="el-icon-delete" circle @click="handleRemove(item)" />
            <el-button v-if="key === 0" size="mini" icon="el-icon-plus" circle @click="handleAdd" />
          </template>
        </el-input>
      </div>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'MfTagContact',
  props: {
    tag: {
      type: Object,
      required: true
    },
    value: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      curVal: []
    }
  },
  computed: {
    optionsCal: function() {
      return this.tag.options.filter(item => {
        return this.selectedOptionIds.indexOf(item.value) === -1
      })
    },
    selectedOptionIds: function() {
      return this.curVal.map(item => item.option_id)
    }
  },
  watch: {
    value: {
      handler: function(val, oldVal) {
        this.reloadCurValue()
      },
      deep: true
    },
    curVal: {
      handler: function(val) {
        // const valFlat = flatten(values(val))
        // const oldValFlat = this.value.map(item => item.id)
        // if (xor(valFlat, oldValFlat).length > 0) {
        //   const res = this.options.filter(item => {
        //     return valFlat.indexOf(item.id) !== -1
        //   }).map(item => {
        //     return item
        //   })
        //   this.$emit('input', res)
        // }
      },
      deep: true
    }
  },
  created() {
    this.reloadCurValue()
  },
  methods: {
    handleRemove(item) {
      var index = this.curVal.indexOf(item)
      if (index !== -1) {
        this.curVal.splice(index, 1)
      }
    },
    handleAdd() {
      this.curVal.push({
        option_id: undefined,
        value: undefined
      })
    },
    reloadCurValue() {
      this.curVal = this.value
      if (this.value.length <= 0) {
        this.handleAdd()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-select {
  width: 80px;
}
</style>
