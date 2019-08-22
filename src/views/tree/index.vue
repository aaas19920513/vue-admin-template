<template>
  <div class="app-container">
    <el-row>
      <el-col :span="4">
        <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;" />
        <el-tree
          ref="tree"
          :data="categoryData"
          :props="defaultProps"
          :filter-node-method="filterNode"
          class="filter-tree"
          default-expand-all
          @node-click="handleNodeClick"
        />
      </el-col>

      <el-col :span="18" :offset="1">
        <div class="filter-container">
          <el-input v-model="listQuery.name" placeholder="Name" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
          <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" :disabled="listQuery.api==null" @click="handleCreate">
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
          :data="caseList"
          fit
          highlight-current-row
          style="width: 100%;"
          show-overflow-tooltip
          :row-class-name="tableRowClassName"
          @selection-change="handleSelectionChange"
          @current-change="getCurrentRow"
          @cell-dblclick="handleEdit"
          @cell-mouse-leave="handleMouseLeave"
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
              <div v-if="!scope.row.editing">
                <span>{{ scope.row.name }}</span>
              </div>
              <div v-else>
                <el-input v-model="scope.row.name" placeholder="请输入用例名字" />
              </div>
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
          <el-table-column
            label="操作"
          >
            <template slot-scope="scope">
              <div class="operate-groups">
                <el-button type="primary" size="mini" icon="el-icon-edit-outline">
                  <router-link :to="{name:'StepDetail', params:{case:scope.row.id, api:scope.row.api, caseName:scope.row.name }}">详情</router-link>
                </el-button>
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-takeaway-box"
                  @click="handleCopy(scope.row.id)"
                >
                  复制
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row>
      <el-col :offset="6">
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getCaseList" />
      </el-col>
    </el-row>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="name" prop="name" placeholder="请输入用例名">
          <el-input v-model="temp.name" />
        </el-form-item>

        <el-form-item label="runFlag">
          <el-select v-model="temp.runFlag" class="filter-item" placeholder="Please select">
            <el-option v-for="item in runOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="addCase(temp)">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCategory } from '@/api/category'
import { getCase, createCase, deleteCase, updateCase, copyCase } from '@/api/case'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'
import waves from '@/directive/waves'
// import bus from '@/store/bus'

export default {
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      selectionList: [],
      filterText: '',
      categoryData: null,
      caseList: [],
      tableKey: 0,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: '',
        type: '',
        sort: '+id',
        category: ''
      },
      temp: {
        id: undefined,
        api: '',
        name: '',
        runFlag: 1,
        create_user: '',
        update_user: '',
        create_time: '',
        update_time: '',
        category: '',
        editing: false
      },
      caseCategory: '',
      // dialog配置
      dialogFormVisible: false,
      dialogStatus: '',
      runOptions: [
        { value: 1, label: '运行' },
        { value: 0, label: '不运行' }
      ],
      textMap: {
        create: 'Create'
      },
      pvData: [],
      rules: {
        name: [{ required: true, message: '请输入用例名', trigger: 'blur' }],
        runFlag: [{ required: true, message: '请确定运行状态', trigger: 'change' }]
      }
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
    this.getCategoryData()
    this.getCaseList()
  },
  methods: {
    jumpAddStep() {
      // this.$router.push({ path: '/step/add' })
      // path配query, name配params
      this.$router.push({ name: 'addStep', params: { api: this.listQuery.api }})
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getCaseList()
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleNodeClick(data) {
      this.listQuery.page = 1
      // 如果有category代表是利用Api_id查询
      if (data.id && data.category) {
        this.listQuery.category = null
        this.listQuery.api = data.id
        this.caseCategory = data.category
        this.getCaseList()
        // this.$root.Bus.$emit('InitStepData', data)
        // bus.$emit('InitStepData', data)
      } else {
        this.listQuery.category = data.id
        this.listQuery.api = null
        this.getCaseList()
      }
    },
    getCategoryData() {
      getCategory().then(res => {
        this.categoryData = res.data
      })
    },
    getCaseList: function() {
      console.log('获取后台数据')
      this.listLoading = true
      getCase(this.listQuery).then(res => {
        this.total = res.count
        const items = res.data
        this.caseList = items.map(v => {
          this.$set(v, 'editing', false) // https://vuejs.org/v2/guide/reactivity.html
          v.originalName = v.name //  will be used when user click the cancel botton
          return v
        })
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        runFlag: '',
        api: this.listQuery.api,
        category: this.caseCategory
      }
    },
    getCurrentRow(row, oldRow) {
      console.log(row)
      console.log(row.index)
    },
    handleSelectionChange(val) {
      this.selectionList = val
      console.log(this.selectionList)
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCopy(id) {
      copyCase(id).then(() => {
        this.getCaseList()
      })
    },
    // 把每一行的索引放进row
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex
    },
    handleDelete($index, row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const list = []
        for (const select of this.selectionList) {
          this.caseList.splice(select.index, 1)
          list.push(select.id)
        }
        // 清除所选择项
        this.$refs.multipleTable.clearSelection()
        deleteCase({ 'ids': String(list) }).then(() => {
          // 删除成功后回调
          this.getCaseList()
        })
      }).catch((err) => {
        this.$message({
          type: 'error',
          message: err
        })
      })
    },
    addCase(data) {
      this.temp.api = parseInt(this.listQuery.api)
      data.runFlag = 1
      data.create_user = this.username
      data.update_user = '-'
      createCase(data).then(() => {
        this.getCaseList()
      })
      this.dialogFormVisible = false
    },
    handleEdit(row, column, event, cell) {
      this.$set(this.caseList[row.index], 'editing', true)
    },
    handleMouseLeave(row, column, cell, event) {
      this.$set(this.caseList[row.index], 'editing', false)
      if (row.name !== row.originalName) {
        row.update_user = this.username
        updateCase(row.id, row).then(() => {
          row.originalName = row.name
          this.$message({
            message: 'update case success',
            type: 'success'
          })
        })
      }
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
