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
        :data="tableList"
        style="width: 100%;"
        :border="false"
        :cell-style="{paddingTop: '4px', paddingBottom: '4px'}"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave"
      >
        <el-table-column
          label="key"
          width="180"
        >
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.key"
              placeholder="请求key"
            />
          </template>
        </el-table-column>

        <el-table-column
          label="value"
          width="200"
        >
          <template slot-scope="scope">
            <el-input v-model="scope.row.value" placeholder="请求value" />
          </template>
        </el-table-column>

        <el-table-column
          label="描述"
          width="220"
        >
          <template slot-scope="scope">
            <el-input v-model="scope.row.desc" placeholder="描述" />

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
    <div class="button-group" style="text-align:right">
      <el-row>
        <el-button
          type="primary"
          mini
          icon="el-icon-success"
          @click="save"
        >保存</el-button>
        <el-button
          type="primary"
          mini
          icon="el-icon-circle-plus-outline"
          @click="addTemp"
        >新增</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Request',
  props: {
    stepIndex: {},
    bodyType: {},
    body: {}
  },

  data() {
    return {
      tableList: [],
      currentRow: '',
      dataType: '',
      dataOptions: [{
        label: 'data',
        value: '表单'
      }, {
        label: 'json',
        value: 'json'
      }, {
        label: 'params',
        value: 'params'
      }]
    }
  },
  watch: {
    body: function() {
      this.tableList = this.parseRequestBodyFromFather()
    },
    bodyType: function() {
      this.dataType = this.bodyType
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
    parseRequestBodyFromFather() {
      const list = []
      const data = this.body
      const request_body = data.body
      for (const key in request_body) {
        const a = { key: '', value: '', desc: '' }
        const desc = data.desc
        a.key = key
        a.value = request_body[key]
        a.desc = desc[key]
        list.push(a)
      }
      return list
    },
    parseRequestBodyToFather() {
      const body = {
        body: {},
        desc: {}
      }
      for (const content of this.tableList) {
        if (content['key'] !== '' && content['value'] !== '') {
          body.body[content['key']] = content['value']
          body.desc[content['key']] = content['desc']
        }
      }
      return JSON.stringify(body)
    },
    // 新增
    save() {
      this.$emit('body', this.parseRequestBodyToFather(), this.dataType)
    },
    addTemp() {
      // this.tableList = this.tableList || []
      this.tableList.push({
        key: '',
        value: '',
        desc: ''
      })
    },
    // 删除
    handleDelete($index, row) {
      this.tableList.splice($index, 1)
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
    .button-group {
    }
  }
</style>
