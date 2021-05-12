const humOption = {
  series:{
      type: 'gauge',
      center: ["50%", "60%"],
      startAngle: 200,
      endAngle: -20,
      min: 0,
      max: 100,
      splitNumber: 20,
      itemStyle: {
        color: '#007acc'
      },
      progress: {
        show: true,
        width: 10
      },

      pointer: {
        show: false,
      },
      axisLine: {
        lineStyle: {
          width: 10
        },
        
      },
      axisTick: {
        distance: -40,
        splitNumber: 5,
        lineStyle: {
          width: 1,
          color: '#999'
        }
      },
      splitLine: {
        distance: -48,
        length: 10,
        lineStyle: {
          width: 2,
          color: '#999'
        }
      },
      axisLabel: {
        distance: -20,
        color: '#999',
        fontSize: 16
      },
      anchor: {
        show: false
      },
      title: {
        show: false
      },
      detail: {
        valueAnimation: true,
        width: '60%',
        lineHeight: 40,
        height: '15%',
        borderRadius: 8,
        offsetCenter: [0, '-15%'],
        fontSize: 45,
        fontWeight: 'bolder',
        formatter: '{value} %',
        color: 'auto'
      },
      data: [{
        value: 100
      }]
    },
};

export {
  humOption
}