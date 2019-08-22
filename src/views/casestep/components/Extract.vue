<template>
  <div>
    <el-row>
      <el-col>
        <el-table
          highlight-current-row
          strpe
          :height="height"
          :data="tableData"
          style="width: 100%;"
          :cell-style="{paddingTop: '4px', paddingBottom: '4px'}"
          @cell-mouse-enter="cellMouseEnter"
          @cell-mouse-leave="cellMouseLeave"
        >
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
          <el-table-column prop="editing" label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="!scope.row.editing"
                v-model="scope.$index"
                type="danger"
                icon="el-icon-delete"
                @click="handleEdit(scope.$index, scope.row)"
              >编辑
              </el-button>
              <el-button
                v-else
                v-model="scope.$index"
                type="danger"
                icon="el-icon-delete"
                @click="handleCancle(scope.$index, scope.row)"
              >取消
              </el-button>
            </template>
          </el-table-column>

          <el-table-column>
            <template slot-scope="scope">
              <el-row v-show="scope.row === currentRow">
                <el-button
                  icon="el-icon-circle-plus-outline"
                  size="mini"
                  type="info"
                  @click="handleAdd"
                />

                <el-button
                  v-show="scope.$index !== 0"
                  icon="el-icon-delete"
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index)"
                />
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <footer>
      <button @click="handleSave">save</button>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'Extract',
  props: {
    // save: Boolean,
    extract: {
      require: false
    }
  },

  data() {
    return {
      currentRow: '',
      tableData: [{ key: '', value: '', desc: '' }],
      temp: {
        key: '',
        value: '',
        desc: '',
        editing: ''
      }
    }
  },
  computed: {
    height() {
      return window.screen.height - 440
    }
  },
  watch: {
    save: function() {
      this.$emit('extract', this.tableData)
    },
    extract: function() {
      if (this.extract.length !== 0) {
        this.tableData = this.extract
        console.log(this.tableData)
      }
    }
  },
  methods: {
    cellMouseEnter(row) {
      this.currentRow = row
    },
    cellMouseLeave() {
      this.currentRow = ''
    },
    handleEdit(index, row) {
      row.editing = true
      this.prevValue = JSON.parse(JSON.stringify(row))
    },
    handleCancle(index, row) {
      row.editing = false
      const prevKey = this.prevValue.key
      const prevValue = this.prevValue.value
      const prevDesc = this.prevValue.desc
      this.$set(row, 'value', prevValue)
      this.$set(row, 'key', prevKey)
      this.$set(row, 'desc', prevDesc)
    },
    restTemp() {
      this.temp = {
        key: '',
        value: '',
        desc: '',
        editing: true
      }
    },
    handleAdd() {
      this.tableData.push(this.restTemp())
    },
    handleSave() {
      this.save = true
      this.$emit('extract', this.parseExtract(), this.tableData)
    },
    handleDelete(index) {
      this.tableData.splice(index, 1)
    },
    // loadExtract() {
    //   if (this.extract['extract'].length > 0) {
    //     for (const extractDict of this.extract['extract']) {
    //       for (const key in extractDict) {
    //         this.temp['key'] = key
    //         this.temp['value'] = extractDict[key]
    //         this.temp['desc'] = this.extract['desc'][key]
    //         this.tableData.push(this.temp)
    //       }
    //     }
    //   }
    // },
    // 提取格式化后等待提交给step
    parseExtract() {
      const extract = {
        extract: [],
        desc: {}
      }
      for (const content of this.tableData) {
        const key = content['key']
        const value = content['value']
        if (key !== '' && value !== '') {
          const obj = {}
          obj[key] = value
          extract.extract.push(obj)
          extract.desc[key] = content['desc']
        }
      }
      console.log(extract)
      return extract
    }
  }
}
</script>

<style scoped>
</style>
