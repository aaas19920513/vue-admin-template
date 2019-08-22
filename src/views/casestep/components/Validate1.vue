<template>
  <div class="template-manage">
    <div class="temp-title">
      <p class="icon-box">
        <span class="name" />
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
          新增断言需选择相应步骤
        </template>
        <el-table-column prop="expect" label="期望">
          <template slot-scope="scope">
            <template v-if="scope.row.editing">
              <el-input v-model="scope.row.expect" class="edit-input" placeholder="期望" />
            </template>
            <span v-else>{{ scope.row.expect }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="期望类型"
          width="170"
        >
          <template slot-scope="scope">
            <template v-if="scope.row.editing">
              <el-select v-model="scope.row.type">
                <el-option
                  v-for="item in dataTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
            <span v-else>{{ scope.row.type }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="断言类型"
          width="250"
        >
          <template slot-scope="scope">
            <template v-if="scope.row.editing">
              <el-tooltip
                effect="dark"
                :content="scope.row.comparator"
                placement="bottom"
                :disabled="scope.row.comparator === '' ? 'disabled' : false"
              >
                <el-autocomplete
                  v-model="scope.row.comparator"
                  :fetch-suggestions="querySearch"
                  placeholder="请输入断言类型"
                />
              </el-tooltip>
            </template>
            <span v-else>{{ scope.row.comparator }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="actual" label="实际">
          <template slot-scope="scope">
            <template v-if="scope.row.editing">
              <el-input v-model="scope.row.actual" class="edit-input" placeholder="实际" />
            </template>
            <span v-else>{{ scope.row.actual }}</span>
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
                @click.stop
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
                @click.stop
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
  name: 'Validate',
  props: {
    stepIndex: {},
    validate: {}
  },
  data() {
    return {
      tableList: [],
      preValue: '',
      dataTypeOptions: [{
        label: 'String',
        value: 1
      }, {
        label: 'Integer',
        value: 2
      }, {
        label: 'Float',
        value: 3
      }, {
        label: 'Boolean',
        value: 4
      }, {
        label: 'List',
        value: 5
      }, {
        label: 'Dict',
        value: 6
      }],

      validateOptions: [{
        value: 'equals'
      }, {
        value: 'less_than'
      }, {
        value: 'less_than_or_equals'
      }, {
        value: 'greater_than'
      }, {
        value: 'greater_than_or_equals'
      }, {
        value: 'not_equals'
      }, {
        value: 'string_equals'
      }, {
        value: 'length_equals'
      }, {
        value: 'length_greater_than'
      }, {
        value: 'length_greater_than_or_equals'
      }, {
        value: 'length_less_than'
      }, {
        value: 'length_less_than_or_equals'
      }, {
        value: 'contains'
      }, {
        value: 'contained_by'
      }, {
        value: 'type_match'
      }, {
        value: 'regex_match'
      }, {
        value: 'startswith'
      }, {
        value: 'endswith'
      }]
    }
  },
  computed: {
    height() {
      return window.screen.height - 440
    }
  },
  watch: {
    validate: function() {
      this.tableList = this.validate
    }
  },
  methods: {
    test() {
      console.log(this.tableList)
    },
    querySearch(queryString, cb) {
      const validateOptions = this.validateOptions
      const results = queryString ? validateOptions.filter(this.createFilter(queryString)) : validateOptions
      cb(results)
    },

    createFilter(queryString) {
      return (validateOptions) => {
        return (validateOptions.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    // 类型转换
    // parseType(type, value) {
    //   let tempValue
    //   switch (type) {
    //     case 1:
    //       tempValue = value
    //       break
    //     case 2:
    //       tempValue = parseInt(value)
    //       break
    //     case 3:
    //       tempValue = parseFloat(value)
    //       break
    //     case 4:
    //       if (value === 'False' || value === 'True') {
    //         const bool = {
    //           'True': true,
    //           'False': false
    //         }
    //         tempValue = bool[value]
    //       } else {
    //         this.$notify.error({
    //           title: '类型转换错误',
    //           message: '类型转换错误',
    //           duration: 2000
    //         })
    //         return 'exception'
    //       }
    //       break
    //     case 5:
    //       try {
    //         tempValue = JSON.parse(value)
    //       } catch (err) {
    //         tempValue = false
    //       }
    //       break
    //     case 6:
    //       try {
    //         tempValue = JSON.parse(value)
    //       } catch (err) {
    //         tempValue = false
    //       }
    //       break
    //   }
    //
    //   if (tempValue !== 0 && !tempValue && type !== 4 && type !== 1) {
    //     this.$notify.error({
    //       title: '类型转换错误',
    //       message: '类型转换错误',
    //       duration: 2000
    //     })
    //     return 'exception'
    //   }
    //   return tempValue
    // },

    // parseValidateToRun2(data) {
    //   const validate = {
    //     validate: []
    //   }
    //   for (const content of data) {
    //     if (content['actual'] !== '') {
    //       const obj = {}
    //       const expect = this.parseType(content['type'], content['expect'])
    //       if (expect === 'exception') {
    //         continue
    //       }
    //       obj[content['comparator']] = [content['actual'], expect]
    //       validate.validate.push(obj)
    //     }
    //   }
    //   console.log(validate)
    //   return String(validate)
    // },
    // parseValidateFromFather() {
    //   const list = [{ 'equals': ['status_code', 201] }, { 'equals': ['$test2', '$name'] }]
    //   // console.log(this.validate)
    //   const table = []
    //   // const list = this.validate
    //   for (var i = 0; i < list.length; i++) {
    //     for (const key in list[i]) {
    //       const comparator = key
    //       const comparatorValue = list[i][key]
    //       const a = {
    //         expect: '',
    //         actual: '',
    //         comparator: ''
    //       }
    //       a['comparator'] = comparator
    //       a['actual'] = comparatorValue[0]
    //       a['expect'] = comparatorValue[1]
    //       table.push(a)
    //     }
    //   }
    //   console.log(table)
    //   return table
    // },

    // parseValidateToFather() {
    //   const validate = {
    //     validate: []
    //   }
    //   for (const content of this.tableList) {
    //     if (content['actual'] !== '') {
    //       const obj = {}
    //       const expect = content['expect']
    //       obj[content['comparator']] = [content['actual'], expect]
    //       validate.validate.push(obj)
    //     }
    //   }
    //   return validate
    // },
    handleClick(row) {
      this.handleEdit(row.index, row)
    },
    handleRowChange(newRow, oldRow) {
      if (oldRow !== null) {
        this.handleCancel(oldRow.index, oldRow)
      }
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
      delete this.tableList['index']
      this.$emit('validate', this.tableList)
    },
    // 取消
    handleCancel($index, row) {
      this.$set(this.tableList[$index], 'editing', false)
      this.$set(this.tableList[$index], 'expect', this.preValue.expect)
      this.$set(this.tableList[$index], 'actual', this.preValue.actual)
      this.$set(this.tableList[$index], 'comparator', this.preValue.comparator)
    },
    // 新增
    addTemp() {
      // this.tableList = this.tableList || []
      this.tableList.push({
        expect: '',
        actual: '',
        comparator: 'equals',
        type: 1,
        editing: true
      })
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
