<template>
  <div class="detail-post-container">
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="rules"
      class="form-container"
      label-width="100px"
    >
      <sticky :class-name="'sub-navbar '+dataForm.status">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">{{ $t('common.confirm') }}</el-button>
      </sticky>
      <div class="detail-post-container-main">
        <el-form-item :label="$t('system.menu.parent_id')" prop="parent_id">
          <el-select v-model="dataForm.parent_id" class="filter-item" placeholder="Please select" clearable>
            <el-option v-for="item in menuListCal" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('system.menu.title')" prop="title">
          <el-input v-model="dataForm.title" />
        </el-form-item>
        <el-form-item :label="$t('system.menu.uri')" prop="uri">
          <el-input v-model="dataForm.uri" />
        </el-form-item>
        <el-form-item :label="$t('system.menu.role_ids')" prop="role_ids">
          <el-select v-model="dataForm.role_ids" class="filter-item" placeholder="Please select" multiple>
            <el-option v-for="item in roleList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('system.menu.permission')" prop="permission">
          <el-input v-model="dataForm.permission" />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'

import { commonData } from '@/api/system/common'
import { fetchItem, storeItem, updateItem } from '@/api/system/menu'

import Sticky from '@/components/Sticky' // 粘性header组件

import { validateByServer } from '@/views/mixins'

const defaultForm = {
  id: undefined,
  parent_id: undefined,
  sort_id: undefined,
  title: '',
  icon: '',
  uri: '',
  role_ids: [],
  permission: ''
}

export default {
  name: 'MenuDetail',
  components: { Sticky },
  mixins: [validateByServer],
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
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
      roleList: [],
      menuList: [],
      loading: false,
      dataForm: cloneDeep(defaultForm),
      rules: this.loadValidateByServer({
        title: [{ required: true, message: 'title is required', trigger: 'change' }],
        uri: [],
        permission: []
      })
    }
  },
  computed: {
    menuListCal: function() {
      return this.menuList.filter(item => {
        return item.value !== this.dataForm.id
      })
    }
  },
  created() {
    commonData({
      roleList: {},
      menuList: {}
    }).then(response => {
      this.roleList = response.data.roleList
      this.menuList = response.data.menuList
    })
    this.$nextTick(() => {
      if (this.isEdit) {
        const id = this.$route.params && this.$route.params.id
        this.fetchData(id)
      } else {
        this.dataForm = cloneDeep(defaultForm)
      }
    })
  },
  methods: {
    fetchData(id) {
      this.loading = true
      fetchItem(id).then(response => {
        this.dataForm = response.data
        this.loading = false
      }).catch(err => {
        console.log(err)
      })
    },
    submitForm() {
      this.resetValidateByServer()
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.loading = true
          const action = this.isEdit ? updateItem(this.dataForm) : storeItem(this.dataForm)
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
