<template>
  <div>
    <div id="main" class="main" style="width: 600px;height:400px;"></div><!-- 这样的表示一个页面节点 -->
    <el-input readonly v-model="rec"></el-input><!-- 这样的表示一个页面节点 -->
    <el-input v-model="input" placeholder="请输入内容"></el-input>
    <el-button @click="doPublish()">提交</el-button>
  </div>
</template>

<script>
import mqtt from 'mqtt'
require('fast-text-encoding')
const echarts = require('echarts');
export default {
  name: 'Home',
  components: {},
  data() { //页面全局数据，一些不是函数内的数据尽量再这声明
    return {
      //实时数据数组
      date: [120, 132, 101, 134, 90, 230, 210],
      yao: [120, 132, 101, 134, 90, 230, 210],
      gua: [120, 132, 101, 134, 90, 230, 210],
      qi: [120, 132, 101, 134, 90, 230, 210],

      input: '',
      connection: { //数据不需要声明类型，这种就是对象
        host: '119.29.4.214',
        port: 8083,
        endpoint: '/mqtt',
        clean: true, // 保留会话
        connectTimeout: 4000, // 超时时间
        reconnectPeriod: 4000, // 重连时间间隔
        // 认证信息
        clientId: 'mqttjs_3be2c321',
        username: 'shang', //我给你一个账号，这个账号可以多个设备公用，clientId不同就可以
        password: '123456',
      },
      subscription: {
        topic: 'test1', //这是主题名字，最好不要用test我现在测试所以用test,web端要订阅硬件上发数据的主题
        qos: 0,
      },
      publish: {
        topic: 'test', //这是web端发送数据的主题，如果没有下发控制硬件 可以不用调用publish去发消息给下位机，也就是说硬件可以忽略订阅主题这一步，因为它不用接收只用上发
        qos: 0,
        payload: '',
      },
      client: {
        connected: false,
      },
      subscribeSuccess: false, //这种就是bool型，直接：赋值就行，或者不赋值直接: "",为空
      rec: '',
      nowOptions: {
        visualMap: [
          {
            show: true,
            type: 'continuous',
            seriesIndex: 0,
            min: 0,
            max: 400,
          },
        ],
        title: {
          left: 'left',
          text: '电量消耗实时统计',
        },
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            params = params[0]
            var date = new Date(params.name)
            return (
              date.getDate() +
              '/' +
              (date.getMonth() + 1) +
              '/' +
              date.getFullYear() +
              ' : ' +
              params.value[1]
            )
          },
          axisPointer: {
            animation: false,
          },
        },
        grid: {
          top: '15%',
          bottom: '10%',
        },
        xAxis: {
          type: 'time',
          splitLine: {
            show: false,
          },
          triggerEvent: true,
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%'],
          max: 100,
          splitLine: {
            show: false,
          },
        },
        series: [
          {
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: [],
          },
        ],
      },
      // option :{
      //    title: {
      //       text: '折线图'
      //   },
      //   tooltip: {
      //       trigger: 'axis'
      //   },
      //   legend: {
      //       data: ['尧山', '瓜子山', '七星公园']
      //   },
      //   grid: {
      //       left: '3%',
      //       right: '4%',
      //       bottom: '3%',
      //       containLabel: true
      //   },
      //   toolbox: {
      //       feature: {
      //           saveAsImage: {}
      //       }
      //   },
      //   xAxis: {
      //       type: 'category',
      //       boundaryGap: false,
      //       data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      //       //this.date
      //   },
      //   yAxis: {
      //       type: 'value'
      //   },
      //   series: [
      //       {
      //           name: '尧山',
      //           type: 'line',
      //           stack: '总量',
      //           data: [120, 132, 101, 134, 90, 230, 210]
      //           //this.yao
      //       },
      //       {
      //           name: '瓜子山',
      //           type: 'line',
      //           stack: '总量',
      //           data: [220, 182, 191, 234, 290, 330, 310]
      //           // this.gua
      //       },
      //       {
      //           name: '七星公园',
      //           type: 'line',
      //           stack: '总量',
      //           data: [150, 232, 201, 154, 190, 330, 410]
      //           //this.qi
      //       }
      //   ]
      // }
    }
  },

  created() { //vu页面生命周期，页面一创建里边的函数就会被执行
    this.createConnection()
    this.doSubscribe()
    
  },
  mounted() {//vue页面生命周期，页面节点渲染完毕执行
    var myChart = echarts.init(document.getElementById('main')); //为什么再这里执行是因为通过document.getElementById('main')获取了这个节点，如果再created里边执行可能会碰到节点还没有渲染就执行了会报错
    myChart.setOption(this.nowOption);
  },
  methods: { //页面方法，可以再mounted或者created里边直接调用
    // 创建连接
    createConnection() {
      const { host, port, endpoint, ...options } = this.connection
      const connectUrl = `ws://${host}:${port}${endpoint}`
      try {
        this.client = mqtt.connect(connectUrl, options)
      } catch (error) {
        console.log('mqtt.connect error', error)
      }
      this.client.on('connect', () => {
        console.log("连接成功")
      })
      this.client.on('error', error => {
        console.log('Connection failed', error)
      })
      this.client.on('message', (topic, message) => {
        console.log(`Received message ${message} from topic ${topic}`)
        let utf8decoder = new TextDecoder()
        let msg = utf8decoder.decode(message)
        this.rec = msg
      })
      //也可以在这里调用this.doSubscribe()
     // this.doSubscribe()
    },
    doSubscribe() {
      const { topic, qos } = this.subscription
      this.client.subscribe(topic, { qos }, (error, res) => {
        if (error) {
          console.log('Subscribe to topics error', error)
          return
        }
        this.subscribeSuccess = true
        console.log('Subscribe to topics res', res)
        })
    },
    // MQTTX是测试软件
    doPublish() {
      this.publish.payload = this.input
      this.input = ''
      const { topic, qos, payload } = this.publish
      this.client.publish(topic, payload, qos, error => {
        if (error) {
          console.log('Publish error', error)
        }
      })
    },
      nowChart() {
      let that = this
      var data = []
      var now = +new Date()
      var value = Math.random() * 1000
      for (var i = 0; i < 60; i++) {
        now = new Date(+now + this.oneDay)
        data.push(this.randomData(now, value))
      }
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('main'))

      // 绘制图表
      var temp = 59
      let options = Object.assign(that.nowOptions, {})
      options.series.forEach((item) => {
        item.data = data
        item.markPoint = {
          data: [
            [
              {
                symbol: 'none',
                x: '95%',
              },
              {
                symbol: 'circle',
                name: '实时数据',
                value: data[temp].value[1],
                xAxis: data[temp].value[0],
              },
            ],
          ],
        }
      })
      myChart.setOption(options)
      // 1秒定时器
      setInterval(() => {
        for (var i = 0; i < 1; i++) {
          data.shift()
          now = new Date(+now + this.oneDay)
          data.push(this.randomData(now, value))
        }
        myChart.setOption(options)
      }, 1000)
    },
    randomData(now, value) {
      value = Math.random() * 100
      var valueName =
        now.getFullYear() +
        '/' +
        (now.getMonth() + 1) +
        '/' +
        now.getDate() +
        ' ' +
        (now.getHours() >= 10 ? now.getHours() : '0' + now.getHours()) +
        ':' +
        (now.getMinutes() >= 10 ? now.getMinutes() : '0' + now.getMinutes()) +
        ':' +
        (now.getSeconds() >= 10 ? now.getSeconds() : '0' + now.getSeconds())
      return {
        name: now.toString(),
        value: [valueName, Math.round(value)],
      }
    },
  }
}
</script>
<style>
  .main{
    margin: 0 auto;
  }
</style>
