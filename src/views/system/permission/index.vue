<template>
  <div class="app-container">
    <div v-loading="filterLoading" class="filter-container">
      <el-form ref="dataSearch" :inline="true" :model="listQuery.search">
        <el-select v-model="listQuery.search.type" :placeholder="$t('system.permission.type')" class="filter-item" style="width: 200px;" clearable filterable>
          <el-option
            v-for="(item, key) in permissionTypeList"
            :key="key"
            :title="item.label"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-input v-model="listQuery.search.title" :placeholder="$t('system.permission.title')" class="filter-item" style="width: 200px;" clearable @keyup.enter.native="handleFilter" />
        <el-input v-model="listQuery.search.name" :placeholder="$t('system.permission.name')" class="filter-item" style="width: 200px;" clearable @keyup.enter.native="handleFilter" />
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('common.search') }}</el-button>
        <el-button type="primary" class="filter-item" style="margin-left: 10px;" icon="el-icon-edit" @click="handleCreate">{{ $t('common.add') }}</el-button>
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
      <el-table-column :label="$t('system.permission.title')">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.permission.http_method')">
        <template slot-scope="scope">
          <span v-for="(item, key) in scope.row.http_method" :key="key">
            {{ item }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.permission.http_path')">
        <template slot-scope="scope">
          <span>{{ scope.row.http_path }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.permission.name')">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
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
  </div>
</template>

<script>
import { throttle } from 'lodash'
import { mapState } from 'vuex'
import waves from '@/directive/waves' // 水波纹指令

import { fetchList } from '@/api/system/permission'

import DialogForm from './components/DialogForm.vue'

export default {
  name: 'PermissionTable',
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
      list: [],
      meta: null,
      filterLoading: true,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        sort: '+id',
        search: {
          title: undefined,
          name: undefined
        }
      },
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }]
    }
  },
  computed: {
    ...mapState('system', {
      permissionTypeList: state => state.permissionTypeList,
      getListLable: state => state.getListLable
    })
  },
  created() {
    this.getList()
    this.filterLoading = false
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
    handleFilter: throttle(function() {
      this.listQuery.page = 1
      this.getList()
    }, 1000),
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
    }
  }
}
</script>
