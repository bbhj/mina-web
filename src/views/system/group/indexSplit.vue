<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="dataSearch" :inline="true" :model="listQuery.search">
        <el-input v-model="listQuery.search.title" :placeholder="$t('system.group.title')" class="filter-item" style="width: 200px;" @keyup.enter.native="handleFilter" />
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('common.search') }}</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('common.add') }}</el-button>
      </el-form>
    </div>

    <el-row>
      <el-col v-if="false">
        <el-table
          :key="tableKey"
          v-loading="listLoading"
          :data="list"
          border
          fit
          highlight-current-row
          class="list-table"
        >
          <el-table-column :label="$t('common.id')" align="center" width="65">
            <template slot-scope="scope">
              <span>{{ scope.row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('common.created_at')" width="140px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('system.group.title')">
            <template slot-scope="scope">
              <span>{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('system.group.slug')">
            <template slot-scope="scope">
              <span>{{ scope.row.slug }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('common.actions')" align="center" width="230" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button type="primary" @click="handleUpdate(scope.row)">{{ $t('common.edit') }}</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination-container">
          <el-pagination
            :current-page="listQuery.page"
            :page-sizes="[10,20,30,50]"
            :page-size="listQuery.limit"
            :total="meta?meta.total:0"
            layout="total, sizes, prev, pager, next, jumper"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
        <DialogForm ref="dialogForm" @modify="handleModify" />
      </el-col>
    </el-row>
    <el-col :span="12">
      <MfMultDrag
        v-model="list"
        v-loading="listLoading"
        :options="{ sort: false }"
      >
        <template slot-scope="scope">
          {{ scope.item.title }}
        </template>
        <template slot="actions" slot-scope="scope">
          <el-button v-if="false" :title="$t('system.group.roles')" type="text" @click="handleRoles(scope.item)">
            <SvgIcon icon-class="peoples" />
          </el-button>
          <el-button v-if="false" :title="$t('system.group.users')" type="text" @click="handleUsers(scope.item)">
            <SvgIcon icon-class="people" />
          </el-button>
          <el-button :title="scope.item.title" type="text" icon="el-icon-edit" @click="handleUpdate(scope.item)" />
          <el-button v-if="false" :title="scope.item.title" type="text" icon="el-icon-delete" @click="handleDelete(scope.item)" />
        </template>
      </MfMultDrag>
    </el-col>
    <el-col :span="12">
      <InnerForm ref="innerForm" @modify="handleModify" />
    </el-col>
  </div>
</template>

<script>
import waves from '@/directive/waves' // 水波纹指令

import { commonData } from '@/api/system/common'
import { fetchList } from '@/api/system/group'

import MfMultDrag from '@/components/MfMultDrag'
import InnerForm from './components/InnerForm.vue'
import DialogForm from './components/DialogForm.vue'

export default {
  name: 'GroupIndexSplit',
  directives: {
    waves
  },
  components: { DialogForm, MfMultDrag, InnerForm },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: [],
      meta: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        sort: '+id',
        search: {
          title: undefined
        }
      },
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }]
    }
  },
  created() {
    this.getList()
    this.$nextTick(() => {
      commonData({
        groupList: {}
      }).then(response => {
        this.groupList = response.data.groupList
      })
    })
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data
        this.meta = response.meta
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleImport() {
    },
    handleModify(idx, payload) {
      if (idx) {
        for (const item of this.list) {
          if (item.id === idx) {
            const index = this.list.indexOf(item)
            this.list.splice(index, 1, payload)
            break
          }
        }
      } else if (payload) {
        this.list.unshift(payload)
      } else {
        this.getList()
      }
    },
    handleCreate() {
      this.$refs.innerForm.handleCreate()
    },
    handleUpdate(row) {
      this.$refs.innerForm.handleUpdate(row)
    },
    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleRoles(row) {
      console.log('handleRoles')
    },
    handleUsers(row) {
      console.log('handleUsers')
    }
  }
}
</script>
