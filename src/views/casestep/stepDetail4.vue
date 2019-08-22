<template>
  <div class="step-manage">
    <div class="manage-title">
      <p class="icon-box">
        <span class="name">步骤管理</span>
      </p>
      <el-button
        size="small"
        type="primary"
        icon="el-icon-circle-plus-outline"
        @click="handleAdd"
      >新增步骤</el-button>
    </div>
    <div class="step-list">
      <el-table
        highlight-current-row
        class="template-list"
        :data="tableList"
        style="width: 100%"
        :row-class-name="tableRowClassName"
        @current-change="getCurrentRow"
      >
        <el-table-column
          label="名称"
        >
          <template slot-scope="scope">
            <div v-if="!scope.row.editing">
              <span>{{ scope.row.name }}</span>
            </div>
            <div v-else>
              <el-input v-model="scope.row.name" placeholder="请填写步骤名称" />
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="运行次数"
        >
          <template slot-scope="scope">
            <div v-if="!scope.row.editing">
              <span>{{ scope.row.times }}</span>
            </div>
            <div v-else>
              <el-input v-model="scope.row.times" placeholder="输入运行次数" />
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="url"
          width="400"
        >
          <template slot-scope="scope">
            <div v-if="!scope.row.editing">
              <span>{{ scope.row.url }}</span>
            </div>
            <div v-else>
              <el-input v-model="scope.row.url" placeholder="url" />
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="method"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.method }}</span>
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
              <div class="upAndDown">
                <el-button
                  plain
                  class="up"
                  type="primary"
                  size="mini"
                  icon="el-icon-arrow-up"
                  @click="handleUp(scope.$index, scope.row)"
                />
                <el-button
                  plain
                  class="down"
                  type="primary"
                  size="mini"
                  icon="el-icon-arrow-down"
                  @click="handleDown(scope.$index, scope.row)"
                />
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin: 40px 0;" />

    <el-row>
      <el-col :span="24">
        <div class="request-container">
          <el-tabs type="border-card" tab-position="left" stretch>
            <el-tab-pane label="Body">
              <Body
                :step-index="currentIndexForTable"
                :body-type="currentStepApiBodyType"
                :body="currentStepApiBody ? currentStepApiBody: []"
                @body="handleBody"
              />
            </el-tab-pane>
            <el-tab-pane label="Headers">
              <Headers
                :step-index="currentIndexForTable"
                :headers="currentStepApiHeaders ? currentStepApiHeaders: []"
                @headers="handleHeaders"
              />
            </el-tab-pane>
            <el-tab-pane label="响应提取">
              <Extract
                :step-index="currentIndexForTable"
                :extract="currentStepApiExtract ? currentStepApiExtract: []"
                @extract="handleExtract"
              />
            </el-tab-pane>
            <el-tab-pane label="变量管理">
              <Variables
                :step-index="currentIndexForTable"
                :variables="currentStepApiVariables ? currentStepApiVariables: []"
                @variables="handleVariables"
              />
            </el-tab-pane>
            <el-tab-pane label="断言管理">
              <Validate
                :step-index="currentIndexForTable"
                :validate="currentStepApiValidate ? currentStepApiValidate: []"
                @validate="handleValidate"
              />
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>

      <el-col :span="8" :push="4">
        <el-card class="response-card">
          <!--<el-input v-model="currentStepApiResponse" type="textarea" :autosize="{ minRows: 4}" />-->
          <span>
            {{ waitUpdateList }}
          </span>
        </el-card>
      </el-col>
    </el-row>

    <el-footer>
      <router-link :to="{name:'getCase'}">
        <el-button type="primary" @click="submitSteps">
          保存
        </el-button>
      </router-link>
      <el-button type="primary" @click="runCase">
        Run
      </el-button>
      <el-button @click="parseValidateToRun">
        test
      </el-button>
    </el-footer>
    <el-dialog title="测试报告" :visible.sync="dialogResultVisible" with="80%">
      <Result
        :summary="summary"
      />
    </el-dialog>
    <el-dialog title="Api选择器" :visible.sync="dialogFormVisible" width="60%">
      <div class="block">
        <el-row>
          <el-cascader
            v-model="selectorApiId"
            :show-all-levels="false"
            placeholder="可输入接口名搜索"
            :options="apiOptions"
            :rules="rules"
            filterable
            clearable
          />
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="getSelectorApiId">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getStep, addStep, updateStep, deleteStep } from '@/api/step'
import Extract from './components/Extract1'
import Variables from './components/Variables1'
import Validate from './components/Validate1'
import Headers from './components/Headers1'
import Body from './components/Body'
import Result from './components/Result'
import { fetchApiByPv } from '@/api/interface'
import { runCase } from '@/api/run'
import { apiSelector } from '@/api/category'
import { deepCompare } from '@/utils/compare'

export default {
  components: {
    Body,
    Headers,
    Extract,
    Variables,
    Validate,
    Result
  },
  data() {
    return {
      tableList: [],
      copyTableList: [],
      waitUpdateList: [],
      stepInfo: { id: '', name: '', headers: {}, url: '', method: '', body: {}, bodyType: '', extract: '', validate: '',
        variables: {}, hooks: {}, times: '', config: '', response: '', case: '', sequence: ''
      },
      listLoading: false,
      dialogFormVisible: false,
      dialogResultVisible: false,
      currentRow: '',
      currentStepApiBody: '',
      currentStepApiBodyType: '',
      currentIndexForTable: 0,
      currentStepApiResponse: '',
      currentStepApiExtract: '',
      currentStepApiVariables: '',
      currentStepApiValidate: '',
      currentStepApiHeaders: '',
      preValue: '',
      summary: '',
      // api选择器相关
      apiOptions: null,
      selectorApiId: '',

      // 路由传过来的待测ApiId, caseID
      testApiId: '',
      caseId: {},
      caseName: '',
      rules: {
        selectorApiId: [{ required: true, message: '请输入url', trigger: 'change' }]
        // name: [{ required: true, message: '请输入接口名称', trigger: 'blur' }]
      }
    }
  },
  computed: {
    height() {
      return window.screen.height - 440
    }
  },
  watch: {
    currentIndexForTable: function(newValue, oldValue) {
      this.$set(this.tableList[oldValue], 'editing', false)
      // 获取copy到本地的tableList数据，当表格的当前index变化后，会比较oldValue有无变化，有变化就加入待更新list，待提交后台更新
      // delete (this.tableList[oldValue]['index'])
      const newStepObj = JSON.parse(JSON.stringify(this.tableList[oldValue]))
      // delete newStepObj['index']
      delete newStepObj['editing']
      delete newStepObj['config']
      delete newStepObj['hooks']
      const oldStepObj = this.copyTableList[oldValue]
      console.log(newStepObj)
      console.log(oldStepObj)
      if (this.tableList[oldValue].id.length !== 0) {
        if (!deepCompare(newStepObj, oldStepObj)) {
          this.waitUpdateList.push(oldValue)
        }
      }
    }
  },
  created() {
    this.getCaseIdbByRouter()
    this.getList()
    this.getCategoryData()
  },
  methods: {
    // 构造后台需要的validate结构，并转为String
    parseValidateToRun(data) {
      const validate = {
        validate: []
      }
      // const data = '[{"expect":"200","actual":"status_code","comparator":"equals","type":2}]'
      for (const content of data) {
        if (content['actual'] !== '') {
          const obj = {}
          // const expect = content['expect']
          const expect = this.parseType(content['type'], content['expect'])
          obj[content['comparator']] = [content['actual'], expect]
          validate.validate.push(obj)
        }
      }
      return validate
    },
    // 类型转换
    parseType(type, value) {
      let tempValue
      switch (type) {
        case 1:
          tempValue = value
          break
        case 2:
          tempValue = parseInt(value)
          break
        case 3:
          tempValue = parseFloat(value)
          break
        case 4:
          if (value === 'False' || value === 'True') {
            const bool = {
              'True': true,
              'False': false
            }
            tempValue = bool[value]
          } else {
            this.$notify.error({
              title: '类型转换错误',
              message: '类型转换错误',
              duration: 2000
            })
            return 'exception'
          }
          break
        case 5:
          try {
            tempValue = JSON.parse(value)
          } catch (err) {
            tempValue = false
          }
          break
        case 6:
          try {
            tempValue = JSON.parse(value)
          } catch (err) {
            tempValue = false
          }
          break
      }
      if (tempValue !== 0 && !tempValue && type !== 4 && type !== 1) {
        this.$notify.error({
          title: '类型转换错误',
          message: '类型转换错误',
          duration: 2000
        })
        return 'exception'
      }
      return tempValue
    },
    // 运行case
    runCase() {
      const table = JSON.parse(JSON.stringify(this.tableList))
      for (const step of table) {
        if (step['validate'].length !== 0) {
          step['validate'] = JSON.stringify(this.parseValidateToRun(JSON.parse(step['validate'])))
        }
      }
      delete table['id']
      delete table['response']
      delete table['case']
      const obj = {
        steps: table,
        caseName: this.caseName,
        config: ''
      }
      runCase(obj).then(res => {
        this.summary = res.data
        this.dialogResultVisible = true
      })
    },
    // 判断行数据是否有更新，并将更新的数据提交到后台
    submitSteps() {
      // 判断当前行是否有更新数据
      if (this.tableList[this.currentIndexForTable].id.length !== 0) {
        const oldStepObj = this.copyTableList
        const newStepObj = JSON.parse(JSON.stringify(this.tableList[this.currentIndexForTable]))
        // delete newStepObj['index']
        delete newStepObj['editing']
        delete newStepObj['config']
        delete newStepObj['hooks']
        if (!deepCompare(newStepObj, oldStepObj[this.currentIndexForTable])) {
          updateStep(this.tableList[this.currentIndexForTable]['id'], this.tableList[this.currentIndexForTable])
        }
      }
      for (var i = 0; i < this.tableList.length; i++) {
        if (this.tableList[i].id.length === 0) {
          console.log(typeof this.tableList[i])
          addStep(this.tableList[i])
        }
      }
      // 将去重后的待更新step 更新到后台
      const list = new Set(this.waitUpdateList)
      for (const j of list) {
        const stepId = this.tableList[j]['id']
        updateStep(stepId, this.tableList[j])
      }
    },
    // 获取路由跳转过来的caseID apiID
    getCaseIdbByRouter() {
      if (JSON.stringify(this.$route.params) !== '{}') {
        this.caseId = (this.$route.params['case'])
        this.testApiId = (this.$route.params['api'])
        this.caseName = (this.$route.params['caseName'])
        localStorage.setItem('testCaseIdInDetail', JSON.stringify(this.$route.params['case']))
        localStorage.setItem('testApiIdInDetail', JSON.stringify(this.$route.params['api']))
        localStorage.setItem('testCaseName', JSON.stringify(this.$route.params['caseName']))
      } else {
        this.caseId = JSON.parse(localStorage.getItem('testCaseIdInDetail'))
        this.testApiId = JSON.parse(localStorage.getItem('testApiIdInDetail'))
        this.caseName = JSON.parse(localStorage.getItem('caseName'))
      }
      console.log(this.$route.params)
    },
    getCategoryData() {
      apiSelector().then(res => {
        this.apiOptions = res.data
      })
    },
    // Api选择器数据获取
    getSelectorApiId() {
      if (this.selectorApiId.length === 4) {
        this.dialogFormVisible = false
        this.testApiId = this.selectorApiId[3]
        this.handleAddStepByApi(this.testApiId)
      } else {
        this.dialogFormVisible = true
        this.$message({
          message: '请选择正确的Api!',
          type: 'warning'
        })
      }
    },
    restStepInfo() {
      this.stepInfo = { name: '', headers: '', url: '', method: '', body: '', bodyType: '', extract: '', validate: '',
        variables: '', hooks: '', times: '', config: '', response: '', sequence: ''
      }
    },
    // 获取caseStep
    getList: async function() {
      this.listLoading = true
      getStep({ 'case': this.caseId }).then(response => {
        const content = response.data
        if (content.length === 0) {
          this.handleAddStepByApi(this.testApiId)
        } else {
          for (const step of content) {
            this.stepInfo['case'] = step['case']
            this.stepInfo['id'] = step['id']
            this.stepInfo['api'] = step['api']
            this.stepInfo['name'] = step['name']
            this.stepInfo['times'] = step['times']
            this.stepInfo['validate'] = step['validate']
            this.stepInfo['variables'] = step['variables']
            this.stepInfo['extract'] = step['extract']
            this.stepInfo['url'] = step['url']
            this.stepInfo['method'] = step['method']
            this.stepInfo['headers'] = step['headers']
            this.stepInfo['body'] = step['body']
            this.stepInfo['bodyType'] = step['bodyType']
            this.stepInfo['hooks'] = step['hooks']
            this.stepInfo['config'] = step['config']
            this.stepInfo['sequence'] = step['sequence']
            this.tableList.push(this.stepInfo)
            this.restStepInfo()
          }
          // 该对象无函数，利用json进行深拷贝, 给深拷贝对象添加index属性，并将sequence赋值给index,记录sequence有无变化
          this.copyTableList = JSON.parse(JSON.stringify(this.tableList))
          for (var i = 0; i < this.copyTableList.length; i++) {
            this.$set(this.copyTableList[i], 'index', i)
          }
        }
        this.listLoading = false
      })
    },
    // 把每一行的索引放进row
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex
      // 添加步骤顺序标识
      row.sequence = rowIndex
    },
    // 获取点击行的数据
    getCurrentRow(row, oldRow) {
      this.handleEdit(row.index, row)
      this.currentIndexForTable = String(row.index)
      this.currentStepApiBodyType = String(row.bodyType)
      this.parseExtract(row)
      this.parseValidate(row)
      this.parseHeaders(row)
      this.parseBody(row)
      this.parseVariables(row)
      console.log(row)
      console.log(row.index)
      console.log(this.tableList)
    },
    // 将子组件传过来的数据string，解决子组件传数据过来后，json.parse报错的问题
    parseExtract(row) {
      if (row.extract.length !== 0) {
        this.currentStepApiExtract = JSON.parse(row.extract)
      } else {
        this.currentStepApiExtract = JSON.parse('[]')
      }
    },
    parseVariables(row) {
      if (row.variables.length !== 0) {
        this.currentStepApiVariables = JSON.parse(row.variables)
      } else {
        this.currentStepApiVariables = JSON.parse('[]')
      }
    },
    parseValidate(row) {
      if (row.validate.length !== 0) {
        this.currentStepApiValidate = JSON.parse(row.validate)
      } else {
        this.currentStepApiValidate = JSON.parse('[]')
      }
    },
    parseHeaders(row) {
      if (row.headers.length !== 0) {
        this.currentStepApiHeaders = JSON.parse(row.headers)
      } else {
        this.currentStepApiHeaders = JSON.parse('{}')
      }
    },
    parseBody(row) {
      if (row.body.length !== 0) {
        this.currentStepApiBody = JSON.parse(row.body)
      } else {
        this.currentStepApiBody = JSON.parse('{}')
      }
    },
    // 初始化数据
    handleInitData() {
      fetchApiByPv(this.testApiId).then(res => {
        const apiInfo = res.data
        this.currentStepApiHeaders = apiInfo.headers
        if (this.tableList.length === 0) {
          this.currentIndexForTable = 0
          this.currentStepApiValidate = []
          this.currentStepApiExtract = []
          console.log(apiInfo.body)
          console.log(typeof apiInfo.body)
          this.currentStepApiBody = JSON.parse(apiInfo.body)
          this.currentStepApiHeaders = JSON.parse(apiInfo.headers)
        }
        this.currentStepApiBody = JSON.parse(apiInfo.body)
        this.currentStepApiHeaders = JSON.parse(apiInfo.headers)
      })
    },
    // 添加步骤填充所选接口数据
    handleAddStepByApi(apiId) {
      fetchApiByPv(apiId).then(res => {
        const apiInfo = res.data
        const obj = {
          case: this.caseId,
          name: apiInfo['name'],
          api: apiId,
          headers: apiInfo['headers'],
          url: apiInfo['url'],
          method: apiInfo['method'],
          body: apiInfo['body'],
          id: '',
          bodyType: 'data',
          extract: '',
          validate: '',
          variables: '',
          hooks: '',
          times: 1,
          config: '',
          sequence: '',
          editing: false
        }
        this.tableList.push(obj)
        this.copyTableList.push(obj)
      })
    },
    // 处理子组件传过来的数据
    handleBody(body, bodyType) {
      this.$set(this.tableList[this.currentIndexForTable], 'body', body)
      this.$set(this.tableList[this.currentIndexForTable], 'bodyType', bodyType)
    },
    handleExtract(extract) {
      this.$set(this.tableList[this.currentIndexForTable], 'extract', extract)
    },
    handleVariables(variables) {
      this.$set(this.tableList[this.currentIndexForTable], 'variables', variables)
    },
    handleValidate(validate) {
      this.$set(this.tableList[this.currentIndexForTable], 'validate', JSON.stringify(validate))
    },
    handleHeaders(headers) {
      this.$set(this.tableList[this.currentIndexForTable], 'headers', headers)
    },
    cellMouseEnter() {
      console.log('')
    },
    cellMouseLeave() {
      this.currentRow = ''
      console.log('test')
    },
    handleClick(row) {
      console.log(row)
      this.$set(this.tableList[row.index], 'editing', true)
    },
    // 上下自由调整表格数据
    swapItems(arr, index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0]
      return arr
    },
    handleUp($index, row) {
      if ($index === 0) {
        return
      }
      // 将拷贝对象也做相应操作
      this.swapItems(this.tableList, $index, $index - 1)
      this.swapItems(this.copyTableList, $index, $index - 1)
    },
    handleDown($index, row) {
      if ($index === this.tableList.length - 1) {
        return
      }
      // 将拷贝对象也做相应操作
      this.swapItems(this.tableList, $index, $index + 1)
      this.swapItems(this.copyTableList, $index, $index + 1)
    },
    // 编辑
    handleEdit($index, row) {
      this.preValue = row
      this.$set(this.tableList[$index], 'editing', true)
      console.log(row)
    },
    // 保存
    handleSave($index, row) {
      this.$set(this.tableList[$index], 'editing', false)
      // localStorage.setItem('tableList', JSON.stringify(this.tableList))
    },
    // 取消
    handleCancel($index, row) {
      console.log(this.preValue)
      this.$set(this.tableList[$index], 'editing', false)
      this.$set(this.tableList[$index], 'name', this.preValue.name)
      this.$set(this.tableList[$index], 'times', this.preValue.times)
      this.$set(this.tableList[$index], 'url', this.preValue.url)
    },
    // 新增测试步骤
    handleAdd() {
      this.dialogFormVisible = true
      this.selectorApiId = []
    },
    // 删除
    handleDelete($index, row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (row.id.length !== 0) {
          deleteStep(row.id)
          this.tableList.splice($index, 1)
          this.copyTableList.splice($index, 1)
        } else {
          this.tableList.splice($index, 1)
        }
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
  .step-manage {
    width: 95%;
    margin: 0 auto;
    .manage-title {
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
