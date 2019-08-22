<<template>
  <div>
    <div class="report">
      <el-card>
        <el-form :model="time" class="demo-form-inline">
          <el-form-item label="开始时间:">
            <span>{{ startTime }}</span>
          </el-form-item>
          <el-form-item label="duration:">
            <span>{{ duration }}S</span>
          </el-form-item>
          <el-form-item label="platform:">
            <span>{{ platform.platform }}</span>
          </el-form-item>
          <el-form-item label="version:">
            <span>{{ platform.python_version }}S</span>
          </el-form-item>
        </el-form>
      </el-card>
      <el-table
        :data="tableData"
        :row-class-name="tableRowClassName"
      >
        <el-table-column label="用例名">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="status">
          <template slot-scope="scope">
            {{ scope.row.status }}
          </template>
        </el-table-column>
        <el-table-column label="responseTime">
          <template slot-scope="scope">
            {{ timeToString(scope.row.response_time /1000) }}S
          </template>
        </el-table-column>
        <el-table-column label="Detail" width="180">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-warning"
          >detail
          </el-button>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Request',
  watch: {
    summary: function() {
      console.log(this.summary)
      this.results = this.summary
      this.detail = this.results.details[0]
      this.time = this.results.time
      this.startTime = this.parseTime(parseInt(this.time['start_at']))
      this.duration = this.timeToString(this.time['duration'])
      this.platform = this.results.platform
      this.tableData = this.results.details[0]['records']
    }
  },
  // computed: {
  //
  // },
  props: {
    summary: {}
  },
  data() {
    return {
      results: [],
      tableData: [],
      detail: '',
      time: '',
      startTime: '',
      platform: '',
      duration: '',
      stepDetail: {
        name: '',
        status: '',
        response_time: '',
        request: [],
        response: []
      }
    }
  },
  created() {
    console.log(this.results)
    console.log(this.results.details[0])
    this.detail = this.results.details[0]
    this.time = this.results.time
    this.startTime = this.parseTime(parseInt(this.time['start_at']))
    this.duration = this.timeToString(this.time['duration'])
    this.platform = this.results.platform
    this.tableData = this.results.details[0]['records']
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
    },
    timeToString(time) {
      return Number(time.toString().match(/^\d+(?:\.\d{0,2})?/))
    },
    // 格式化时间戳
    parseTime(timestamp) {
      var date = new Date(timestamp * 1000)
      var Y = date.getFullYear() + '-'
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      var D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' '
      var h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':'
      var m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':'
      var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      return Y + M + D + h + m + s
    }
  }
}
</script>

<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
  .report {
    width: 80%;
    margin: 0 auto;
  }
</style>

