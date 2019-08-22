<template>
  <el-table
    highlight-current-row
    :data="tableData"
    :height="height"
    style="width: 100%;"
    :border="false"
    :cell-style="{paddingTop: '4px', paddingBottom: '4px'}"
    @cell-mouse-enter="cellMouseEnter"
    @cell-mouse-leave="cellMouseLeave"
  >
    <el-table-column
      label="标签"
      width="300"
    >
      <template slot-scope="scope">
        <el-autocomplete
          v-model="scope.row.key"
          clearable
          :fetch-suggestions="querySearch"
          placeholder="头部标签"
        />
      </template>
    </el-table-column>

    <el-table-column
      label="内容"
      width="400"
    >
      <template slot-scope="scope">
        <el-input v-model="scope.row.value" clearable placeholder="头部内容" />
      </template>
    </el-table-column>

    <el-table-column
      label="描述"
      width="220"
    >
      <template slot-scope="scope">
        <el-input v-model="scope.row.desc" clearable placeholder="头部信息简要描述" />

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
  name: 'Header',
  props: {
    save: Boolean,
    header: {
      require: false
    }
  },
  data() {
    return {
      headerOptions: [{
        value: 'Accept'
      }, {
        value: 'Accept-Charset'
      }, {
        value: 'Accept-Language'
      }, {
        value: 'Accept-Datetime'
      }, {
        value: 'Authorization'
      }, {
        value: 'Cache-Control'
      }, {
        value: 'Connection'
      }, {
        value: 'Cookie'
      }, {
        value: 'Content-Length'
      }, {
        value: 'Content-MD5'
      }, {
        value: 'Content-Type'
      }, {
        value: 'Expect'
      }, {
        value: 'Date'
      }, {
        value: 'From'
      }, {
        value: 'Host'
      }, {
        value: 'If-Match'
      }, {
        value: 'If-Modified-Since'
      }, {
        value: 'If-None-Match'
      }, {
        value: 'If-Range'
      }, {
        value: 'If-Unmodified-Since'
      }, {
        value: 'Max-Forwards'
      }, {
        value: 'Origin'
      }, {
        value: 'Pragma'
      }, {
        value: 'Proxy-Authorization'
      }, {
        value: 'Range'
      }, {
        value: 'Referer'
      }, {
        value: 'TE'
      }, {
        value: 'User-Agent'
      }, {
        value: 'Upgrade'
      }, {
        value: 'Via'
      }, {
        value: 'Warning'
      }],

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
      this.$emit('header', this.parseHeader(), this.tableData)
    },

    header: function() {
      if (this.header.length !== 0) {
        this.tableData = this.header
      }
    }
  },
  methods: {
    querySearch(queryString, cb) {
      const headerOptions = this.headerOptions
      const results = queryString ? headerOptions.filter(this.createFilter(queryString)) : headerOptions
      cb(results)
    },

    createFilter(queryString) {
      return (headerOptions) => {
        return (headerOptions.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
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
    },

    // 头部信息格式化
    parseHeader() {
      const header = {
        header: {},
        desc: {}
      }
      for (const content of this.tableData) {
        if (content['key'] !== '' && content['value'] !== '') {
          header.header[content['key']] = content['value']
          header.desc[content['key']] = content['desc']
        }
      }
      return header
    }
  }
}
</script>

<style scoped>
</style>
