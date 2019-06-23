<template>
  <div class="dialog-container">
    <el-dialog :title="title" :visible.sync="myVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        label-width="100px"
      >
        <el-form-item :label="$t('system.menu.parent_id')" prop="parent_id">
          <el-select v-model="dataForm.parent_id" class="filter-item" placeholder="Please select" clearable>
            <el-option v-for="item in menuListCal" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('system.menu.title')" prop="title">
          <el-input v-model="dataForm.title" />
        </el-form-item>
        <el-form-item :label="$t('system.menu.icon')" prop="icon">
          <MfIconSelect v-model="dataForm.icon" />
        </el-form-item>
        <el-form-item :label="$t('system.menu.name')" prop="name">
          <el-input v-model="dataForm.name" />
        </el-form-item>
        <el-form-item :label="$t('system.menu.uri')" prop="uri">
          <el-input v-model="dataForm.uri" />
        </el-form-item>
        <el-form-item :label="$t('system.menu.role_ids')" prop="role_ids">
          <el-select v-model="dataForm.role_ids" class="filter-item" placeholder="Please select" multiple>
            <el-option v-for="item in roleList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="false" :label="$t('system.menu.permission')" prop="permission">
          <el-input v-model="dataForm.permission" />
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
import { cloneDeep, pick, keys } from 'lodash'
import waves from '@/directive/waves' // 水波纹指令

import { commonData } from '@/api/system/common'
import { fetchItem, storeItem, updateItem } from '@/api/system/menu'

import MfIconSelect from '@/components/MfIconSelect'

import { validateByServer } from '@/views/mixins'

const defaultForm = {
  id: undefined,
  parent_id: undefined,
  sort_id: undefined,
  title: '',
  name: '',
  icon: '',
  uri: '',
  role_ids: [],
  permission: ''
}

export default {
  name: 'DialogForm',
  components: { MfIconSelect },
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
      menuList: [],
      loading: false,
      myVisible: false,
      myStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dataForm: cloneDeep(defaultForm),
      rules: this.loadValidateByServer({
        title: [{ required: true, message: 'title is required', trigger: 'change' }],
        name: [],
        uri: [],
        permission: []
      })
    }
  },
  computed: {
    title: function() {
      return this.textMap[this.myStatus]
    },
    menuListCal: function() {
      return this.menuList.filter(item => {
        return item.value !== this.dataForm.id
      })
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
        roleList: {},
        menuList: {}
      }).then(response => {
        this.roleList = response.data.roleList
        this.menuList = response.data.menuList
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
    fetchData(id) {
      this.loading = true
      fetchItem(id).then(response => {
        this.dataForm = response.data
        this.loading = false
      }).catch(err => {
        console.log(err)
      })
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
      this.dataForm = cloneDeep(pick(row, keys(defaultForm))) // copy obj
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
