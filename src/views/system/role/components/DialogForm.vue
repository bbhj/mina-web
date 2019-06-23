<template>
  <div class="dialog-container">
    <el-dialog :title="title" :visible.sync="myVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        label-width="100px"
      >
        <el-form-item :label="$t('system.role.title')" prop="title">
          <el-input v-model="dataForm.title" />
        </el-form-item>
        <el-form-item :label="$t('system.role.slug')" prop="slug">
          <el-input v-model="dataForm.slug" :disabled="myStatus !== 'create'" />
        </el-form-item>
        <el-form-item :label="$t('system.role.permission_ids')" prop="permission_ids">
          <el-select v-if="false" v-model="dataForm.permission_ids" class="filter-item" multiple filterable placeholder="Please select">
            <el-option v-for="item in permissionList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-checkbox-button
            v-for="item in permissionList"
            :key="item.value"
            :label="item.value"
            :value="dataForm.permission_ids.indexOf(item.value) !== -1"
            @change="handlePermissionIdsChange(item.data, $event)"
          >
            {{ item.label }}
          </el-checkbox-button>
        </el-form-item>
        <el-form-item :label="$t('system.role.menu_ids')" prop="menu_ids">
          <el-tree
            v-if="myVisible"
            ref="refMenuTree"
            :data="menuList"
            :props="{
              label: 'label',
              children: 'children'
            }"
            :default-expand-all="true"
            :default-checked-keys="dataForm.menu_ids"
            node-key="value"
            show-checkbox
            @check-change="handleTreeCheckChange"
          >
            <div
              slot-scope="{ node, data }"
            >
              <span>{{ node.label }}</span>
              <el-checkbox-button
                v-for="perm in data.permissions"
                :key="perm.id"
                :label="perm.id"
                :value="dataForm.permission_ids.indexOf(perm.id) !== -1"
                @change="handlePermissionIdsChange(perm, $event)"
              >
                {{ perm.title }}
              </el-checkbox-button>
            </div>
          </el-tree>
          <el-select v-if="false" v-model="dataForm.menu_ids" class="filter-item" multiple filterable placeholder="Please select">
            <el-option v-for="item in menuList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
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
import { storeItem, updateItem } from '@/api/system/role'

import { validateByServer } from '@/views/mixins'

const defaultForm = {
  id: undefined,
  title: '',
  slug: '',
  permission_ids: [],
  permissions: [],
  menu_ids: []
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
      tmpTree: '',
      permissionList: [],
      menuList: [],
      dataForm: cloneDeep(defaultForm),
      myVisible: false,
      myStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: this.loadValidateByServer({
        name: [{ required: true, message: 'name is required', trigger: 'change' }],
        username: [{ required: true, message: 'username is required', trigger: 'change' }],
        contact: []
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
        permissionList: {
          types: ['api_common']
        },
        menuList: {
          parent_id: 0
        }
      }).then(response => {
        this.permissionList = response.data.permissionList
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
    },
    handleTreeCheckChange(item, val) {
      item.permissions.forEach(perm => {
        this.handlePermissionIdsChange(perm, val)
      })
      this.$set(this.dataForm, 'menu_ids', this.$refs.refMenuTree.getCheckedKeys())
    },
    handlePermissionIdsChange(item, val) {
      if (val) {
        if (this.dataForm.permission_ids.indexOf(item.id) === -1) {
          this.dataForm.permission_ids.push(item.id)
        }
      } else {
        if (this.dataForm.permission_ids.indexOf(item.id) >= 0) {
          this.dataForm.permission_ids.splice(
            this.dataForm.permission_ids.indexOf(item.id),
            1
          )
        }
      }
    }
  }
}
</script>

<style>
</style>
