<template>
  <div class="template-manage">
    <div class="temp-title">
      <p class="icon-box">
        <span class="name">项目列表</span>
      </p>
      <el-button
        size="small"
        type="primary"
        icon="el-icon-circle-plus-outline"
        @click="handleAdd"
      >新增项目</el-button>
    </div>
    <div class="temp-list">
      <el-table
        class="template-list"
        :data="tableList"
        style="width: 100%"
      >
        <el-table-column
          label="项目名称"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="项目成员"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="说明"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="创建人"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.create_user }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.create_time }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
        >
          <template slot-scope="scope">
            <div class="operate-groups">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit-outline"
              ><router-link :to="{name:'suiteDetail', params:{suiteId:scope.row.id, suite: scope.row}}">详情</router-link>
              </el-button>
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit-outline"
                @click="handleEdit(scope.$index, scope.row)"
              >运行
              </el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="handleDelete(scope.$index, scope.row)"
              >删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
        <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
          <el-form-item label="name" prop="name">
            <el-input v-model="temp.name" />
          </el-form-item>
          <el-form-item label="成员">
            <el-input v-model="temp.member" :autosize="{ minRows: 4, maxRows: 6}" type="textarea" placeholder="请输入成员" />
          </el-form-item>
          <el-form-item label="说明">
            <el-input v-model="temp.description" :autosize="{ minRows: 4, maxRows: 6}" type="textarea" placeholder="说明" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
            Cancel
          </el-button>
          <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
            Confirm
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getSuite, updateSuite, createSuite, deleteSuite, fetchSuite, fetchSuiteByPv } from '@/api/testsuite'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      tableList: [],
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      listLoading: false,
      dialogPvVisible: false,
      dialogFormVisible: false,
      dialogStatus: '',
      pvData: [],
      temp: {
        id: undefined,
        name: '',
        member: '',
        description: '',
        cases: '',
        create_user: ''
      },
      rules: {
        description: [{ required: true, message: 'type is required', trigger: 'change' }],
        name: [{ required: true, message: 'title is required', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'username'
    ])
  },
  created() {
    this.getData()
  },
  methods: {
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        member: '',
        description: '',
        cases: '',
        create_user: this.username
      }
    },
    getData() {
      getSuite().then(res => {
        this.tableList = res.data
      })
    },
    // 新增数据
    handleAdd() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createSuite(this.temp)
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateSuite(this.temp)
        }
      })
    },
    // 编辑
    handleEdit($index, row) {
      this.$set(this.tableList[$index], 'editing', true)
    },
    // 保存
    handleSave($index, row) {
      this.$set(this.tableList[$index], 'editing', false)
    },
    // 删除
    handleDelete($index, row) {
      this.$confirm('此操作将永久删除该条模板, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableList.splice($index, 1)
        localStorage.setItem('tableList', JSON.stringify(this.tableList))
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch((err) => {
        this.$message({
          type: 'error',
          message: err
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .template-manage {
    width: 80%;
    margin: 0 auto;
    .temp-title {
      display: flex;
      justify-content: space-between;
      height: 30px;
      margin-top: 20px;
    }
    .el-table {
      background-color: #f7f7f7;
      margin-top: 20px;
      th>.cell {
        text-align: center !important;
      }
    }
    .operate-groups {
      display: flex;
      justify-content: flex-start;
      .upAndDown {
        display: flex;
        flex-direction: column;
        margin-left: 10px;
        .el-button--mini {
          padding: 0;
          width: 30px;
          margin-left: 0;
        }
        .down {
          margin-top: 2px;
        }
      }
    }
  }
</style>
