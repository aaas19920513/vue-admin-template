<template>
  <div class="app-container">
    <el-row>
      <el-col :span="18" :offset="1">
        <div class="filter-container">
          <el-input v-model="listQuery.name" placeholder="Name" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
          <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
            添加
          </el-button>
          <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete" :disabled="selectionList.length===0" @click="handleDelete">
            删除
          </el-button>
        </div>

        <el-table
          ref="multipleTable"
          :key="tableKey"
          v-loading="listLoading"
          :data="tableList"
          fit
          highlight-current-row
          style="width: 100%;"
          show-overflow-tooltip
          :row-class-name="tableRowClassName"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="40"
          />
          <el-table-column
            align="center"
            label="用例名"
            width="280"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="创建人"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.create_user }}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="更新人"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.update_user }}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" prop="created_at" label="创建时间" width="200">
            <template slot-scope="scope">
              <span>{{ scope.row.create_time }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row>
      <el-col :offset="2">
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
      </el-col>
    </el-row>

    <el-dialog title="case选择器" :visible.sync="dialogVisible" width="60%">
      <div class="block">
        <el-cascader
          multiple
          :options="caseOptions"
          :props="Props"
          clearable></el-cascader>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { caseSelector } from '@/api/category'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'
import waves from '@/directive/waves'
import { fetchSuiteByPv, updateSuite, fetchSuite } from '@/api/testsuite'
// import bus from '@/store/bus'

export default {
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      Props: { multiple: true },
      caseOptions: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      suite: '',
      suiteId: '',
      suiteCase: [],
      selectionList: [],
      filterText: '',
      categoryData: null,
      tableList: [],
      total: 0,
      tableKey: 0,
      listLoading: true,
      dialogVisible: false,
      listQuery: {
        page: 1,
        limit: 20,
        name: '',
        type: '',
        sort: '+id',
        category: ''
      },
      caseCategory: ''
    }
  },
  computed: {
    ...mapGetters([
      'username'
    ])
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getSuiteIdByRouter()
    this.getList()
    this.getSuite()
    this.getCategoryData()
  },
  methods: {
    // 获取路由跳转过来的suiteId
    getSuiteIdByRouter() {
      if (JSON.stringify(this.$route.params) !== '{}') {
        this.suiteId = (this.$route.params['suiteId'])
        localStorage.setItem('suiteId', JSON.stringify(this.$route.params['suiteId']))
      } else {
        this.suiteId = JSON.parse(localStorage.getItem('suiteId'))
      }
    },
    getCategoryData() {
      caseSelector().then(res => {
        this.caseOptions = res.data
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    getSuite() {
      fetchSuite(this.suiteId).then(res => {
        this.suiteCase = res.data.case
        this.suite = res.data
      })
    },
    getList() {
      this.listLoading = true
      fetchSuiteByPv(this.suiteId).then(res => {
        this.total = res.data.case.length
        this.tableList = res.data.case
      })
      setTimeout(() => {
        this.listLoading = false
      }, 0.5 * 1000)
    },
    handleCreate() {
      this.dialogVisible = true
    },
    handleDelete($index, row) {
      this.$confirm('是否继续删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        for (const select of this.selectionList) {
          this.tableList.splice(select.index, 1)
          this.suiteCase.splice(select.index, 1)
        }
        // 清除所选择项
        this.$refs.multipleTable.clearSelection()
        this.suite['case'] = this.suiteCase
        updateSuite(this.suiteId, this.suite).then(() => {
          // 删除成功后回调
          this.getList()
        })
      }).catch((err) => {
        this.$message({
          type: 'error',
          message: err
        })
      })
    },
    handleSelectionChange(val) {
      this.selectionList = val
    },
    // 把每一行的索引放进row
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex
    }
  }
}
</script>

<style scoped lang="scss">
  .operate-groups {
    display: flex;
    justify-content: flex-start;
  }
</style>
