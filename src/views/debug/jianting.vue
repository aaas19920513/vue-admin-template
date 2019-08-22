<template>
  <div>
    <h1 testsstest />
    <el-table :data="tableList">
      <el-table-column prop="key" label="变量名">
        <template slot-scope="scope">
          <template v-if="scope.row.editing">
            <el-input v-model="scope.row.key" class="edit-input" placeholder="请输入变量名" />
          </template>
          <span v-else>{{ scope.row.key }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="key" label="变量名">
        <template slot-scope="scope">
          <template v-if="scope.row.editing">
            <el-input v-model="scope.row.value" class="edit-input" placeholder="请输入变量名" />
          </template>
          <span v-else>{{ scope.row.value }}</span>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
export default {
  name: 'Jianting',
  data() {
    return {
      tableList: [{ 'key': 'gtest', 'name': 'fsdf' }, { 'key': 'ooooo', 'name': 'tttttt' }],
      newList: []
    }
  },
  computed: {
    step: function() {
      this.tableList.forEach(function(data) {
        console.log(data)
      })
      return ''
    }
  }

}
</script>

<style scoped>

</style>
