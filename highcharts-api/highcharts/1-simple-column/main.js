function generateRandomData(amount, max) {
    return Array.from({ length: amount }, () => Math.floor(Math.random() * max));
}

Highcharts.chart('container', {
    chart: {
        type: 'column',
        events: {
            load: function () {
                const max = this.yAxis[0].dataMax;
                this.update({
                    yAxis: {
                        max: 2 * max,
                        plotLines: [
                            {
                                value: 1.5 * max,
                                dashStyle: 'Dash',
                                color: '#73FF50',
                                width: 3
                            },
                        ]
                    },
                });
            }
        }
    },
    title: {
        text: ''
    },
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar'],
    },
    yAxis: {
        title: {
            enabled: false
        },
        // If null, it's approximated using tickPixelInterval, which is based on minTickInterval, 
        // which is the minimum distance between the closest points on the axis,
        // which in turn might push the axis above yAxis.max.
        tickInterval: 2.5,
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0,
        },
        series: {
            dataLabels: {
                enabled: true,
                formatter: function () {
                    return this.series.yAxis.dataMax == this.y ? 'max' : '';
                }
            }
        }
    },
    series: [
        {
            name: 'Tokyo',
            type: 'column',
            data: generateRandomData(3, 10)
        },
        {
            name: 'New York',
            type: 'column',
            data: generateRandomData(3, 10)
        },
        {
            name: 'London',
            type: 'column',
            data: generateRandomData(3, 10)
        }
    ]
});