<template>
  <el-table
    highlight-current-row
    :cell-style="{paddingTop: '4px', paddingBottom: '4px'}"
    strpe
    :height="height"
    :data="tableData"
    style="width: 100%;"
    @cell-mouse-enter="cellMouseEnter"
    @cell-mouse-leave="cellMouseLeave"
  >
    <el-table-column
      label="测试之前执行的方法"
      width="500"
    >
      <template slot-scope="scope">
        <el-input
          v-model="scope.row.setup"
          clearable
          placeholder="${ setup_hooks function($request, *args, **kwargs) }"
        />
      </template>
    </el-table-column>

    <el-table-column
      label="测试之后执行的方法"
      width="500"
    >
      <template slot-scope="scope">
        <el-input
          v-model="scope.row.teardown"
          clearable
          placeholder="${ teardown_hooks function(response, *args, **kwargs) }"
        />
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
  name: 'Hooks',
  props: {
    save: Boolean,
    hooks: {
      require: false
    }
  },
  data() {
    return {
      currentRow: '',
      tableData: [{
        setup: '',
        teardown: ''
      }]
    }
  },
  computed: {
    height() {
      return window.screen.height - 440
    }
  },
  watch: {
    save: function() {
      this.$emit('hooks', this.parse_hooks(), this.tableData)
    },

    hooks: function() {
      if (this.hooks.length !== 0) {
        this.tableData = this.hooks
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

    handleEdit(index, row, flag) {
      this.tableData.push({
        setup: '',
        teardown: ''
      })
    },

    handleDelete(index, row) {
      this.tableData.splice(index, 1)
    },

    parse_hooks() {
      const hooks = {
        setup_hooks: [],
        teardown_hooks: []
      }
      for (const content of this.tableData) {
        if (content.setup !== '') {
          hooks.setup_hooks.push(content.setup)
        }
        if (content.teardown !== '') {
          hooks.teardown_hooks.push(content.teardown)
        }
      }
      return hooks
    }
  }
}
</script>

<style scoped>
</style>
