<template>
  <div class="createPost-container">
    <el-row>
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
        <el-form-item :label="$t('system.permission.title')" prop="title">
          <el-input v-model="dataForm.title" />
        </el-form-item>
        <el-form-item :label="$t('system.permission.slug')" prop="slug">
          <el-input v-model="dataForm.slug" />
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
    </el-row>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import { fetchItem, storeItem, updateItem } from '@/api/system/permission'

import Sticky from '@/components/Sticky' // 粘性header组件

import { validateByServer } from '@/views/mixins'

const httpMethods = [
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' },
  { label: 'PUT', value: 'PUT' },
  { label: 'DELETE', value: 'DELETE' }
]

const defaultForm = {
  id: undefined,
  title: '',
  slug: '',
  http_method: [],
  http_path: ''
}

export default {
  name: 'PermissionDetail',
  components: { Sticky },
  mixins: [validateByServer],
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(null)
      } else {
        callback()
      }
    }
    return {
      dataForm: cloneDeep(defaultForm),
      loading: false,
      rules: this.loadValidateByServer({
        title: [{ validator: validateRequire }]
      }),
      httpMethods
    }
  },
  computed: {
    contentShortLength() {
      return this.dataForm.content_short.length
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      this.dataForm = cloneDeep(defaultForm)
    }
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
              this.loading = false
            })
            .catch(e => {
              this.emitValidateByServer(this.$refs.dataForm, e)
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
