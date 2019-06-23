<template>
  <div class="dialog-container">
    <el-dialog :title="title" :visible.sync="myVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        label-width="100px"
      >
        <el-form-item :label="$t('system.group.parent_id')" prop="parent_id">
          <el-select v-model="dataForm.parent_id" class="filter-item" placeholder="Please select" clearable>
            <el-option v-for="item in groupListCal" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('system.group.title')" prop="title">
          <el-input v-model="dataForm.title" />
        </el-form-item>
        <el-form-item :label="$t('system.group.slug')" prop="slug">
          <el-input v-model="dataForm.slug" />
        </el-form-item>
        <el-form-item :label="$t('system.group.role_ids')" prop="role_ids">
          <MfTag
            v-model="dataForm.role_ids"
            :options="roleList"
            type="select"
          />
        </el-form-item>
        <el-form-item :label="$t('system.group.user_ids')" prop="user_ids">
          <MfTag
            v-model="dataForm.user_ids"
            :options="userList"
            type="select"
          />
        </el-form-item>
        <el-form-item :label="$t('system.group.leader_ids')" prop="leader_ids">
          <MfTag
            v-model="dataForm.leader_ids"
            :options="leaderListCal"
            type="select"
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
import { storeItem, updateItem } from '@/api/system/group'

import MfTag from '@/components/MfTag'

import { validateByServer } from '@/views/mixins'

const defaultForm = {
  id: undefined,
  title: '',
  slug: '',
  role_ids: [],
  user_ids: [],
  leader_ids: []
}

export default {
  name: 'DialogForm',
  components: { MfTag },
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
      userList: [],
      groupList: [],
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
    },
    groupListCal: function() {
      // return omit(this.groupList, this.dataForm.id)
      return this.groupList.filter(item => {
        return item.value !== this.dataForm.id
      })
    },
    leaderListCal: function() {
      return this.userList.filter(item => {
        return this.dataForm.user_ids.indexOf(item.value) !== -1
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
        userList: {},
        roleList: {},
        groupList: {
          parent_id: 0
          // format: 'select'
        }
      }).then(response => {
        this.userList = response.data.userList
        this.roleList = response.data.roleList
        this.groupList = response.data.groupList
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
