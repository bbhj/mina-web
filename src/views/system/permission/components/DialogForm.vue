<template>
  <div class="dialog-container">
    <el-dialog :title="textMap[myStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" label-position="right" label-width="90px">
        <el-form-item :label="$t('system.permission.title')" prop="title">
          <el-input v-model="dataForm.title" />
        </el-form-item>
        <el-form-item :label="$t('system.permission.type')" prop="type">
          <el-select v-model="dataForm.type" :placeholder="$t('system.permission.type')" class="filter-item" style="width: 200px;" clearable filterable>
            <el-option
              v-for="(item, key) in permissionTypeList"
              :key="key"
              :title="item.label"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('system.permission.name')" prop="name">
          <el-input v-model="dataForm.name" />
        </el-form-item>
        <el-form-item :label="$t('system.permission.http_method')" prop="http_method">
          <el-checkbox-group v-model="dataForm.http_method">
            <el-checkbox
              v-for="(item, key) in httpMethods"
              :key="key"
              :label="item.label"
            >
              {{ item.value }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="$t('system.permission.http_path')" prop="http_path">
          <el-input v-model="dataForm.http_path" type="textarea" />
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
import { mapState } from 'vuex'
import waves from '@/directive/waves' // 水波纹指令

import { storeItem, updateItem } from '@/api/system/permission'

import { validateByServer } from '@/views/mixins'

const httpMethods = [
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' },
  { label: 'PUT', value: 'PUT' },
  { label: 'PATCH', value: 'PATCH' },
  { label: 'DELETE', value: 'DELETE' }
]

const defaultForm = {
  id: undefined,
  type: undefined,
  title: '',
  name: '',
  http_method: [],
  http_path: ''
}

export default {
  name: 'DialogForm',
  directives: {
    waves
  },
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
        title: [{ required: true, message: 'title is required', trigger: 'change' }]
      }),
      httpMethods
    }
  },
  computed: {
    ...mapState('system', {
      permissionTypeList: state => state.permissionTypeList,
      getListLable: state => state.getListLable
    }),
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
