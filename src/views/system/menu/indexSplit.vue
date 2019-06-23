<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.search.role_id"
        :placeholder="$t('system.menu.role_id')"
        class="filter-item"
        style="width: 200px;"
        clearable
        @keyup.enter.native="handleFilter"
      >
        <el-option
          v-for="item in roleList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-input v-model="listQuery.search.title" :placeholder="$t('system.menu.title')" class="filter-item" style="width: 200px;" clearable @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('common.search') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('common.add') }}</el-button>
    </div>

    <el-row>
      <el-col v-if="false" :span="12">
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
          <el-table-column :label="$t('system.menu.title')">
            <template slot-scope="scope">
              <span>{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('system.menu.uri')">
            <template slot-scope="scope">
              <span>{{ scope.row.uri }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('system.menu.roles')">
            <template slot-scope="scope">
              <label v-for="role in scope.row.roles" :key="role.id">{{ role.title }} </label>
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
      </el-col>
      <el-col :span="12">
        <MfMultDrag
          v-model="list"
          v-loading="listLoading"
          :options="{ sort: true }"
        >
          <template slot-scope="scope">
            <SvgIcon v-if="scope.item.icon" :icon-class="scope.item.icon" />
            <strong>{{ scope.item.title }}</strong>
            <a href="javascript:;" class="nmd-nodrag">{{ scope.item.uri }}</a>
            <span>{{ scope.item.name }}</span>
            <template v-if="scope.item.roles && scope.item.roles.length > 0">
              [<span v-for="(role, key) in scope.item.roles" :key="key">
                {{ role.title }}
              </span>]
            </template>
          </template>
          <template slot="actions" slot-scope="scope">
            <el-button :title="scope.item.title" type="text" icon="el-icon-edit" @click="handleUpdate(scope.item)" />
            <el-button v-if="false" :title="scope.item.title" type="text" icon="el-icon-delete" @click="handleUpdate(scope.item)" />
          </template>
        </MfMultDrag>
      </el-col>
      <el-col :span="12">
        <InnerForm ref="innerForm" @modify="handleModify" />
      </el-col>
    </el-row>

    <DialogForm v-if="false" ref="dialog" @modify="handleModify" />
  </div>
</template>

<script>
import waves from '@/directive/waves' // 水波纹指令
import { fetchList } from '@/api/system/menu'
import { commonData } from '@/api/system/common'

import MfMultDrag from '@/components/MfMultDrag'

import InnerForm from './components/InnerForm.vue'
import DialogForm from './components/DialogForm.vue'

export default {
  name: 'MenuIndexSplit',
  directives: {
    waves
  },
  components: { MfMultDrag, InnerForm, DialogForm },
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
          title: undefined,
          parent_id: 0,
          role_id: undefined
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
