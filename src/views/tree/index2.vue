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

      <el-col :span="16" :offset="2">
        <div class="filter-container">
          <el-input v-model="listQuery.name" placeholder="Name" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
          <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" :disabled="listQuery.api==null" @click="handleCreate">
            添加
          </el-button>
          <el-button class="filter-item" style="margin-left: 10px;" type="warning" icon="el-icon-edit" :disabled="selectionList.length===0" @click="handleDelete">
            删除
          </el-button>
        </div>

        <el-table
          :key="tableKey"
          v-loading="listLoading"
          :data="caseList"
          fit
          highlight-current-row
          style="width: 100%;"
          @row-click="row.edit=!row.edit"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column min-width="120px" label="Name">
            <template slot-scope="scope">
              <template v-if="scope.row.edit">
                <el-input v-model="scope.row.name" class="edit-input" size="small" />
                <el-button
                  class="cancel-btn"
                  size="small"
                  icon="el-icon-refresh"
                  type="warning"
                  @click="cancelEdit(row)"
                >
                  cancel
                </el-button>
              </template>
              <span v-else>{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建人" width="110" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.create_user }} </span>
            </template>
          </el-table-column>
          <el-table-column label="修改人" width="110" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.update_user }} </span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="created_at" label="创建时间" width="200">
            <template slot-scope="scope">
              <i class="el-icon-time" />
              <span>{{ scope.row.create_time }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <div>
                <!--<el-button type="primary" size="mini" icon="el-icon-edit">-->
                  <!--<router-link :to="{name:'getStep', params:{case:scope.row.id, api:scope.row.api}}">详情</router-link>-->
                <!--</el-button>-->
                <el-button
                  v-if="scope.row.edit"
                  type="success"
                  size="mini"
                  icon="el-icon-circle-check-outline"
                  @click="caseEdit(row)"
                >
                  确认
                </el-button>
                <!--<el-button-->
                  <!--type="primary"-->
                  <!--size="mini"-->
                  <!--icon="el-icon-document-copy"-->
                  <!--@click="handleCopy(row.id)"-->
                <!--&gt;-->
                  <!--复制-->
                <!--</el-button>-->
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
import waves from '@/directive/waves' //
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
        name: 1,
        runFlag: '',
        create_user: '',
        update_user: '',
        create_time: '',
        update_time: '',
        category: ''
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
    handleFilter() {},
    handleDelete() {
      const list = []
      for (const select of this.selectionList) {
        list.push(select.id)
      }
      deleteCase({ 'ids': String(list) })
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
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
      this.listLoading = true
      getCase(this.listQuery).then(res => {
        this.total = res.count
        const items = res.data
        this.caseList = items
        // Just to simulate the time of the request
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
      copyCase(id)
    },
    addCase(data) {
      this.temp.api = parseInt(this.listQuery.api)
      if (this.runOptions === '运行') {
        data.runFlag = 1
        createCase(data)
        this.dialogFormVisible = false
      } else {
        data.runFlag = 0
        createCase(data)
        this.dialogFormVisible = false
      }
    },
    caseEdit(row) {
      row.edit = false
      updateCase(row.id, row)
      row.originalName = row.name
      this.$message({
        message: 'update case success',
        type: 'success'
      })
    },
    cancelEdit(row) {
      row.name = row.originalName
      row.edit = false
      this.$message({
        message: 'update cancel',
        type: 'warning'
      })
    }
  }
}
</script>
