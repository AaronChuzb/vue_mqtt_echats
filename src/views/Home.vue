<template>
  <div class="mian">
    <el-container>
      <el-header class="header">
        <h1>基于物联网的室内火灾智能检测</h1>
      </el-header>
      <el-container>
        <el-aside width="25vw" class="aside">
          <div id="temp" class="temp" style="width: 25vw;height:18vw;"></div>
          <h2 style="margin-bottom: 5vh;margin-top: -5vh">室内实时温度</h2>
          <div id="hum" class="hum" style="width: 25vw;height:18vw;"></div>
          <h2 style="margin-bottom: 5vh;margin-top: -5vh">室内实时湿度</h2>
        </el-aside>
        <el-container>
          <el-main class="el_main">
            <div id="chart" class="chart" style="width: 50vw;height:30vw;"></div>
            <div class="aside">
              <div id="mq" class="mq" style="width: 25vw;height:18vw;"></div>
              <h2 style="margin-bottom: 5vh;margin-top: -5vh">室内可燃性气体</h2>
              <div id="hum" class="hum" style="width: 25vw;height:18vw;"></div>
              <h2 style="margin-bottom: 5vh;margin-top: -5vh">火焰传感器</h2>
            </div>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
    
    
    <!-- <el-input readonly v-model="rec"></el-input>
    <el-input v-model="input" placeholder="请输入内容"></el-input>
    <el-button @click="doPublish()">提交</el-button> -->
  </div>
</template>

<script>
import mqtt from 'mqtt'
require('fast-text-encoding')
const echarts = require('echarts');
import { tempOption } from '../util/temp'
import { humOption } from '../util/hum'
import { chartOption } from '../util/chart'
import { mq135Option } from '../util/mq135'
import { formatDate } from '../util/time'

export default {
  name: 'Home',
  components: {},
  data() { //页面全局数据，一些不是函数内的数据尽量再这声明
    return {
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
      
    }
    
  },

  created() { //vu页面生命周期，页面一创建里边的函数就会被执行
    /* this.createConnection()
    this.doSubscribe() */
    
  },
  mounted() {//vue页面生命周期，页面节点渲染完毕执行
    console.log(formatDate())
    var temp = document.getElementById('temp');
    var hum = document.getElementById('hum');
    var chart = document.getElementById('chart');
    var mq135 = document.getElementById('mq');
    var tempChart = echarts.init(temp);
    var humChart = echarts.init(hum);
    var Chart = echarts.init(chart);
    var mq135Chart = echarts.init(mq135);
    tempOption && tempChart.setOption(tempOption);
    humOption && humChart.setOption(humOption);
    chartOption && Chart.setOption(chartOption);
    mq135Option && mq135Chart.setOption(mq135Option);
    setInterval(function() {
        // let random = (Math.random() * 60).toFixed(2) - 0;
        tempOption.series.data[0].value = 30;
        tempChart.setOption(tempOption, true);
        humOption.series.data[0].value = 30;
        humChart.setOption(humOption, true);
        
        if(chartOption.series[0].data.length > 18){
          chartOption.series[0].data.shift()
          chartOption.series[1].data.shift()
          chartOption.series[2].data.shift()
          chartOption.xAxis.data.shift()
        }
        chartOption.xAxis.data.push(formatDate())
        chartOption.series[0].data.push(Math.random()*100)
        chartOption.series[1].data.push(Math.random()*100)
        chartOption.series[2].data.push(Math.random()*100)
        Chart.setOption(chartOption, true)
    }, 1000);
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
    }
  }
}
</script>
<style>
  .main{
    width: 100vw;
    height: 100vh;
  }
  .temp{
    
  }
  .el-header{
    height: 8vw !important;
    text-align: center;
    font-size: 2vw;
  }
  .aside{
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .el_main{
    display: flex;
  }
</style>
