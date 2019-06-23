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
      <el-form-item :label="$t('system.config.title')" prop="title">
        <el-input v-model="dataForm.title" />
      </el-form-item>
      <el-form-item :label="$t('system.config.describe')" prop="describe">
        <el-input v-model="dataForm.describe" />
      </el-form-item>
      <el-form-item :label="$t('system.config.key')" prop="key">
        <el-input v-model="dataForm.key" />
      </el-form-item>
      <el-form-item :label="$t('system.config.value')" prop="value">
        <el-input v-model="dataForm.value" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { cloneDeep, get } from 'lodash'

import { commonData } from '@/api/system/common'
import { fetchItem, storeItem, updateItem } from '@/api/system/config'

import Sticky from '@/components/Sticky' // 粘性header组件

import { validateByServer } from '@/views/mixins'

const defaultForm = {
  id: undefined,
  title: '',
  describe: '',
  type: '',
  key: '',
  value: ''
}

export default {
  name: 'ConfigDetail',
  components: { Sticky },
  mixins: [validateByServer],
  props: {},
  data() {
    return {
      roleList: [],
      dataForm: cloneDeep(defaultForm),
      myLoading: false,
      myStatus: '', // create|edit
      rules: this.loadValidateByServer({
        title: [{ required: true, message: 'title is required', trigger: 'change' }],
        slug: [{ required: true, message: 'slug is required', trigger: 'change' }]
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
