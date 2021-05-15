<template>
  <div class="mian">
    <el-container>
      <el-header>
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
          <el-submenu index="1">
            <template slot="title">实时消息中心</template>
            <el-menu-item index="1-1">关闭动态更新</el-menu-item>
            <el-menu-item index="1-2">打开动态更新</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">系统操作</template>
            <el-menu-item index="2-1">修改数据来源服务器</el-menu-item>
            <el-menu-item index="2-2">修改订阅主题</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">MQTT操作</template>
            <el-menu-item index="3-1">断线</el-menu-item>
            <el-menu-item index="3-2">重连</el-menu-item>
            <el-menu-item index="3-3">立即连接</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-header>
      <el-container>
        <el-aside width="250px">
          <div class="card_list">
            <h1>节点列表</h1>
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>客厅节点</span>
                <el-button style="float: right; padding: 3px 0;" :style="{'color': (node1.status == '未在线'?'#F56C6C':'#67C23A') }" type="text">{{node1.status}}</el-button>
              </div>
              <div class="node_item">温度：{{node1.temp}}℃</div>
              <div class="node_item">湿度：{{node1.hum}}%</div>
              <div class="node_item">空气质量：{{node1.mq}}ppm</div>
              <div class="node_item">火焰报警器：{{node1.fire}}</div>
            </el-card>
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>卧室节点</span>
                <el-button style="float: right; padding: 3px 0" :style="{'color': (node2.status == '未在线'?'#F56C6C':'#67C23A') }" type="text">{{node2.status}}</el-button>
              </div>
              <div class="node_item">温度：{{node2.temp}}℃</div>
              <div class="node_item">湿度：{{node2.hum}}%</div>
              <div class="node_item">空气质量：{{node2.mq}}ppm</div>
              <div class="node_item">火焰报警器：{{node2.fire}}</div>
            </el-card>
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>新节点</span>
                <el-button style="float: right; padding: 3px 0" type="text">待添加节点</el-button>
              </div>
              <div></div>
            </el-card>
          </div>
        </el-aside>
        <el-main>
          
          <div class="table_data">
            <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
              <el-tab-pane label="实时数据" name="first">
                <h1 style="margin: 0">实时节点数据图表</h1>
                <div style="display: flex; justify-content: center">
                  <el-card class="box-card">
                    <div id="chart" class="chart" style="width: 40vw; height: 20vw"></div>
                  </el-card>
                  <el-card class="box-card" style="margin-left: 2vw">
                    <div id="chart2" class="chart" style="width: 40vw; height: 20vw"></div>
                  </el-card>
                </div>
                <h1>控制区</h1>
                <div class="control_box">
                  <el-card class="box-card" style="width: 10vw">
                    <div slot="header" class="clearfix">
                      <span>灾情指示灯1</span>
                    </div>
                    <div class="button_box">
                      <div><el-button type="primary">打开</el-button></div>
                      <div style="margin-top: 15px"><el-button type="info">关闭</el-button></div>
                    </div>
                  </el-card>
                  <el-card class="box-card" style="margin-left: 1rem; width: 10vw">
                    <div slot="header" class="clearfix">
                      <span>灾情指示灯2</span>
                    </div>
                    <div class="button_box">
                      <div><el-button type="primary">打开</el-button></div>
                      <div style="margin-top: 15px"><el-button type="info">关闭</el-button></div>
                    </div>
                  </el-card>
                  <el-card class="box-card" style="margin-left: 1rem; width: 10vw">
                    <div slot="header" class="clearfix">
                      <span>灭火设备1</span>
                    </div>
                    <div class="button_box">
                      <div><el-button type="primary">打开</el-button></div>
                      <div style="margin-top: 15px"><el-button type="info">关闭</el-button></div>
                    </div>
                  </el-card>
                  <el-card class="box-card" style="margin-left: 1rem; width: 10vw">
                    <div slot="header" class="clearfix">
                      <span>灭火设备2</span>
                    </div>
                    <div class="button_box">
                      <div><el-button type="primary">打开</el-button></div>
                      <div style="margin-top: 15px"><el-button type="info">关闭</el-button></div>
                    </div>
                  </el-card>
                </div>
              </el-tab-pane>
              <el-tab-pane label="历史警报数据" name="second">
                <h1 style="">历史警报数据表</h1>
                <el-table :data="tableData" stripe style="width: 100vw" height="30vw">
                  <el-table-column prop="date" label="时间"></el-table-column>
                  <el-table-column prop="address" label="警报等级"></el-table-column>
                  <el-table-column prop="name" label="数据来源"></el-table-column>
                  <el-table-column prop="name" label="火焰传感器"></el-table-column>
                  <el-table-column prop="name" label="现场温度"></el-table-column>
                  <el-table-column prop="name" label="现场湿度"></el-table-column>
                  <el-table-column prop="name" label="现场空气质量"></el-table-column> 
                </el-table>
                <div>
                  <el-pagination background :hide-on-single-page="true" layout="prev, pager, next" :total="1000"></el-pagination>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-main>
      </el-container>
    </el-container>
    <el-dialog title="修改数据来源服务器" :visible.sync="editServer" width="30%" :before-close="handleClose">
      <span>请按照IPv4地址格式填写</span>
      <el-input v-model="connection.host"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editServer = false; connection.host = host">取 消</el-button>
        <el-button type="primary" @click="editServer = false; reConnection()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改订阅主题" :visible.sync="editSub" width="30%" :before-close="handleClose2">
      <el-input v-model="subscription.topic"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editSub = false; subscription.topic = topics">取 消</el-button>
        <el-button type="primary" @click="editSub = false;reConnection()" >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mqtt from "mqtt";
require("fast-text-encoding");
const echarts = require("echarts");
import { chartOption } from "../util/chart";
import { chart2Option } from "../util/chart2";
import { formatDate } from "../util/time";

export default {
  name: "Home",
  components: {},
  data() {
    //页面全局数据，一些不是函数内的数据尽量再这声明
    return {
      editServer: false,
      editSub: false,
      editUser: true,
      activeIndex: "1",
      activeName: 'first',
      mounted: false,
      dynamic: true,
      host: '', //存放编辑前的服务器地址
      topics: '',//存放编辑前的主题
      username: '',//存放编辑前的用户名
      password: '',//存放编辑前的密码
      tableData: [
        {
          date: "2021-05-14",
          name: "1",
          address: "1",
        },
        {
          date: "2021-05-14",
          name: "1",
          address: "1",
        },
        {
          date: "2021-05-14",
          name: "1",
          address: "1",
        },
        {
          date: "2021-05-14",
          name: "1",
          address: "1",
        },
        {
          date: "2021-05-14",
          name: "1",
          address: "1",
        },
        {
          date: "2021-05-14",
          name: "1",
          address: "1",
        },
        {
          date: "2021-05-14",
          name: "1",
          address: "1",
        },
        {
          date: "2021-05-14",
          name: "1",
          address: "1",
        },
        {
          date: "2021-05-14",
          name: "1",
          address: "1",
        },
        {
          date: "2021-05-14",
          name: "1",
          address: "1",
        }
      ],
      input: "",
      connection: {
        //数据不需要声明类型，这种就是对象
        host: "120.77.251.214",
        port: 8083,
        endpoint: "/mqtt",
        clean: true, // 保留会话
        connectTimeout: 4000, // 超时时间
        reconnectPeriod: 4000, // 重连时间间隔
        // 认证信息
        clientId: "vue",
        username: "",
        password: "",
      },
      subscription: {
        topic: "data",
        qos: 0,
      },
      publish: {
        topic: "jcg_control",
        qos: 0,
        payload: "",
      },
      client: {
        connected: false,
      },
      subscribeSuccess: false, //这种就是bool型，直接：赋值就行，或者不赋值直接: "",为空
      rec: "",
      node1:{
        status: '未在线',
        temp: 0,
        hum: 0,
        mq: 0,
        fire: '正常'
      },
      node2:{
        status: '未在线',
        temp: 0,
        hum: 0,
        mq: 0,
        fire: '正常'
      }
    };
  },

  created() {
    /* this.createConnection()
    this.doSubscribe() */
    this.$axios.get('http://localhost:4000/datalen').then((res)=>{
      console.log(res)
    }).catch((error)=> {
        console.log(error)
    });
  },
  mounted() {
    //vue页面生命周期，页面节点渲染完毕执行
    this.mounted = true
  },
  methods: {
    update(msg){
      var chart = document.getElementById("chart");
      var chart2 = document.getElementById("chart2");
      var Chart = echarts.init(chart);
      var Chart2 = echarts.init(chart2);
      chartOption && Chart.setOption(chartOption);
      chart2Option && Chart2.setOption(chart2Option);
      console.log(msg)
      if(msg.name == 'num1'){
        this.node1.status = '已连接'
        this.node1.temp = parseInt(msg.temp)
        this.node1.hum = parseInt(msg.hum)
        this.node1.mq = parseInt(msg.mq)
        if(msg.fire == '0'){
          this.node1.fire = '正常'
        } else {
          this.node1.fire = '警报'
        }
        if (chartOption.series[0].data.length > 18) {
          chartOption.series[0].data.shift();
          chartOption.series[1].data.shift();
          chartOption.series[2].data.shift();
          chartOption.xAxis.data.shift();
        }
        chartOption.xAxis.data.push(formatDate());
        chartOption.series[0].data.push(msg.temp);
        chartOption.series[1].data.push(msg.hum);
        chartOption.series[2].data.push(msg.mq);
        Chart.setOption(chartOption, true);
      } else if(msg.name == 'num2'){
        this.node2.status = '已连接'
        this.node2.temp = parseInt(msg.temp)
        this.node2.hum = parseInt(msg.hum)
        this.node2.mq = parseInt(msg.mq)
        if(msg.fire == '0'){
          this.node2.fire = '正常'
        } else {
          this.node2.fire = '警报'
        }
        if (chart2Option.series[0].data.length > 18) {
          chart2Option.series[0].data.shift();
          chart2Option.series[1].data.shift();
          chart2Option.series[2].data.shift();
          chart2Option.xAxis.data.shift();
        }
        chart2Option.xAxis.data.push(formatDate());
        chart2Option.series[0].data.push(msg.temp);
        chart2Option.series[1].data.push(msg.hum);
        chart2Option.series[2].data.push(msg.mq);
        Chart2.setOption(chart2Option, true);
      }
    },
    createConnection(){
      const { host, port, endpoint, ...options } = this.connection;
      const connectUrl = `ws://${host}:${port}${endpoint}`;
      try {
        this.client = mqtt.connect(connectUrl, options);
      } catch (error) {
        console.log("mqtt.connect error", error);
      }
      this.client.on("connect", () => {
        console.log("连接成功");
      });
      this.client.on("error", (error) => {
        console.log("Connection failed", error);
      });
      this.client.on("message", (topic, message) => {
        console.log(`Received message ${message} from topic ${topic}`);
        let utf8decoder = new TextDecoder();
        let msg = utf8decoder.decode(message);
        msg = JSON.parse(msg)
        if(this.dynamic){
          this.update(msg)
        }
      });
      this.doSubscribe()
    },
    doSubscribe() {
      const { topic, qos } = this.subscription;
      this.client.subscribe(topic, { qos }, (error, res) => {
        if (error) {
          console.log("Subscribe to topics error", error);
          this.$message.error('订阅主题失败'+error.toString());
          return;
        }
        this.subscribeSuccess = true;
        console.log(res)
        this.$message({
            message: '连接并订阅成功',
            type: 'success'
          });
      });
    },
    doPublish() {
      this.publish.payload = this.input;
      this.input = "";
      const { topic, qos, payload } = this.publish;
      this.client.publish(topic, payload, qos, (error) => {
        if (error) {
          this.$message.error('发送指令失败：'+error.toString());
        }
      });
    },
    destroyConnection() {
      if (this.client.connected) {
        try {
          this.client.end()
          this.client = {
            connected: false,
          }
          this.node1 = {
            status: '未在线',
            temp: 0,
            hum: 0,
            mq: 0,
            fire: '正常'
          }
          this.node2={
            status: '未在线',
            temp: 0,
            hum: 0,
            mq: 0,
            fire: '正常'
          }
          this.$message({
            message: '断开连接成功',
            type: 'success'
          });
        } catch (error) {
          this.$message.error('断开连接失败：'+error.toString());
        }
      } else {
        this.$message({
          message: '此时未连接',
          type: 'warning'
        });
      }
    },
    reConnection(){
      console.log(this.connection)
      if(this.client.connected){
        this.destroyConnection()
      }
      setTimeout(this.createConnection(), 500)
    },
    handleSelect(e) {
      console.log("点击选项", e);
      if(e == '1-1'){
        if(!this.client.connected){
          this.$message.error('请先在MQTT操作中连接');
        } else {
          this.dynamic = false
          this.$message({
            message: '关闭动态更新',
            type: 'warning'
          });
        }
      }
      if(e == '1-2'){
        if(!this.client.connected){
          this.$message.error('请先在MQTT操作中连接');
        } else {
          this.dynamic = true
          this.$message({
            message: '打开动态更新',
            type: 'success'
          });
        }
      }
      if(e == '2-1'){
        this.host = this.connection.host
        this.editServer = true
      }
      if(e == '2-1'){
        this.host = this.connection.host
        this.editServer = true
      }
      if(e == '2-2'){
        this.topics = this.subscription.topic
        this.editSub = true
      }
      if(e == '2-3'){
        this.username = this.connection.username
        this.password = this.connection.password
        this.editUser = true
      }
      if(e == '3-1'){
        this.destroyConnection()
      }
      if(e == '3-2'){
        this.reConnection()
      }
      if(e == '3-3'){
        if(this.mounted){
          if(this.client.connected){
            this.$message({
              message: '已经连接了',
              type: 'warning'
            });
            
          } else {
            this.createConnection()
          }
          
        } else {
          this.$message({
            message: '页面节点未加载完毕，请稍等连接',
            type: 'warning'
          });
        }
        
      }
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleClose(){
      this.connection.host.replace(' ', '')
    },
    handleClose2(){
      this.subscription.topic.replace(' ', '')
    }
  },
};
</script>
<style lang="scss">
.main {
  width: 100vw;
  height: 100vh;
  background: #1e1e1e !important;
}
.card_list {
  padding: 0 0.6rem;
  padding-top: 1.5rem;
}
.box-card {
  margin-top: 2vh;
}
.el-header {
  padding: 0 !important;
}
h1 {
  font-size: 20px;
}
.control_box{
  display: flex;
  // justify-content: space-evenly;
}
.node_item{
  padding: 10px 0;
}
.button_box{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.table_data {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.el-pagination {
  width: 400px;
  margin: 2vh auto;
}
</style>
