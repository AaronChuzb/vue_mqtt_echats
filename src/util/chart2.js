
const chart2Option = {
    title: {
        text: '数据来源：卧室节点'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data:['室内温度','室内湿度','MQ135']
    },
    toolbox: {
        /* feature: {
            saveAsImage: {
                name:'奖池监控',
                pixelRatio:2
            }
        } */
    },
    
    xAxis: {
        type: 'category',
        data: [],
        boundaryGap: false,
        axisLabel: {  
            interval:0,  
            rotate:40  
        },
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name:'室内温度',
            type:'line',
            stack: '总量',
            data:[],
            smooth: true,
            showSymbol: false,
            hoverAnimation: false,
        },
        {
            name:'室内湿度',
            type:'line',
            stack: '总量',
            data:[],
            smooth: true,
            showSymbol: false,
            hoverAnimation: false,
        },
        {
            name:'MQ135',
            type:'line',
            stack: '总量',
            data:[],
            smooth: true,
            showSymbol: false,
            hoverAnimation: false,
        }
    ]
};

export {
    chart2Option
  }