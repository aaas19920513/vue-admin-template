<template>
  <el-table
    highlight-current-row
    :height="height"
    :data="tableData"
    style="width: 100%;"
    :border="false"
    :cell-style="{paddingTop: '4px', paddingBottom: '4px'}"
    @cell-mouse-enter="cellMouseEnter"
    @cell-mouse-leave="cellMouseLeave"
  >
    <el-table-column
      label="数据Key"
      width="400"
    >
      <template slot-scope="scope">
        <el-input
          v-model="scope.row.key"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 8}"
          clearable
          placeholder="key 、 key-key1"
        />
      </template>
    </el-table-column>

    <el-table-column
      label="数据内容"
      width="700"
    >
      <template slot-scope="scope">
        <el-input
          v-model="scope.row.value"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 8}"
          clearable
          placeholder="${ fun() } 、 [ value ] 、 [ [ value1, value2 ] ]"
        />
      </template>
    </el-table-column>

    <el-table-column
      label="参数描述"
      width="250"
    >
      <template slot-scope="scope">
        <el-input v-model="scope.row.desc" clearable placeholder="参数简要描述" />
      </template>
    </el-table-column>

    <el-table-column>
      <template slot-scope="scope">
        <el-row v-show="scope.row === currentRow">
          <el-button
            icon="el-icon-circle-plus-outline"
            size="mini"
            type="info"
            @click="handleEdit(scope.$index, scope.row)"
          />

          <el-button
            v-show="scope.$index !== 0"
            icon="el-icon-delete"
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          />
        </el-row>
      </template>
    </el-table-column>
  </el-table>

</template>

<script>

export default {
  name: 'Parameters',
  props: {
    save: Boolean,
    parameters: {
      require: false
    }
  },
  data() {
    return {
      currentRow: '',
      tableData: [{ key: '', value: '', desc: '' }]
    }
  },
  computed: {
    height() {
      return window.screen.height - 440
    }
  },
  watch: {
    save: function() {
      this.$emit('parameters', this.parseParameters(), this.tableData)
    },

    parameters: function() {
      if (this.parameters.length !== 0) {
        this.tableData = this.parameters
      }
    }
  },
  methods: {
    parseParameters() {
      const parameters = {
        parameters: [],
        desc: {}
      }
      for (const content of this.tableData) {
        let value = content['value']
        const key = content['key']
        const obj = {}
        if (key !== '' && value !== '') {
          try {
            value = JSON.parse(value)
          } catch (err){}
          obj[key] = value
          parameters.parameters.push(obj)
          parameters.desc[key] = content.desc
        }
      }
      return parameters
    },

    cellMouseEnter(row) {
      this.currentRow = row
    },

    cellMouseLeave(row) {
      this.currentRow = ''
    },

    handleEdit(index, row) {
      this.tableData.push({
        key: '',
        value: '',
        desc: ''
      })
    },

    handleDelete(index, row) {
      this.tableData.splice(index, 1)
    }

  }
}
</script>

<style scoped>
</style>
