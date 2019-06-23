<template>
  <div class="detail-post-container">
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="rules"
      class="form-container"
      label-width="100px"
    >
      <sticky v-loading="loading" :class-name="'sub-navbar '+dataForm.status">
        <el-button type="success" @click="resetTemp">{{ $t('common.reset') }}</el-button>
        <el-button type="success" @click="submitForm">{{ $t('common.confirm') }}</el-button>
      </sticky>
      <div class="detail-post-container-main">
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
          <el-select v-model="dataForm.role_ids" class="filter-item" placeholder="Please select" multiple>
            <el-option v-for="item in roleList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('system.group.user_ids')" prop="user_ids">
          <el-select v-model="dataForm.user_ids" class="filter-item" placeholder="Please select" multiple>
            <el-option v-for="item in userList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('system.group.leader_ids')" prop="leader_ids">
          <el-select v-model="dataForm.leader_ids" class="filter-item" placeholder="Please select" multiple>
            <el-option v-for="item in leaderListCal" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'

import { commonData } from '@/api/system/common'
import { fetchItem, storeItem, updateItem } from '@/api/system/group'

import Sticky from '@/components/Sticky' // 粘性header组件

import { validateByServer } from '@/views/mixins'

const defaultForm = {
  id: undefined,
  parent_id: undefined,
  title: '',
  slug: '',
  role_ids: [],
  user_ids: [],
  leader_ids: []
}

export default {
  name: 'InnerForm',
  components: { Sticky },
  mixins: [validateByServer],
  props: {},
  data() {
    // const validateRequire = (rule, value, callback) => {
    //   if (value === '') {
    //     this.$message({
    //       message: rule.field + '为必传项',
    //       type: 'error'
    //     })
    //     callback(null)
    //   } else {
    //     callback()
    //   }
    // }
    return {
      userList: [],
      groupList: [],
      roleList: [],
      loading: false,
      dataForm: cloneDeep(defaultForm),
      rules: this.loadValidateByServer({
        title: [{ required: true, message: 'title is required', trigger: 'change' }],
        slug: [{ required: true, message: 'slug is required', trigger: 'change' }]
      })
    }
  },
  computed: {
    status: function() {
      if (this.dataForm && this.dataForm.id) {
        return 'update'
      } else {
        return 'store'
      }
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
  created() {
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
    this.$nextTick(() => {
      if (this.status === 'update') {
        const id = this.$route.params && this.$route.params.id
        this.fetchData(id)
      } else {
        this.dataForm = cloneDeep(defaultForm)
      }
    })
  },
  methods: {
    resetTemp() {
      this.dataForm = cloneDeep(defaultForm)
      this.$nextTick(() => {
        this.resetValidateByServer()
        this.$refs.dataForm.clearValidate()
      })
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
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate()
      })
    },
    handleUpdate(row) {
      this.dataForm = cloneDeep(row) // copy obj
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate()
      })
    },
    submitForm() {
      this.resetValidateByServer()
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.loading = true
          const action = (this.status === 'update') ? updateItem(this.dataForm) : storeItem(this.dataForm)
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
              this.resetTemp()
              this.emitModify()
            })
            .catch(e => {
              this.emitValidateByServer(this.$refs.dataForm, e)
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>
