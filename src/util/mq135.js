
const mq135Option = {
    tooltip: {
        formatter: '{a} <br/>{b} : {c}%'
    },
    series: [{
        name: 'Pressure',
        type: 'gauge',
        min: 0,
        max: 1000,
        axisLine: {
            lineStyle: {
                width: 6,
                color: [
                    [0.25, '#FF6E76'],
                    [0.5, '#FDDD60'],
                    [0.75, '#58D9F9'],
                    [1, '#7CFFB2']
                ]
            }
        },
        detail: {
            formatter: '{value}PPM',
            fontSize: 20,
        },
        data: [{
            value: 50,
            name: 'MQ135'
        }]
    }]
};
export { mq135Option }