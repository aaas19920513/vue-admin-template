<template>
  <div class="template-manage">
    <div class="temp-title">
      <p class="icon-box">
        <span class="name"></span>
      </p>
      <el-button
        :height="height"
        size="small"
        type="primary"
        :disabled="stepIndex.length===0"
        icon="el-icon-circle-plus-outline"
        @click="addTemp"
      >新增</el-button>
    </div>
    <div class="temp-list">
      <el-table
        class="template-list"
        :data="tableList"
        style="width: 100%"
        :row-class-name="tableRowClassName"
        @row-click="handleClick"
        @current-change="handleRowChange"
      >
        <template slot="empty">
          新增extract需选择相应步骤
        </template>
        <el-table-column prop="key" label="变量名">
          <template slot-scope="scope">
            <template v-if="scope.row.editing">
              <el-input v-model="scope.row.key" class="edit-input" placeholder="请输入变量名" />
            </template>
            <span v-else>{{ scope.row.key }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="value" label="响应提取">
          <template slot-scope="scope">
            <template v-if="scope.row.editing">
              <el-input v-model="scope.row.value" class="edit-input" placeholder="响应提取表达式" />
            </template>
            <span v-else>{{ scope.row.value }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="desc" label="变量描述">
          <template slot-scope="scope">
            <template v-if="scope.row.editing">
              <el-input v-model="scope.row.desc" class="edit-input" placeholder="变量描述" />
            </template>
            <span v-else>{{ scope.row.desc }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
        >
          <template slot-scope="scope">
            <div class="operate-groups">
              <el-button
                v-if="!scope.row.editing"
                type="primary"
                size="mini"
                icon="el-icon-edit-outline"
                @click="handleEdit(scope.$index, scope.row)"
              >编辑
              </el-button>
              <el-button
                v-if="scope.row.editing"
                type="primary"
                size="mini"
                icon="el-icon-success"
                @click.stop
                @click="handleSave(scope.$index, scope.row)"
              >保存
              </el-button>
              <el-button
                v-if="!scope.row.editing"
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="handleDelete(scope.$index, scope.row)"
              >删除
              </el-button>
              <el-button
                v-if="scope.row.editing"
                size="mini"
                type="warning"
                icon="el-icon-warning"
                @click.stop
                @click="handleCancel(scope.$index, scope.row)"
              >取消
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Extract',
  props: {
    stepIndex: {},
    extract: {}
  },
  data() {
    return {
      tableList: [],
      preValue: ''
    }
  },
  computed: {
    height() {
      return window.screen.height - 440
    }
  },
  watch: {
    extract() {
      this.tableList = this.parseExtractFromFather()
    },
    stepIndex1: function() {
      console.log(this.stepIndex)
      this.stepIndex1 = this.stepIndex
    }
  },
  methods: {
    cellMouseLeave(row) {
      this.handleCancel(row.index, row)
    },
    handleRowChange(newRow, oldRow) {
      if (oldRow !== null) {
        this.handleCancel(oldRow.index, oldRow)
      }
    },
    handleClick(row) {
      this.handleEdit(row.index, row)
    },
    // 把每一行的索引放进row
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex
    },
    // 编辑
    handleEdit($index, row) {
      this.$set(this.tableList[$index], 'editing', true)
      this.preValue = JSON.parse(JSON.stringify(row))
    },
    // 保存
    handleSave($index, row) {
      this.$set(this.tableList[$index], 'editing', false)
      delete this.tableList[$index].editing
      // 将tableList传给父组件
      this.$emit('extract', this.parseExtractToFather())
    },
    // 取消
    handleCancel($index, row) {
      this.$set(this.tableList[$index], 'editing', false)
      this.$set(this.tableList[$index], 'key', this.preValue.key)
      this.$set(this.tableList[$index], 'value', this.preValue.value)
      this.$set(this.tableList[$index], 'desc', this.preValue.desc)
    },
    // 新增
    addTemp() {
      // this.tableList = this.tableList || []
      this.tableList.push({
        key: '',
        value: '',
        desc: '',
        editing: true
      })
      console.log(this.tableList)
    },
    // 删除
    handleDelete($index, row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableList.splice($index, 1)
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
    },
    parseExtractToFather() {
      const extract = {
        extract: [],
        desc: {}
      }
      for (const content of this.tableList) {
        const key = content['key']
        const value = content['value']
        if (key !== '' && value !== '') {
          const obj = {}
          obj[key] = value
          extract.extract.push(obj)
          extract.desc[key] = content['desc']
        }
      }
      return JSON.stringify(extract)
    },
    parseExtractFromFather() {
      const list = []
      if (this.extract.length !== 0) {
        const extractList = this.extract.extract
        for (const extract of extractList) {
          for (const key in extract) {
            const a = { key: '', value: '', desc: '' }
            const desc = this.extract.desc
            a.key = key
            a.value = extract[key]
            a.desc = desc[key]
            list.push(a)
          }
        }
      }
      return list
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
    }
  }
</style>
