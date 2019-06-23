<template>
  <div class="dialog-container">
    <el-dialog :title="textMap[myStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" label-position="right" label-width="90px">
        <el-form-item :label="$t('others.upload.filename')" prop="filename">
          <el-input v-model="dataForm.filename" />
        </el-form-item>
        <el-form-item :label="$t('others.upload.file')" prop="path">
          <SingleFileUpload v-model="dataForm" :fields="['filename', 'path']" :data="{demand: 'bare'}" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button v-if="myStatus=='create'" type="primary" @click="createData">{{ $t('common.confirm') }}</el-button>
        <el-button v-else type="primary" @click="updateData">{{ $t('common.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import waves from '@/directive/waves' // 水波纹指令

import { storeItem, updateItem } from '@/api/others/upload'

import SingleFileUpload from '@/components/Upload/SingleFileUpload'

import { validateByServer } from '@/views/mixins'

const defaultForm = {
  id: undefined,
  filename: '',
  path: ''
}

export default {
  name: 'UploadDialog',
  directives: {
    waves
  },
  components: { SingleFileUpload },
  filters: {},
  mixins: [validateByServer],
  props: {
    status: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      list: [],
      dataForm: cloneDeep(defaultForm),
      dialogFormVisible: false,
      myStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: this.loadValidateByServer({
        filename: [{ required: true, message: 'filename is required', trigger: 'change' }]
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
      this.dialogFormVisible = true
    }
  },
  created() {},
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
      this.dialogFormVisible = true
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
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
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
      this.dialogFormVisible = true
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
            this.dialogFormVisible = false
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

<style lang="scss" scoped>
.option {
  &-title {
    width: 78%
  }
  &-remove {
    width: 20%
  }
}
</style>
