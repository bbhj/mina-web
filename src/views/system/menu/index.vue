<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="dataSearch" :inline="true" :model="listQuery.search">
        <el-select v-model="listQuery.search.role_id" :placeholder="$t('system.menu.role_id')" class="filter-item" style="width: 200px;" clearable filterable>
          <el-option
            v-for="item in roleList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-input v-model="listQuery.search.title" :placeholder="$t('system.menu.title')" class="filter-item" style="width: 200px;" clearable @keyup.enter.native="handleFilter" />
        <el-input v-model="listQuery.search.name" :placeholder="$t('system.menu.name')" class="filter-item" style="width: 200px;" clearable @keyup.enter.native="handleFilter" />
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('common.search') }}</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('common.add') }}</el-button>
      </el-form>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      :load="loadChildren"
      lazy
      border
      row-key="id"
    >
      <el-table-column
        :label="$t('common.id')"
        prop="id"
        width="128"
      />
      <el-table-column
        :label="$t('common.created_at')"
        prop="created_at"
        width="120"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('system.menu.title')"
        prop="title"
      />
      <el-table-column
        :label="$t('system.menu.name')"
        prop="name"
      />
      <el-table-column
        :label="$t('system.menu.permissions')"
        prop="permissions"
      >
        <template slot-scope="scope">
          <el-tag
            v-for="(perm, permKey) in scope.row.permissions"
            :key="permKey"
          >
            {{ perm.title }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('system.menu.roles')"
        prop="roles"
      >
        <template slot-scope="scope">
          <el-tag
            v-for="(role, roleKey) in scope.row.roles"
            :key="roleKey"
          >
            {{ role.title }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('common.actions')"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
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
  </div>
</template>

<script>
import { cloneDeep, assign } from 'lodash'
import waves from '@/directive/waves' // 水波纹指令
import { fetchList } from '@/api/system/menu'
import { commonData } from '@/api/system/common'

import DialogForm from './components/DialogForm.vue'

export default {
  name: 'MenuIndex',
  directives: {
    waves
  },
  components: { DialogForm },
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
      tableKey: 'menu-list',
      roleList: [],
      list: [],
      meta: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        sort: '+id',
        search: {
          role_id: undefined,
          title: undefined,
          name: undefined
        }
      },
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }]
    }
  },
  created() {
    commonData({
      roleList: {}
    }).then(response => {
      this.roleList = response.data.roleList
    })
    this.$nextTick(() => {
      this.getList()
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
    loadChildren(tree, treeNode, resolve) {
      fetchList(assign(cloneDeep(this.listQuery), { search: { onlyChildren: true, parent_id: tree.id }})).then(response => {
        resolve(response.data)
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
      }
      this.getList()
    },
    handleCreate() {
      this.$refs.dialogForm.handleCreate()
    },
    handleUpdate(row) {
      this.$refs.dialogForm.handleUpdate(row)
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
    }
  }
}
</script>
