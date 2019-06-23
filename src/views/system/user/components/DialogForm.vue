<template>
  <div class="dialog-container">
    <el-dialog :title="title" :visible.sync="myVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        label-width="100px"
      >
        <el-form-item :label="$t('system.user.name')" prop="name">
          <el-input v-model="dataForm.name" />
        </el-form-item>
        <el-form-item :label="$t('system.user.username')" prop="username">
          <el-input v-model="dataForm.username" />
        </el-form-item>
        <el-form-item :label="$t('system.user.password')" prop="password">
          <el-input v-model="dataForm.password" />
        </el-form-item>
        <el-form-item :label="$t('system.user.role_id')" prop="role_id">
          <el-select v-model="dataForm.role_id" class="filter-item" placeholder="Please select">
            <el-option v-for="item in roleList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('system.user.profile.avatar')" prop="profile.avatar">
          <MfAvatar v-model="dataForm.profile.avatar" />
        </el-form-item>
        <el-form-item :label="$t('system.user.profile.name_en')" prop="profile.name_en">
          <el-input v-model="dataForm.profile.name_en" />
        </el-form-item>
        <el-form-item :label="$t('system.user.profile.nickname')" prop="profile.nickname">
          <el-input v-model="dataForm.profile.nickname" />
        </el-form-item>
        <el-form-item :label="$t('system.user.profile.phone')" prop="profile.phone">
          <el-input v-model="dataForm.profile.phone" />
        </el-form-item>
        <el-form-item :label="$t('system.user.profile.email_wechat')" prop="profile.email_wechat">
          <el-input v-model="dataForm.profile.email_wechat" />
        </el-form-item>
        <el-form-item :label="$t('system.user.profile.job_title')" prop="profile.job_title">
          <el-input v-model="dataForm.profile.job_title" />
        </el-form-item>
        <el-form-item :label="$t('system.user.profile.remark')" prop="profile.remark">
          <el-input v-model="dataForm.profile.remark" type="textarea" />
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
import { storeItem, updateItem } from '@/api/system/user'

import MfAvatar from '@/components/MfAvatar'

import { validateByServer } from '@/views/mixins'

const defaultForm = {
  id: undefined,
  name: '',
  username: '',
  password: '',
  role_id: undefined,
  profile: {
    name_en: '',
    nickname: '',
    phone: '',
    email_wechat: '',
    avatar: {
      id: undefined,
      file_url: ''
    },
    job_title: '',
    remark: ''
  }
}

export default {
  name: 'DialogForm',
  components: { MfAvatar },
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
