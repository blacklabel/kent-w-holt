Highcharts.chart('part2', {
    chart: {
        animation: false,
        options3d: {
            enabled: true,
            alpha: 10,
            beta: 30,
            depth: 350,
            viewDistance: 5,
            fitToPlot: true,
        },
    },
    title: {
        text: ''
    },
    tooltip: {
        enabled: false
    },
    legend: {
        enabled: false
    },
    xAxis: {
        visible: false
    },
    yAxis: {
        visible: false
    },
    zAxis: {
        visible: false
    },
    series: [
        {
            type: 'pyramid3d',
            data: [ 15654, 4064, 1987, 976, 846 ],
            center: ['50%', '25%'],
            width: '75%',
            height: '50%'
        },
        {
            type: 'funnel3d',
            data: [ 15654, 4064, 1987, 976, 846 ],
            center: ['50%', '75%'],
            neckWidth: '25%',
            neckHeight: '25%',
            width: '75%',
            height: '50%'
        },
    ]
});