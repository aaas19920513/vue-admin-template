<template>
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
        <el-form :inline="true" :model="platform" class="demo-form-inline">
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
  // watch: {
  //   summary: function() {
  //     this.results = this.summary
  //   }
  // },
  props: {
    summary: {}
  },
  data() {
    return {
      results: { 'success': true, 'stat': { 'testcases': { 'total': 1, 'success': 1, 'fail': 0 }, 'teststeps': { 'total': 2, 'failures': 0, 'errors': 0, 'skipped': 0, 'expectedFailures': 0, 'unexpectedSuccesses': 0, 'successes': 2 }}, 'time': { 'start_at': 1566122231.373013, 'duration': 0.5246109962463379 }, 'platform': { 'httprunner_version': '2.1.2', 'python_version': 'CPython 3.7.2', 'platform': 'Windows-10-10.0.17134-SP0' }, 'details': [{ 'success': true, 'stat': { 'total': 2, 'failures': 0, 'errors': 0, 'skipped': 0, 'expectedFailures': 0, 'unexpectedSuccesses': 0, 'successes': 2 }, 'time': { 'start_at': 1566122231.373013, 'duration': 0.5246109962463379 }, 'records': [{ 'name': '搜索歌手信息--周杰伦', 'status': 'success', 'attachment': '', 'meta_datas': { 'name': '搜索歌手信息--周杰伦', 'data': [{ 'request': { 'url': 'http://www.mxnzp.com/api/music/singer/search?keyWord=%E5%91%A8%E6%9D%B0%E4%BC%A6', 'method': 'GET', 'headers': { 'User-Agent': 'python-requests/2.21.0', 'Accept-Encoding': 'gzip, deflate', 'Accept': '*/*', 'Connection': 'keep-alive', 'content-type': 'application/json' }}, 'response': { 'ok': true, 'url': 'http://www.mxnzp.com/api/music/singer/search?keyWord=%E5%91%A8%E6%9D%B0%E4%BC%A6', 'status_code': 200, 'reason': '', 'cookies': {}, 'encoding': 'UTF-8', 'headers': { 'Server': 'nginx', 'Date': 'Sun, 18 Aug 2019 09:57:09 GMT', 'Content-Type': 'application/json;charset=UTF-8', 'Transfer-Encoding': 'chunked', 'Connection': 'keep-alive', 'Vary': 'Accept-Encoding', 'Content-Encoding': 'gzip' }, 'content_type': 'application/json;charset=UTF-8', 'json': { 'code': 1, 'msg': '数据返回成功', 'data': [{ 'singerName': '周杰伦', 'singerId': '7994', 'singerPic': 'http://qukufile2.qianqian.com/data2/pic/046d17bfa056e736d873ec4f891e338f/540336142/540336142.jpg@s_2,w_48,h_48' }] }}}], 'stat': { 'response_time_ms': 398.93, 'elapsed_ms': 366.052, 'content_size': 216 }, 'validators': [{ 'comparator': 'equals', 'check': 'status_code', 'check_value': 200, 'expect': 200, 'expect_value': 200, 'check_result': 'pass' }] }, 'meta_datas_expanded': [{ 'name': '搜索歌手信息--周杰伦', 'data': [{ 'request': { 'url': 'http://www.mxnzp.com/api/music/singer/search?keyWord=%E5%91%A8%E6%9D%B0%E4%BC%A6', 'method': 'GET', 'headers': { 'User-Agent': 'python-requests/2.21.0', 'Accept-Encoding': 'gzip, deflate', 'Accept': '*/*', 'Connection': 'keep-alive', 'content-type': 'application/json' }}, 'response': { 'ok': true, 'url': 'http://www.mxnzp.com/api/music/singer/search?keyWord=%E5%91%A8%E6%9D%B0%E4%BC%A6', 'status_code': 200, 'reason': '', 'cookies': {}, 'encoding': 'UTF-8', 'headers': { 'Server': 'nginx', 'Date': 'Sun, 18 Aug 2019 09:57:09 GMT', 'Content-Type': 'application/json;charset=UTF-8', 'Transfer-Encoding': 'chunked', 'Connection': 'keep-alive', 'Vary': 'Accept-Encoding', 'Content-Encoding': 'gzip' }, 'content_type': 'application/json;charset=UTF-8', 'json': { 'code': 1, 'msg': '数据返回成功', 'data': [{ 'singerName': '周杰伦', 'singerId': '7994', 'singerPic': 'http://qukufile2.qianqian.com/data2/pic/046d17bfa056e736d873ec4f891e338f/540336142/540336142.jpg@s_2,w_48,h_48' }] }}}], 'stat': { 'response_time_ms': 398.93, 'elapsed_ms': 366.052, 'content_size': 216 }, 'validators': [{ 'comparator': 'equals', 'check': 'status_code', 'check_value': 200, 'expect': 200, 'expect_value': 200, 'check_result': 'pass' }] }], 'response_time': '398.93' }, { 'name': '搜索歌手信息--周杰伦copy', 'status': 'success', 'attachment': '', 'meta_datas': { 'name': '搜索歌手信息--周杰伦copy', 'data': [{ 'request': { 'url': 'http://www.mxnzp.com/api/music/singer/search?keyWord=%E5%85%9A%E5%88%9A', 'method': 'GET', 'headers': { 'User-Agent': 'python-requests/2.21.0', 'Accept-Encoding': 'gzip, deflate', 'Accept': '*/*', 'Connection': 'keep-alive', 'content-type': 'application/json' }}, 'response': { 'ok': true, 'url': 'http://www.mxnzp.com/api/music/singer/search?keyWord=%E5%85%9A%E5%88%9A', 'status_code': 200, 'reason': '', 'cookies': {}, 'encoding': 'UTF-8', 'headers': { 'Server': 'nginx', 'Date': 'Sun, 18 Aug 2019 09:57:09 GMT', 'Content-Type': 'application/json;charset=UTF-8', 'Transfer-Encoding': 'chunked', 'Connection': 'keep-alive', 'Vary': 'Accept-Encoding', 'Content-Encoding': 'gzip' }, 'content_type': 'application/json;charset=UTF-8', 'json': { 'code': 1, 'msg': '数据返回成功', 'data': [] }}}], 'stat': { 'response_time_ms': 124.67, 'elapsed_ms': 124.01, 'content_size': 47 }, 'validators': [{ 'comparator': 'equals', 'check': 'status_code', 'check_value': 200, 'expect': 200, 'expect_value': 200, 'check_result': 'pass' }] }, 'meta_datas_expanded': [{ 'name': '搜索歌手信息--周杰伦copy', 'data': [{ 'request': { 'url': 'http://www.mxnzp.com/api/music/singer/search?keyWord=%E5%85%9A%E5%88%9A', 'method': 'GET', 'headers': { 'User-Agent': 'python-requests/2.21.0', 'Accept-Encoding': 'gzip, deflate', 'Accept': '*/*', 'Connection': 'keep-alive', 'content-type': 'application/json' }}, 'response': { 'ok': true, 'url': 'http://www.mxnzp.com/api/music/singer/search?keyWord=%E5%85%9A%E5%88%9A', 'status_code': 200, 'reason': '', 'cookies': {}, 'encoding': 'UTF-8', 'headers': { 'Server': 'nginx', 'Date': 'Sun, 18 Aug 2019 09:57:09 GMT', 'Content-Type': 'application/json;charset=UTF-8', 'Transfer-Encoding': 'chunked', 'Connection': 'keep-alive', 'Vary': 'Accept-Encoding', 'Content-Encoding': 'gzip' }, 'content_type': 'application/json;charset=UTF-8', 'json': { 'code': 1, 'msg': '数据返回成功', 'data': [] }}}], 'stat': { 'response_time_ms': 124.67, 'elapsed_ms': 124.01, 'content_size': 47 }, 'validators': [{ 'comparator': 'equals', 'check': 'status_code', 'check_value': 200, 'expect': 200, 'expect_value': 200, 'check_result': 'pass' }] }], 'response_time': '124.67' }], 'name': '搜索歌手信息--周杰伦copy', 'in_out': { 'in': {}, 'out': {}}}] },
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
