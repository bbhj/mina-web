<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.search.user_id"
        :placeholder="$t('system.operationLog.user_id')"
        class="filter-item"
        style="width: 200px;"
        clearable
        @keyup.enter.native="handleFilter"
      >
        <el-option
          v-for="item in userList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-input v-model="listQuery.search.path" :placeholder="$t('system.operationLog.path')" class="filter-item" style="width: 200px;" clearable @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('common.search') }}</el-button>
      <el-button v-if="false" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('common.add') }}</el-button>
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
      <el-table-column :label="$t('system.operationLog.user')">
        <template slot-scope="scope">
          <span>{{ scope.row.user.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.operationLog.path')">
        <template slot-scope="scope">
          <span>{{ scope.row.path }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.operationLog.method')">
        <template slot-scope="scope">
          <span>{{ scope.row.method }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.operationLog.ip')">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.operationLog.input')">
        <template slot-scope="scope">
          <span>{{ scope.row.input }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="false" :label="$t('common.actions')" align="center" width="230" class-name="small-padding fixed-width">
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

  </div>
</template>

<script>
import waves from '@/directive/waves' // 水波纹指令
import { fetchList } from '@/api/system/operationLog'
import { commonData } from '@/api/system/common'

export default {
  name: 'OperationLogList',
  directives: {
    waves
  },
  components: {},
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
      tableKey: 'operationLog-list',
      userList: [],
      list: [],
      meta: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        sort: '+id',
        search: {
          title: undefined,
          parent_id: 0,
          user_id: undefined
        }
      },
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }]
    }
  },
  created() {
    commonData({
      userList: {}
    }).then(response => {
      this.userList = response.data.userList
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
    }
  }
}
</script>
