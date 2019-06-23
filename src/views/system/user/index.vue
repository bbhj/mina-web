<template>
  <div class="app-container">
    <el-row>
      <el-col :span="4">
        <el-card :body-style="{ padding: '0px', overflow: 'auto' }">
          <div slot="header" class="clearfix">
            <span>组织列表</span>
            <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-refresh" @click="loadRelData" />
            <el-button style="float: right; padding: 3px 0" type="text" @click="handleClickGroupTree({ id: undefined })">{{ $t('common.reset') }}</el-button>
          </div>
          <el-tree
            ref="groupTree"
            :data="groupTreeList"
            :props="{
              children: 'children',
              label: 'title'
            }"
            :highlight-current="true"
            :expand-on-click-node="false"
            :render-content="renderGroupNode"
            node-key="value"
            default-expand-all
            @node-click="handleClickGroupTree"
          />
        </el-card>
      </el-col>
      <el-col :span="20">
        <div class="filter-container">
          <el-form ref="dataSearch" :inline="true" :model="listQuery.search">
            <el-input v-model="listQuery.search.name" :placeholder="$t('system.user.name')" class="filter-item" style="width: 200px;" clearable @keyup.enter.native="handleFilter" />
            <el-input v-model="listQuery.search.username" :placeholder="$t('system.user.username')" class="filter-item" style="width: 200px;" clearable @keyup.enter.native="handleFilter" />
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('common.search') }}</el-button>
            <el-button v-permission="['system.user.store']" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('common.add') }}</el-button>
          </el-form>
        </div>

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
          <el-table-column :label="$t('system.user.name')">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('system.user.username')">
            <template slot-scope="scope">
              <span>{{ scope.row.username }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('system.user.roles')">
            <template slot-scope="scope">
              <span v-for="item in scope.row.roles" :key="item.id">
                {{ item.title }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="$hasPerm(['system.user.update'])"
            :label="$t('common.actions')"
            align="center"
            width="230"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button v-permission="['system.user.update']" type="primary" @click="handleUpdate(scope.row)">{{ $t('common.edit') }}</el-button>
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
      </el-col>
    </el-row>
    <DialogForm ref="dialogForm" @modify="handleModify" />
  </div>
</template>

<script>
import waves from '@/directive/waves' // 水波纹指令

import { fetchList } from '@/api/system/user'
import { commonData } from '@/api/system/common'

import DialogForm from './components/DialogForm.vue'

export default {
  name: 'UserIndex',
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
      tableKey: 0,
      groupTreeList: [],
      list: [],
      meta: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        sort: '+id',
        search: {
          group_id: undefined,
          name: undefined,
          username: undefined
        }
      },
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }]
    }
  },
  created() {
    this.getList()
    this.$nextTick(() => {
      this.loadRelData()
    })
  },
  methods: {
    loadRelData() {
      this.groupTreeList = []
      commonData({
        groupTreeList: {}
      }).then(response => {
        this.groupTreeList = response.data.groupTreeList
      })
    },
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
      } else {
        this.list.unshift(payload)
      }
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
    },
    handleClickGroupTree(node) {
      this.listQuery.search.group_id = node.id
      if (node.id === undefined) {
        this.$refs.groupTree.setCurrentKey(null)
      }
      this.getList()
    },
    renderGroupNode(h, { node, data, store }) {
      return (
        <span class='custom-tree-node'>
          <span>{node.label}</span>
        </span>
      )
    }
  }
}
</script>

<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
