function generateRandomData(amount, max) {
    return Array.from({ length: amount }, () => Math.floor(Math.random() * max));
}

Highcharts.chart('container', {
    chart: {
        type: 'column',
        polar: true,
        events: {
            load: function () {
                // Find the highest value among the series.
                const max = this.yAxis[0].dataMax;

                this.yAxis[0].removePlotLine('max');

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
                this.yAxis[0].addPlotLine({
                    id: '1.75*max',
                    value: 1.75 * max,
                    dashStyle: 'Solid',
                    color: '#FD7E7E'
                });
                this.yAxis[0].addPlotLine({
                    id: 'max',
                    value: max,
                    dashStyle: 'Dash',
                    color: '#43BDFF6C'
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
        plotLines: [
            {
                id: 'max',
                dashStyle: 'Dash',
                color: '#43BDFF6C'
            }
        ]
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