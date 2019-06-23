<template>
  <div class="dialog-container">
    <el-dialog :title="title" :visible.sync="myVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        label-width="100px"
      >
        <el-form-item :label="$t('system.config.title')" prop="title">
          <el-input v-model="dataForm.title" />
        </el-form-item>
        <el-form-item :label="$t('system.config.describe')" prop="describe">
          <el-input v-model="dataForm.describe" />
        </el-form-item>
        <el-form-item :label="$t('system.config.key')" prop="key">
          {{ dataForm.key }}
        </el-form-item>
        <el-form-item :label="$t('system.config.value')" prop="value">
          <el-input
            v-model="dataForm.value"
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="myVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button v-if="myStatus=='create'" type="primary" @click="createData">{{ $t('common.confirm') }}</el-button>
        <el-button v-else type="primary" @click="updateData">{{ $t('common.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import waves from '@/directive/waves' // 水波纹指令

import { commonData } from '@/api/system/common'
import { storeItem, updateItem } from '@/api/system/config'

import { validateByServer } from '@/views/mixins'

const defaultForm = {
  id: undefined,
  title: '',
  describe: '',
  type: '',
  key: '',
  value: ''
}

export default {
  name: 'DialogForm',
  filters: {},
  directives: {
    waves
  },
  mixins: [validateByServer],
  props: {
    status: { // Edit | Create
      type: String,
      default: ''
    }
  },
  data() {
    return {
      roleList: [],
      dataForm: cloneDeep(defaultForm),
      myVisible: false,
      myStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: this.loadValidateByServer({
        title: [{ required: true, message: 'title is required', trigger: 'change' }],
        slug: [{ required: true, message: 'slug is required', trigger: 'change' }]
      })
    }
  },
  computed: {
    title: function() {
      return this.textMap[this.myStatus]
    }
  },
  watch: {
    status: function(val) {
      this.myStatus = val
      this.myVisible = true
    }
  },
  created() {
    this.$nextTick(() => {
      commonData({
        roleList: {}
      }).then(response => {
        this.roleList = response.data.roleList
      })
    })
  },
  methods: {
    resetTemp() {
      this.dataForm = cloneDeep(defaultForm)
    },
    emitModify(idx, item) {
      this.$emit('modify', idx, item)
    },
    handleCreate() {
      this.resetTemp()
      this.myStatus = 'create'
      this.myVisible = true
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate()
      })
    },
    createData() {
      this.resetValidateByServer()
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          storeItem(this.dataForm).then((response) => {
            this.emitModify(null, response.data)
            this.myVisible = false
            this.$notify({
              title: '成功',
              message: response.message,
              type: 'success',
              duration: 2000
            })
          }).catch(e => {
            this.emitValidateByServer(this.$refs.dataForm, e)
          })
        }
      })
    },
    handleUpdate(row) {
      this.dataForm = cloneDeep(row) // copy obj
      this.myStatus = 'update'
      this.myVisible = true
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate()
      })
    },
    updateData() {
      this.resetValidateByServer()
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          const tempData = cloneDeep(this.dataForm)
          updateItem(tempData).then((response) => {
            this.emitModify(response.data.id, response.data)
            this.myVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          }).catch(e => {
            this.emitValidateByServer(this.$refs.dataForm, e)
          })
        }
      })
    }
  }
}
</script>
