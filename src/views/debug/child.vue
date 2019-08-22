<template>
  <div class="train-city">
    <h3>父组件传给子组件的toCity:{{ city }}</h3>
    <br><button @click="select(`大连`)">点击此处将‘大连’发射给父组件</button>
  </div>
</template>
<script>
export default {
  name: 'TrainCity',
  props: {
    sendData: {}
  }, // 用来接收父组件传给子组件的数据
  data() {
    return {
      city: ''
    }
  },
  // watch: {
  //   sendData() {
  //     this.city = this.sendData
  //   }
  // },
  created() {
    this.city = this.sendData
  },
  methods: {
    select(val) {
      const data = {
        cityname: val
      }
      this.$emit('showCityName', data)// select事件触发后，自动触发showCityName事件
    }
  }
}
</script>

<style scoped>

</style>
