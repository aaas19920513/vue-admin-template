<template>
  <div>
    <div>
      <el-input v-model="toCity" placeholder="请输入变量名"> </el-input>
    </div>
    <train-city :sendData="toCity" @showCityName="updateCity" />
  </div>
</template>

<script>
import TrainCity from './child'
export default {
  name: 'Index',
  components: { TrainCity },
  data: function() {
    return {
      toCity: '北京',
      table: [],
      t: {
        a: '',
        b: ''
      }
    }
  },
  // created() {
  //   this.toCity = JSON.parse(localStorage.getItem('toCity'))
  // },
  created() {
    this.t['a'] = 1
    this.t['b'] = 2
    this.table.push(this.t)
  },
  methods: {
    updateCity(data) { // 触发子组件城市选择-选择城市的事件
      this.toCity = data.cityname// 改变了父组件的值
      // localStorage.setItem('toCity', JSON.stringify(this.toCity))
    }
  }
}
</script>

<style scoped>

</style>
