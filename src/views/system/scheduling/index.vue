<template>
  <div class="app-container">
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;min-height:300px;"
    >
      <el-table-column :label="$t('common.id')" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.scheduling.task')">
        <template slot-scope="scope">
          <el-tag type="warning">
            {{ scope.row.task.name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.scheduling.run_at')">
        <template slot-scope="scope">
          <el-tag type="success">
            {{ scope.row.expression }}
          </el-tag>
          <span>{{ scope.row.readable }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.scheduling.nextRunDate')">
        <template slot-scope="scope">
          <span>{{ scope.row.nextRunDate }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.scheduling.description')">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" @click="handleRun(scope.$index + 1)">{{ $t('system.scheduling.run') }}</el-button>
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

    <ConsoleEditor v-model="output" />

  </div>
</template>

<script>
import waves from '@/directive/waves' // 水波纹指令
import { fetchList, runItem } from '@/api/system/scheduling'

import ConsoleEditor from '@/components/ConsoleEditor'

export default {
  name: 'SchedulingList',
  directives: {
    waves
  },
  components: { ConsoleEditor },
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
      tableKey: 'scheduling-list',
      list: [],
      meta: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        sort: '+id',
        search: {}
      },
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      output: ''
    }
  },
  created() {
    this.getList()
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
    handleRun(id) {
      runItem(id).then((response) => {
        this.output = response.data
        this.$notify({
          title: '成功',
          message: '运行成功',
          type: 'success',
          duration: 2000
        })
      }).catch(e => {
        console.log(e)
      })
    }
  }
}
</script>
