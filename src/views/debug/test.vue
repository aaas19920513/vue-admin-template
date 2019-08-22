<template>
  <div class="template-manage">
    <div class="temp-title">
      <div style="margin-left: 20px;">
        <el-form ref="form" label-width="80px">
          <el-form-item label="请求类型">
            <el-radio-group v-model="dataType">
              <el-radio
                v-for="item of dataOptions"
                :key="item.value"
                :label="item.label"
              >{{ item.value }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="temp-list">
      <el-table
        highlight-current-row
        :data="dataType==='data'? formList: paramsList "
        style="width: 100%;"
        :border="false"
        :cell-style="{paddingTop: '4px', paddingBottom: '4px'}"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave"
      >
        <el-table-column
          label="key"
          width="300"
        >
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.key"
              clearable
              placeholder="请求key"
            />
          </template>
        </el-table-column>

        <el-table-column
          label="value"
          width="400"
        >
          <template slot-scope="scope">
            <el-input v-model="scope.row.value" clearable placeholder="请求value" />
          </template>
        </el-table-column>

        <el-table-column
          label="描述"
          width="220"
        >
          <template slot-scope="scope">
            <el-input v-model="scope.row.desc" clearable placeholder="描述" />

          </template>
        </el-table-column>

        <el-table-column>
          <template slot-scope="scope">
            <el-row v-show="scope.row === currentRow">
              <el-button
                icon="el-icon-delete"
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
              />
            </el-row>

          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="text-align:right">
      <el-button
        type="primary"
        small
        icon="el-icon-circle-plus-outline"
        @click="addTemp"
      >新增</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Request',
  props: {
    stepIndex: {},
    Request: {}
  },

  data() {
    return {
      formList: [],
      paramsList: [],
      currentRow: '',
      dataType: 'data',
      dataOptions: [{
        label: 'data',
        value: '表单'
      }, {
        label: 'params',
        value: 'params'
      }]
    }
  },
  watch: {
    save: function() {
      this.$emit('request', {
        form: this.parseRequestFormToFather(),
        params: this.parseRequestParamsToFather()
      }, {
        data: this.formList,
        params: this.paramsList
      })
    },
    request: function() {
      if (this.request.length !== 0) {
        this.formList = this.request.data
        this.paramsList = this.request.params
      }
    }
  },
  methods: {
    cellMouseEnter(row) {
      this.currentRow = row
    },

    cellMouseLeave(row) {
      this.currentRow = ''
    },
    // 解析父组件数据
    parseRequestFromFather() {
      const list = []
      const data = this.request
      console.log(data)
      const request = data.request
      for (const key in request) {
        const a = { key: '', value: '', desc: '' }
        const desc = data.desc
        a.key = key
        a.value = request[key]
        a.desc = desc[key]
        list.push(a)
      }
      return list
    },
    parseRequestParamsToFather() {
      const request = {
        params: {},
        desc: {}
      }
      for (const content of this.paramsList) {
        if (content['key'] !== '' && content['value'] !== '') {
          request.params[content['key']] = content['value']
          request.desc[content['key']] = content['desc']
        }
      }
      return request
    },
    parseRequestFormToFather() {
      const request = {
        data: {},
        desc: {}
      }
      for (const content of this.paramsList) {
        if (content['key'] !== '' && content['value'] !== '') {
          request.data[content['key']] = content['value']
          request.desc[content['key']] = content['desc']
        }
      }
      return request
    },
    // 新增
    addTemp() {
      // this.tableList = this.tableList || []
      const data = this.dataType === 'data' ? this.formList : this.paramsList
      console.log(data)
      data.push({
        key: '',
        value: '',
        desc: ''
      })
    },
    // 删除
    handleDelete($index, row) {
      const data = this.dataType === 'data' ? this.formList : this.paramsList
      data.splice($index, 1)
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
