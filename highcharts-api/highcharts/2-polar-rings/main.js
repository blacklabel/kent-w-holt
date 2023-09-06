function generateRandomData(amount, max) {
    return Array.from({ length: amount }, () => Math.floor(Math.random() * max));
}

Highcharts.chart('container', {
    chart: {
        type: 'column',
        polar: true,
        events: {
            load: function () {
                const yAxis = this.yAxis[0];

                const max = yAxis.dataMax;

                this.update({
                    yAxis: {
                        max: 2 * max,
                        plotLines: [
                            {
                                value: 1.5 * max,
                                dashStyle: 'Dash',
                                color: '#73FF50',
                                width: 3
                            }
                        ]
                    }
                });

                yAxis.addPlotLine({
                    id: '1.75*max',
                    value: 1.75 * max,
                    dashStyle: 'Solid',
                    color: '#FD7E7E'
                });

                this.renderer.circle(
                    this.plotLeft + this.pane[0].center[0],
                    this.plotTop + this.pane[0].center[1],

                    // Converts a axis space value into screen space.
                    yAxis.len * (max / yAxis.max)
                ).attr({
                    fill: 'none',
                    stroke: '#43BDFF6C',
                    'stroke-width': 1,
                    'stroke-dasharray': '5,5'
                }).add();
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
        }
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
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