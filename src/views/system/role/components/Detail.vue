<template>
  <div class="createPost-container">
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="rules"
      class="form-container"
      label-width="100px"
    >
      <sticky :class-name="'sub-navbar '+dataForm.status">
        <el-button v-loading="myLoading" style="margin-left: 10px;" type="success" @click="submitForm">{{ $t('common.confirm') }}</el-button>
      </sticky>
      <el-form-item :label="$t('system.role.name')" prop="name">
        <el-input v-model="dataForm.name" />
      </el-form-item>
      <el-form-item :label="$t('system.role.username')" prop="username">
        <el-input v-model="dataForm.username" />
      </el-form-item>
      <el-form-item :label="$t('system.role.password')" prop="password">
        <el-input v-model="dataForm.password" />
      </el-form-item>
      <el-form-item :label="$t('system.role.role_id')" prop="role_id">
        <el-select v-model="dataForm.role_id" class="filter-item" placeholder="Please select">
          <el-option v-for="item in roleList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('system.role.profile.avatar')" prop="profile.avatar">
        <MfAvatar v-model="dataForm.profile.avatar" />
      </el-form-item>
      <el-form-item :label="$t('system.role.profile.name_en')" prop="profile.name_en">
        <el-input v-model="dataForm.profile.name_en" />
      </el-form-item>
      <el-form-item :label="$t('system.role.profile.nickname')" prop="profile.nickname">
        <el-input v-model="dataForm.profile.nickname" />
      </el-form-item>
      <el-form-item :label="$t('system.role.profile.phone')" prop="profile.phone">
        <el-input v-model="dataForm.profile.phone" />
      </el-form-item>
      <el-form-item :label="$t('system.role.profile.email_wechat')" prop="profile.email_wechat">
        <el-input v-model="dataForm.profile.email_wechat" />
      </el-form-item>
      <el-form-item :label="$t('system.role.profile.job_title')" prop="profile.job_title">
        <el-input v-model="dataForm.profile.job_title" />
      </el-form-item>
      <el-form-item :label="$t('system.role.profile.remark')" prop="profile.remark">
        <el-input v-model="dataForm.profile.remark" type="textarea" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { cloneDeep, get } from 'lodash'

import { commonData } from '@/api/system/common'
import { fetchItem, storeItem, updateItem } from '@/api/system/role'

import Sticky from '@/components/Sticky' // 粘性header组件
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
  name: 'RoleDetail',
  components: { Sticky, MfAvatar },
  mixins: [validateByServer],
  props: {},
  data() {
    return {
      roleList: [],
      dataForm: cloneDeep(defaultForm),
      myLoading: false,
      myStatus: '', // create|edit
      rules: this.loadValidateByServer({
        name: [{ required: true, message: 'name is required', trigger: 'change' }],
        contact: []
      })
    }
  },
  computed: {
  },
  created() {
    const id = get(this.$route, 'params.id', undefined)
    if (id) {
      this.myStatus = 'edit'
      this.fetchData(id)
    } else {
      this.myStatus = 'create'
      this.dataForm = cloneDeep(defaultForm)
    }
    this.$nextTick(() => {
      commonData({
        roleList: {}
      }).then(response => {
        this.roleList = response.data.roleList
      })
    })
  },
  methods: {
    fetchData(id) {
      this.myLoading = true
      fetchItem(id).then(response => {
        this.dataForm = response.data
        this.myLoading = false
      }).catch(err => {
        console.log(err)
      })
    },
    submitForm() {
      this.resetValidateByServer()
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.myLoading = true
          const action = this.myStatus === 'edit' ? updateItem(this.dataForm) : storeItem(this.dataForm)
          action
            .then(response => {
              if (response.data.result === 'error') {
                this.$alert(response.data.message, '', {
                  confirmButtonText: '确定'
                })
              } else {
                this.$notify({
                  title: '成功',
                  message: '保存成功',
                  type: 'success',
                  duration: 2000
                })
              }
            })
            .catch(e => {
              this.emitValidateByServer(this.$refs.dataForm, e)
            })
            .finally(() => {
              this.myLoading = false
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>
